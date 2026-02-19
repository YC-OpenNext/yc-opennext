#!/bin/bash

# Example script to test YC-OpenNext locally
# Run this from the root directory of the yc-opennext project

set -e

echo "🚀 YC-OpenNext Local Test Script"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "\n${YELLOW}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm is not installed${NC}"
    echo "Install with: npm install -g pnpm"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites OK${NC}"

# Setup project if needed
if [ ! -d "node_modules" ]; then
    echo -e "\n${YELLOW}Setting up project...${NC}"
    pnpm setup
else
    echo -e "\n${YELLOW}Project already set up${NC}"
fi

# Create a test Next.js app if it doesn't exist
TEST_APP_DIR="../test-nextjs-app"

if [ ! -d "$TEST_APP_DIR" ]; then
    echo -e "\n${YELLOW}Creating test Next.js app...${NC}"
    cd ..
    npx create-next-app@latest test-nextjs-app \
        --typescript \
        --app \
        --no-tailwind \
        --no-src-dir \
        --import-alias "@/*" \
        --no-interactive

    cd test-nextjs-app

    # Add a test API route
    mkdir -p app/api/test
    cat > app/api/test/route.ts << 'EOF'
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Hello from YC-OpenNext test!',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
  });
}
EOF

    # Add ISR page
    cat > app/isr/page.tsx << 'EOF'
export const revalidate = 60; // Revalidate every 60 seconds

async function getData() {
  return {
    time: new Date().toISOString(),
    random: Math.random(),
  };
}

export default async function ISRPage() {
  const data = await getData();

  return (
    <div>
      <h1>ISR Page</h1>
      <p>Generated at: {data.time}</p>
      <p>Random value: {data.random}</p>
      <p>This page revalidates every 60 seconds</p>
    </div>
  );
}
EOF

    # Update next.config.js for standalone
    cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['example.com'],
  },
};

module.exports = nextConfig;
EOF

    # Build the test app
    npm run build

    cd ../yc-opennext
else
    echo -e "${GREEN}✅ Test app already exists at $TEST_APP_DIR${NC}"
fi

# Test 1: Analyze
echo -e "\n${YELLOW}Test 1: Analyzing Next.js app...${NC}"
pnpm cli:dev analyze --project "$TEST_APP_DIR" --verbose

# Test 2: Build
echo -e "\n${YELLOW}Test 2: Building for deployment...${NC}"
OUTPUT_DIR="./test-output"
rm -rf "$OUTPUT_DIR"

pnpm cli:dev build \
    --project "$TEST_APP_DIR" \
    --output "$OUTPUT_DIR" \
    --standalone \
    --verbose

# Check build output
if [ -f "$OUTPUT_DIR/deploy.manifest.json" ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo -e "\n${YELLOW}Build artifacts:${NC}"
    ls -la "$OUTPUT_DIR/artifacts/"

    echo -e "\n${YELLOW}Manifest summary:${NC}"
    cat "$OUTPUT_DIR/deploy.manifest.json" | jq '{
        buildId: .buildId,
        nextVersion: .nextVersion,
        capabilities: .capabilities
    }'
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Test 3: Local MinIO upload (optional)
if command -v docker &> /dev/null && docker ps | grep -q minio; then
    echo -e "\n${YELLOW}Test 3: Uploading to local MinIO...${NC}"

    export AWS_ACCESS_KEY_ID=minioadmin
    export AWS_SECRET_ACCESS_KEY=minioadmin

    # Create bucket if needed
    aws --endpoint-url http://localhost:9000 s3 mb s3://test-bucket 2>/dev/null || true

    pnpm cli:dev upload \
        --build-dir "$OUTPUT_DIR" \
        --bucket test-bucket \
        --prefix "test-$(date +%s)" \
        --endpoint http://localhost:9000 \
        --region us-east-1

    echo -e "${GREEN}✅ Upload successful!${NC}"
else
    echo -e "\n${YELLOW}Skipping MinIO upload test (MinIO not running)${NC}"
    echo "To test uploads locally, run:"
    echo "  docker run -d -p 9000:9000 -p 9001:9001 --name minio \\"
    echo "    -e MINIO_ROOT_USER=minioadmin -e MINIO_ROOT_PASSWORD=minioadmin \\"
    echo "    minio/minio server /data --console-address ':9001'"
fi

# Test 4: Fixture tests
echo -e "\n${YELLOW}Test 4: Testing with fixtures...${NC}"
if [ -d "fixtures/next14-mixed" ]; then
    cd fixtures/next14-mixed

    if [ ! -d "node_modules" ]; then
        pnpm install
    fi

    pnpm build
    cd ../..

    pnpm cli:dev analyze --project ./fixtures/next14-mixed

    echo -e "${GREEN}✅ Fixture test successful!${NC}"
else
    echo -e "${YELLOW}Fixtures not found, skipping${NC}"
fi

# Summary
echo -e "\n${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ All local tests completed successfully!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Modify the test app at: $TEST_APP_DIR"
echo "2. Run specific commands:"
echo "   pnpm cli:dev analyze --project $TEST_APP_DIR"
echo "   pnpm cli:dev build --project $TEST_APP_DIR --output ./build"
echo "3. Run in development mode:"
echo "   pnpm dev  # In one terminal"
echo "   pnpm cli:dev <command>  # In another terminal"

echo -e "\n${YELLOW}Useful commands:${NC}"
echo "  pnpm test          # Run tests"
echo "  pnpm lint          # Lint code"
echo "  pnpm build         # Build for production"
echo "  pnpm cli --help    # Show CLI help"