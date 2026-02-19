# YC-OpenNext Documentation

Beautiful, modern HTML documentation for deploying Next.js on Yandex Cloud.

## 🚀 Running the Docs Locally

You have multiple options to run the documentation locally:

### Option 1: Express Server with Markdown Rendering (Recommended)

```bash
# From the root directory
pnpm docs:install  # First time only
pnpm docs          # Starts server on http://localhost:3001

# Or from docs directory
cd docs
pnpm install       # First time only
pnpm serve         # Starts server on http://localhost:3001
```

This provides:
- ✅ Markdown to HTML conversion
- ✅ Syntax highlighting
- ✅ Navigation sidebar
- ✅ Search functionality
- ✅ Clean, styled interface

### Option 2: Simple HTTP Server

```bash
# From root directory
pnpm docs:simple

# Or manually
npx http-server docs/public -p 3001 -o

# Or with Python
cd docs/public && python3 -m http.server 3001
```

This serves raw markdown files (no styling).

### Option 3: VS Code Preview

1. Open any `.md` file in VS Code
2. Press `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac)
3. View formatted markdown directly in VS Code

### Option 4: Using a Markdown Viewer

```bash
# Install a markdown viewer globally
npm install -g markdown-cli

# View a specific file
markdown docs/public/getting-started/quick-start.md
```

## 📁 Documentation Structure

```
docs/
├── public/                 # All documentation content
│   ├── getting-started/   # Getting started guides
│   │   ├── quick-start.md
│   │   ├── installation.md
│   │   └── first-deployment.md
│   ├── guides/            # How-to guides
│   │   ├── migration-from-vercel.md
│   │   ├── production-best-practices.md
│   │   └── ...
│   ├── api/              # API reference
│   │   ├── cli-commands.md
│   │   ├── configuration.md
│   │   └── manifest-schema.md
│   ├── examples/         # Example projects
│   │   ├── blog-with-isr.md
│   │   ├── ecommerce.md
│   │   └── ...
│   └── reference/        # Technical reference
│       ├── architecture.md
│       ├── compatibility.md
│       └── troubleshooting.md
├── serve.js              # Express documentation server
├── package.json          # Dependencies for docs
└── README.md            # This file
```

## 🌐 Accessing the Documentation

Once running, the documentation is available at:

- **Home**: http://localhost:3001
- **Quick Start**: http://localhost:3001/getting-started/quick-start
- **CLI Reference**: http://localhost:3001/api/cli-commands
- **Migration Guide**: http://localhost:3001/guides/migration-from-vercel
- **Troubleshooting**: http://localhost:3001/reference/troubleshooting

## 🛠️ Development

### Adding New Documentation

1. Create a new `.md` file in the appropriate directory
2. Follow the existing structure and formatting
3. Update navigation if needed (automatic with Express server)

### Markdown Features Supported

- Headers (`# H1`, `## H2`, etc.)
- **Bold** and *italic* text
- `Inline code` and code blocks
- Tables
- Lists (ordered and unordered)
- Links and images
- Blockquotes
- Horizontal rules

### Code Blocks with Syntax Highlighting

\`\`\`javascript
// JavaScript example
const example = "Syntax highlighting works!";
console.log(example);
\`\`\`

\`\`\`bash
# Shell commands
pnpm install
pnpm build
\`\`\`

## 📝 Contributing to Docs

1. Edit markdown files in `docs/public/`
2. Preview changes locally using any method above
3. Submit PR with your changes

## 🔍 Quick Access Scripts

```bash
# Install dependencies
cd docs && pnpm install

# Start documentation server
pnpm serve

# View specific section
open http://localhost:3001/getting-started/quick-start
```

## 📚 Alternative Documentation Viewers

If you prefer other tools:

- **Docusaurus**: Full-featured documentation site generator
- **VitePress**: Vue-powered static site generator
- **MkDocs**: Python-based documentation generator
- **GitBook**: Modern documentation platform

For production deployment, consider using one of these tools for better features and performance.

## 🆘 Troubleshooting

### Port 3001 is already in use

```bash
# Find and kill the process
lsof -i :3001
kill -9 <PID>

# Or use a different port
PORT=3002 pnpm serve
```

### Dependencies not installed

```bash
cd docs
pnpm install
```

### Markdown not rendering correctly

Make sure you're using the Express server (`pnpm serve`) for proper markdown rendering.