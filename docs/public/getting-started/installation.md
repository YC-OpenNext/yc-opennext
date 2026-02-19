# Installation Guide

Complete setup instructions for YC-OpenNext and all required dependencies.

## System Requirements

### Minimum Requirements

- **Operating System**: Linux, macOS, or Windows (with WSL2)
- **Node.js**: Version 18.0.0 or higher
- **Package Manager**: npm, yarn, or pnpm
- **Terraform**: Version 1.5.0 or higher
- **Disk Space**: At least 2GB free space
- **Memory**: Minimum 4GB RAM

### Recommended Setup

- **Node.js**: Version 20 LTS
- **Package Manager**: pnpm (for better monorepo support)
- **OS**: Ubuntu 22.04 or macOS 13+
- **Memory**: 8GB+ RAM for large applications

## Installing Prerequisites

### Node.js Installation

#### Using Node Version Manager (Recommended)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Reload shell configuration
source ~/.bashrc

# Install Node.js 20
nvm install 20
nvm use 20

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

#### Using Package Managers

**macOS (Homebrew):**

```bash
brew install node@20
```

**Ubuntu/Debian:**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Windows:**
Download from [nodejs.org](https://nodejs.org) or use [Chocolatey](https://chocolatey.org):

```powershell
choco install nodejs
```

### Terraform Installation

#### Official Installation

```bash
# macOS
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Linux
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# Verify installation
terraform version  # Should show v1.5.x or higher
```

### Yandex Cloud CLI

```bash
# macOS/Linux
curl -sSL https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash

# Restart your shell or run
source ~/.bashrc

# Verify installation
yc version
```

## Installing YC-OpenNext

### Global Installation (Recommended)

```bash
# Using npm
npm install -g @yc-opennext/cli

# Using yarn
yarn global add @yc-opennext/cli

# Using pnpm
pnpm add -g @yc-opennext/cli

# Verify installation
yc-opennext --version
```

### Project-Level Installation

```bash
# Add to your Next.js project
cd your-nextjs-project

# Using npm
npm install --save-dev @yc-opennext/cli

# Using yarn
yarn add -D @yc-opennext/cli

# Using pnpm
pnpm add -D @yc-opennext/cli
```

Add to your `package.json` scripts:

```json
{
  "scripts": {
    "yc:build": "yc-opennext build --project . --output ./yc-build",
    "yc:deploy": "yc-opennext upload --build-dir ./yc-build --bucket $BUCKET"
  }
}
```

## Configuring Yandex Cloud

### 1. Create YC Account

1. Go to [cloud.yandex.com](https://cloud.yandex.com)
2. Sign up with your email
3. Create your first cloud
4. Note your cloud ID and folder ID

### 2. Initialize YC CLI

```bash
# Start interactive setup
yc init

# You'll be prompted for:
# 1. OAuth token (or use service account)
# 2. Cloud selection
# 3. Default folder
# 4. Default availability zone
```

### 3. Create Service Account

```bash
# Create service account
yc iam service-account create \
  --name yc-opennext-sa \
  --description "Service account for YC-OpenNext deployments"

# Assign roles
yc resource-manager folder add-access-binding \
  --id <folder-id> \
  --role editor \
  --service-account-name yc-opennext-sa

# Create static access key
yc iam access-key create \
  --service-account-name yc-opennext-sa \
  --format json > sa-key.json

# Export credentials
export AWS_ACCESS_KEY_ID=$(cat sa-key.json | jq -r .access_key.key_id)
export AWS_SECRET_ACCESS_KEY=$(cat sa-key.json | jq -r .secret)
```

### 4. Set Environment Variables

Create a `.env` file for your project:

```bash
# Yandex Cloud Configuration
YC_CLOUD_ID=b1g8...
YC_FOLDER_ID=b1g9...
YC_REGION=ru-central1

# Storage Configuration
AWS_ACCESS_KEY_ID=YCAJE...
AWS_SECRET_ACCESS_KEY=YCM...
S3_ENDPOINT=https://storage.yandexcloud.net

# Optional: YDB Configuration
YDB_ENDPOINT=grpcs://ydb.serverless.yandexcloud.net:2135
YDB_DATABASE=/ru-central1/b1g.../etn...
```

## Setting Up Development Environment

### VS Code Extensions

Install recommended extensions for better development experience:

```json
{
  "recommendations": [
    "hashicorp.terraform",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "redhat.vscode-yaml"
  ]
}
```

### Git Configuration

```bash
# Clone the repository
git clone https://github.com/yc-opennext/yc-opennext.git
cd yc-opennext

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Verifying Installation

### Check All Components

```bash
# Create a test script: check-setup.sh
#!/bin/bash

echo "Checking YC-OpenNext setup..."

# Check Node.js
echo -n "Node.js: "
node --version || echo "❌ Not installed"

# Check npm/pnpm
echo -n "Package Manager: "
pnpm --version 2>/dev/null || npm --version || echo "❌ Not installed"

# Check Terraform
echo -n "Terraform: "
terraform version -json 2>/dev/null | jq -r .terraform_version || echo "❌ Not installed"

# Check YC CLI
echo -n "YC CLI: "
yc version --format json | jq -r .version || echo "❌ Not installed"

# Check YC-OpenNext
echo -n "YC-OpenNext: "
yc-opennext --version || echo "❌ Not installed"

# Check YC authentication
echo -n "YC Auth: "
yc config list --format json | jq -r .token > /dev/null && echo "✅ Configured" || echo "❌ Not configured"

# Check environment variables
echo -n "AWS Credentials: "
[[ -n "$AWS_ACCESS_KEY_ID" ]] && echo "✅ Set" || echo "❌ Not set"

echo "Setup check complete!"
```

Run the verification:

```bash
chmod +x check-setup.sh
./check-setup.sh
```

### Test Deployment

Create a minimal Next.js app to test:

```bash
# Create test app
npx create-next-app@latest test-app --typescript --app --no-tailwind

cd test-app

# Build with YC-OpenNext
yc-opennext analyze --project .
yc-opennext build --project . --output ./yc-build

# If successful, you're ready to deploy!
```

## Platform-Specific Notes

### macOS

- Install Xcode Command Line Tools: `xcode-select --install`
- Use Homebrew for package management
- May need to allow unsigned binaries in Security settings

### Linux

- Ensure you have `build-essential` installed
- May need to install additional libraries for sharp: `sudo apt-get install libvips-dev`

### Windows

- Use WSL2 for best compatibility
- Install Ubuntu from Microsoft Store
- Follow Linux instructions within WSL2

### Docker Alternative

For consistent environment across platforms:

```dockerfile
FROM node:20-slim

# Install required tools
RUN apt-get update && apt-get install -y \
    curl \
    git \
    jq \
    wget \
    gnupg \
    software-properties-common

# Install Terraform
RUN wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com focal main" | tee /etc/apt/sources.list.d/hashicorp.list \
    && apt-get update && apt-get install -y terraform

# Install YC CLI
RUN curl -sSL https://storage.yandexcloud.net/yandexcloud-yc/install.sh | bash

# Install YC-OpenNext
RUN npm install -g @yc-opennext/cli

WORKDIR /app
```

## Next Steps

Now that you have YC-OpenNext installed:

1. [Deploy your first application](./first-deployment.md)
2. [Configure your Next.js app](../guides/nextjs-configuration.md)
3. [Set up CI/CD](../guides/cicd-integration.md)

## Getting Help

If you encounter installation issues:

- Check our [Troubleshooting Guide](../reference/troubleshooting.md)
- Search [GitHub Issues](https://github.com/yc-opennext/yc-opennext/issues)
- Join our [Community Discussion](https://github.com/yc-opennext/yc-opennext/discussions)
