# CLI Command Reference

Complete reference for all YC-OpenNext CLI commands and options.

## Global Options

Options available for all commands:

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--help` | `-h` | Show help message | - |
| `--version` | `-V` | Show version number | - |
| `--verbose` | `-v` | Enable verbose output | `false` |
| `--quiet` | `-q` | Suppress non-error output | `false` |
| `--config` | `-c` | Path to config file | `yc-opennext.config.js` |

## Commands

### `yc-opennext analyze`

Analyze a Next.js project to detect capabilities and check compatibility.

```bash
yc-opennext analyze [options]
```

#### Options

| Option | Required | Description | Default |
|--------|----------|-------------|---------|
| `--project <path>` | Yes | Path to Next.js project | - |
| `--output <dir>` | No | Output directory for analysis results | - |
| `--format <type>` | No | Output format (json, yaml, table) | `json` |
| `--strict` | No | Fail on compatibility warnings | `false` |

#### Examples

```bash
# Basic analysis
yc-opennext analyze --project ./my-app

# Save analysis results
yc-opennext analyze --project ./my-app --output ./analysis

# Table format output
yc-opennext analyze --project ./my-app --format table

# Strict mode (fail on warnings)
yc-opennext analyze --project ./my-app --strict
```

#### Output

The analyze command outputs a capabilities object:

```json
{
  "nextVersion": "14.2.0",
  "appRouter": true,
  "pagesRouter": false,
  "needsServer": true,
  "needsImage": true,
  "isr": {
    "enabled": true,
    "onDemand": true,
    "tags": true,
    "paths": true
  },
  "middleware": {
    "enabled": true,
    "mode": "edge-emulated"
  },
  "notes": ["Middleware will run in edge-emulated mode"]
}
```

---

### `yc-opennext build`

Build and package a Next.js application for Yandex Cloud deployment.

```bash
yc-opennext build [options]
```

#### Options

| Option | Required | Description | Default |
|--------|----------|-------------|---------|
| `--project <path>` | Yes | Path to Next.js project | - |
| `--output <dir>` | Yes | Output directory for build artifacts | - |
| `--build-id <id>` | No | Custom build identifier | Auto-generated |
| `--standalone` | No | Build in standalone mode | `false` |
| `--skip-build` | No | Skip Next.js build step | `false` |
| `--minify` | No | Minify function code | `true` |
| `--split-chunks` | No | Split large functions | `false` |

#### Examples

```bash
# Basic build
yc-opennext build --project ./my-app --output ./build

# Standalone mode (recommended)
yc-opennext build --project ./my-app --output ./build --standalone

# Custom build ID
yc-opennext build --project ./my-app --output ./build --build-id v1.2.3

# Skip Next.js build (use existing .next)
yc-opennext build --project ./my-app --output ./build --skip-build
```

#### Output Structure

```
build/
├── artifacts/
│   ├── server.zip       # Server function package
│   ├── image.zip        # Image optimizer package
│   └── assets/          # Static files
│       ├── _next/static/
│       └── public/
├── deploy.manifest.json # Deployment configuration
├── capabilities.json    # Detected capabilities
└── openapi-template.json # API Gateway spec
```

---

### `yc-opennext upload`

Upload build artifacts to Yandex Cloud Object Storage.

```bash
yc-opennext upload [options]
```

#### Options

| Option | Required | Description | Default |
|--------|----------|-------------|---------|
| `--build-dir <dir>` | Yes | Directory containing build artifacts | - |
| `--bucket <name>` | Yes | S3 bucket for assets | - |
| `--prefix <prefix>` | Yes | S3 key prefix (build ID) | - |
| `--cache-bucket <name>` | No | S3 bucket for ISR cache | - |
| `--region <region>` | No | Yandex Cloud region | `ru-central1` |
| `--endpoint <url>` | No | S3 endpoint URL | `https://storage.yandexcloud.net` |
| `--parallel <n>` | No | Number of parallel uploads | `4` |
| `--dry-run` | No | Show what would be uploaded | `false` |
| `--ignore <pattern>` | No | Files to ignore (glob pattern) | - |

#### Examples

```bash
# Basic upload
yc-opennext upload \
  --build-dir ./build \
  --bucket my-app-assets \
  --prefix v1

# With cache bucket
yc-opennext upload \
  --build-dir ./build \
  --bucket my-app-assets \
  --cache-bucket my-app-cache \
  --prefix v1

# Dry run to preview
yc-opennext upload \
  --build-dir ./build \
  --bucket my-app-assets \
  --prefix v1 \
  --dry-run

# Parallel uploads
yc-opennext upload \
  --build-dir ./build \
  --bucket my-app-assets \
  --prefix v1 \
  --parallel 10
```

#### Environment Variables

The upload command requires AWS-compatible credentials:

```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
```

---

### `yc-opennext deploy-manifest`

Generate or update a deployment manifest from build artifacts.

```bash
yc-opennext deploy-manifest [options]
```

#### Options

| Option | Required | Description | Default |
|--------|----------|-------------|---------|
| `--build-dir <dir>` | Yes | Build artifacts directory | - |
| `--out <path>` | Yes | Output manifest path | - |
| `--merge <path>` | No | Existing manifest to merge | - |
| `--override <json>` | No | JSON string with overrides | - |

#### Examples

```bash
# Generate manifest
yc-opennext deploy-manifest \
  --build-dir ./build \
  --out ./deploy.manifest.json

# Merge with existing
yc-opennext deploy-manifest \
  --build-dir ./build \
  --out ./deploy.manifest.json \
  --merge ./previous.manifest.json

# Override values
yc-opennext deploy-manifest \
  --build-dir ./build \
  --out ./deploy.manifest.json \
  --override '{"deployment":{"region":"ru-central1-b"}}'
```

---

### `yc-opennext plan`

Preview deployment without executing (shows what would be deployed).

```bash
yc-opennext plan [options]
```

#### Options

| Option | Required | Description | Default |
|--------|----------|-------------|---------|
| `--project <path>` | Yes | Path to Next.js project | - |
| `--compare <version>` | No | Compare with previous version | - |
| `--cost-estimate` | No | Show cost estimation | `false` |

#### Examples

```bash
# Basic plan
yc-opennext plan --project ./my-app

# Compare with previous
yc-opennext plan --project ./my-app --compare v1

# With cost estimation
yc-opennext plan --project ./my-app --cost-estimate
```

---

### `yc-opennext validate`

Validate configuration and deployment readiness.

```bash
yc-opennext validate [options]
```

#### Options

| Option | Required | Description | Default |
|--------|----------|-------------|---------|
| `--manifest <path>` | No | Manifest file to validate | `deploy.manifest.json` |
| `--terraform <dir>` | No | Terraform configuration to validate | - |
| `--bucket <name>` | No | Verify bucket exists and is accessible | - |

#### Examples

```bash
# Validate manifest
yc-opennext validate --manifest ./deploy.manifest.json

# Validate Terraform
yc-opennext validate --terraform ./terraform

# Validate bucket access
yc-opennext validate --bucket my-app-assets
```

---

### `yc-opennext rollback`

Rollback to a previous deployment version.

```bash
yc-opennext rollback [options]
```

#### Options

| Option | Required | Description | Default |
|--------|----------|-------------|---------|
| `--to <version>` | Yes | Version to rollback to | - |
| `--terraform-dir <dir>` | No | Terraform directory | `./terraform` |
| `--auto-approve` | No | Skip confirmation | `false` |

#### Examples

```bash
# Rollback to specific version
yc-opennext rollback --to v1.2.2

# Auto-approve rollback
yc-opennext rollback --to v1.2.2 --auto-approve
```

---

### `yc-opennext logs`

View function logs and metrics.

```bash
yc-opennext logs [options]
```

#### Options

| Option | Required | Description | Default |
|--------|----------|-------------|---------|
| `--function <name>` | No | Function name | All functions |
| `--tail` | No | Follow log output | `false` |
| `--since <time>` | No | Show logs since timestamp | `1h` |
| `--filter <pattern>` | No | Filter log entries | - |

#### Examples

```bash
# View all logs
yc-opennext logs

# Follow specific function
yc-opennext logs --function server --tail

# Logs from last 30 minutes
yc-opennext logs --since 30m

# Filter errors
yc-opennext logs --filter ERROR
```

---

## Configuration File

You can create a `yc-opennext.config.js` file to set default options:

```javascript
module.exports = {
  // Default project path
  project: '.',

  // Build defaults
  build: {
    output: './yc-build',
    standalone: true,
    minify: true,
  },

  // Upload defaults
  upload: {
    region: 'ru-central1',
    endpoint: 'https://storage.yandexcloud.net',
    parallel: 4,
  },

  // Function configuration
  functions: {
    server: {
      memory: 1024,
      timeout: 30,
    },
    image: {
      memory: 512,
      timeout: 30,
    },
  },

  // Custom environment variables
  env: {
    DEBUG: 'yc-opennext:*',
  },
};
```

## Exit Codes

| Code | Description |
|------|-------------|
| `0` | Success |
| `1` | General error |
| `2` | Invalid arguments |
| `3` | Build failed |
| `4` | Upload failed |
| `5` | Validation failed |
| `6` | Compatibility error |
| `7` | Authentication error |

## Debugging

Enable debug output with environment variable:

```bash
DEBUG=yc-opennext:* yc-opennext build --project .
```

Debug specific components:

```bash
# Debug analyzer only
DEBUG=yc-opennext:analyzer yc-opennext analyze --project .

# Debug builder only
DEBUG=yc-opennext:builder yc-opennext build --project .

# Debug uploader only
DEBUG=yc-opennext:uploader yc-opennext upload --build-dir .
```

## Shell Completion

Enable tab completion for your shell:

```bash
# Bash
yc-opennext completion bash > /etc/bash_completion.d/yc-opennext

# Zsh
yc-opennext completion zsh > "${fpath[1]}/_yc-opennext"

# Fish
yc-opennext completion fish > ~/.config/fish/completions/yc-opennext.fish
```