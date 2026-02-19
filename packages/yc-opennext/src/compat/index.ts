import yaml from 'js-yaml';
import fs from 'fs-extra';
import semver from 'semver';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface FeatureStatus {
  status: 'supported' | 'partial' | 'unsupported' | 'experimental';
  notes?: string;
}

export interface VersionFeatures {
  range: string;
  features: Record<string, FeatureStatus>;
}

export interface CompatMatrix {
  versions: VersionFeatures[];
  edgeRuntimeDifferences: Array<{
    feature: string;
    status: string;
    alternative: string;
  }>;
  ycLimitations: Array<{
    limitation: string;
    value: string;
    impact: string;
  }>;
}

export class CompatibilityChecker {
  private matrix: CompatMatrix;

  constructor() {
    const matrixPath = path.join(__dirname, 'compat.yml');
    const matrixContent = fs.readFileSync(matrixPath, 'utf-8');
    this.matrix = yaml.load(matrixContent) as CompatMatrix;
  }

  /**
   * Check if a Next.js version is supported
   */
  isVersionSupported(version: string): boolean {
    return this.matrix.versions.some((v) => semver.satisfies(version, v.range));
  }

  /**
   * Get feature compatibility for a specific Next.js version
   */
  getFeatureCompatibility(
    version: string,
    feature: string
  ): FeatureStatus | undefined {
    const versionEntry = this.matrix.versions.find((v) =>
      semver.satisfies(version, v.range)
    );

    if (!versionEntry) {
      return undefined;
    }

    return versionEntry.features[feature];
  }

  /**
   * Get all features for a Next.js version
   */
  getAllFeatures(version: string): Record<string, FeatureStatus> | undefined {
    const versionEntry = this.matrix.versions.find((v) =>
      semver.satisfies(version, v.range)
    );

    return versionEntry?.features;
  }

  /**
   * Check compatibility for detected capabilities
   */
  checkCapabilities(
    nextVersion: string,
    capabilities: {
      appRouter: boolean;
      pagesRouter: boolean;
      middleware: boolean;
      serverActions: boolean;
      isr: boolean;
      revalidatePath: boolean;
      revalidateTag: boolean;
    }
  ): {
    compatible: boolean;
    warnings: string[];
    errors: string[];
  } {
    const warnings: string[] = [];
    const errors: string[] = [];

    if (!this.isVersionSupported(nextVersion)) {
      errors.push(
        `Next.js version ${nextVersion} is not supported. Supported ranges: ${this.matrix.versions
          .map((v) => v.range)
          .join(', ')}`
      );
      return { compatible: false, warnings, errors };
    }

    const features = this.getAllFeatures(nextVersion);
    if (!features) {
      errors.push(`Could not determine features for Next.js ${nextVersion}`);
      return { compatible: false, warnings, errors };
    }

    // Check each capability against compatibility matrix
    const checks = [
      {
        enabled: capabilities.appRouter,
        feature: 'appRouter',
        name: 'App Router',
      },
      {
        enabled: capabilities.pagesRouter,
        feature: 'pagesRouter',
        name: 'Pages Router',
      },
      {
        enabled: capabilities.middleware,
        feature: 'middleware',
        name: 'Middleware',
      },
      {
        enabled: capabilities.serverActions,
        feature: 'serverActions',
        name: 'Server Actions',
      },
      { enabled: capabilities.isr, feature: 'isr', name: 'ISR' },
      {
        enabled: capabilities.revalidatePath,
        feature: 'revalidatePath',
        name: 'revalidatePath',
      },
      {
        enabled: capabilities.revalidateTag,
        feature: 'revalidateTag',
        name: 'revalidateTag',
      },
    ];

    for (const check of checks) {
      if (check.enabled) {
        const status = features[check.feature];
        if (!status) {
          warnings.push(`Feature '${check.name}' status unknown for Next.js ${nextVersion}`);
          continue;
        }

        switch (status.status) {
          case 'unsupported':
            errors.push(
              `Feature '${check.name}' is not supported in Next.js ${nextVersion}`
            );
            break;
          case 'partial':
            warnings.push(
              `Feature '${check.name}' has partial support in Next.js ${nextVersion}${
                status.notes ? `: ${status.notes}` : ''
              }`
            );
            break;
          case 'experimental':
            warnings.push(
              `Feature '${check.name}' is experimental in Next.js ${nextVersion}${
                status.notes ? `: ${status.notes}` : ''
              }`
            );
            break;
        }
      }
    }

    // Add edge runtime warnings if middleware is enabled
    if (capabilities.middleware) {
      warnings.push(
        'Middleware will run in edge-emulated mode. See documentation for behavioral differences vs Vercel Edge Runtime.'
      );
    }

    return {
      compatible: errors.length === 0,
      warnings,
      errors,
    };
  }

  /**
   * Get edge runtime differences
   */
  getEdgeRuntimeDifferences() {
    return this.matrix.edgeRuntimeDifferences;
  }

  /**
   * Get YC-specific limitations
   */
  getYCLimitations() {
    return this.matrix.ycLimitations;
  }
}