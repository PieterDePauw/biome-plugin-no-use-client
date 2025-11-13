# biome-plugin-no-use-client

> Biome GritQL plugin that errors when Next.js page/layout files contain "use client" directive

## 📦 Package

This monorepo contains the main Biome plugin and comprehensive test applications for development and validation.

**Looking to use this plugin?** See the [package README](./packages/biome-plugin-no-use-client/README.md) for installation and usage instructions.

**NPM Package:** [`biome-plugin-no-use-client`](https://www.npmjs.com/package/biome-plugin-no-use-client)

## 🏗️ Repository Structure

```
biome-plugin-no-use-client/
├── packages/
│   └── biome-plugin-no-use-client/  # 🚀 Main plugin package (published to NPM)
│       ├── src/                     # GritQL pattern and plugin source
│       ├── tests/                   # Comprehensive test suite
│       ├── next.jsonc              # Biome configuration export
│       └── README.md               # End-user documentation
└── apps/                           # 🧪 Test applications for validation
    ├── test-app-router/            # Next.js App Router structure
    ├── test-app-src-dir/           # App Router with src/ directory
    └── test-strict/                # Strict mode with intentional violations
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 10.22.0

### Development Setup

```bash
# Clone the repository
git clone https://github.com/PieterDePauw/biome-plugin-no-use-client.git
cd biome-plugin-no-use-client

# Install dependencies for all packages
pnpm install

# Run tests across all packages
pnpm test

# Run tests in watch mode during development
pnpm test:watch
```

## 🧪 Testing

The monorepo includes a comprehensive testing strategy:

### Test Types
- **Unit Tests** (45 tests, ~6ms): Fast GritQL pattern validation
- **Integration Tests** (12 tests, ~2s): End-to-end Biome CLI testing
- **Manual Validation**: Multiple Next.js test applications

### Running Tests

```bash
# Run all tests across packages
pnpm test

# Test specific package
cd packages/biome-plugin-no-use-client
pnpm test

# Test with file watching
pnpm test:watch

# Test against all applications
pnpm lint  # Runs plugin against test apps
```

### Test Applications

The `apps/` directory contains Next.js projects that validate plugin behavior:

- **`test-app-router/`**: Standard App Router with intentional violation in `app/invalid-page/page.tsx`
- **`test-app-src-dir/`**: App Router with `src/` directory structure
- **`test-strict/`**: Multiple violations for comprehensive testing

Each app extends the plugin configuration: `"extends": ["biome-plugin-no-use-client"]`

## 🛠️ Development Workflow

### Available Scripts

All scripts leverage Turborepo for efficient task execution:

```bash
# Core Development
pnpm dev              # Start development mode for all apps
pnpm build            # Build all packages
pnpm test             # Run tests across all packages
pnpm test:watch       # Watch mode testing

# Code Quality
pnpm lint             # Lint all packages (includes plugin validation)
pnpm format           # Check formatting across all packages
pnpm format:fix       # Fix formatting issues
pnpm check            # Run Biome checks
pnpm check:fix        # Run Biome checks with automatic fixes

# Maintenance
pnpm clean            # Clean build artifacts and node_modules
```

### Plugin Development

When modifying the GritQL pattern:

```bash
# Navigate to the plugin package
cd packages/biome-plugin-no-use-client

# Edit the pattern
# vim src/no-use-client-on-page.grit

# Run tests to validate changes
pnpm test

# Test against real Next.js apps
cd ../../apps/test-app-router
pnpm lint  # Should detect violations

# Check that components are allowed
# (components/Button.tsx should NOT trigger the plugin)
```

## 📋 Contributing

We welcome contributions! Here's how to get started:

### 1. Fork & Clone
```bash
fork https://github.com/PieterDePauw/biome-plugin-no-use-client
git clone https://github.com/YOUR_USERNAME/biome-plugin-no-use-client.git
cd biome-plugin-no-use-client
```

### 2. Create Feature Branch
```bash
git checkout -b feature/amazing-improvement
```

### 3. Make Changes
- **Plugin Logic**: Edit `packages/biome-plugin-no-use-client/src/no-use-client-on-page.grit`
- **Tests**: Add test cases in `packages/biome-plugin-no-use-client/tests/`
- **Documentation**: Update relevant README files

### 4. Test Your Changes
```bash
# Run all tests
pnpm test

# Test against applications
pnpm lint

# Ensure formatting is correct
pnpm format:fix
```

### 5. Submit Pull Request
```bash
git add .
git commit -m "feat: add amazing improvement"
git push origin feature/amazing-improvement
# Create PR on GitHub
```

### Code Standards

- **Tests Required**: All changes must include appropriate tests
- **Documentation**: Update README files for user-facing changes
- **Format**: Code is automatically formatted with Biome
- **Conventional Commits**: Use conventional commit messages

## 📦 Publishing

The package is published from `packages/biome-plugin-no-use-client/` using a streamlined workflow.

**For maintainers:** See [PUBLISHING.md](./packages/biome-plugin-no-use-client/PUBLISHING.md) for detailed release instructions.

### Quick Release
```bash
# Navigate to package
cd packages/biome-plugin-no-use-client

# One-command release (handles versioning, git tags, and triggers NPM publish)
pnpm release
```

The `np` tool handles local release management, and GitHub Actions automatically publishes to NPM using Trusted Publishing for enhanced security.

## 🏛️ Architecture

### Plugin Architecture
- **GritQL Pattern**: `src/no-use-client-on-page.grit` contains the core detection logic
- **File Matching**: Targets only Next.js page and layout files (`**/page.*`, `**/layout.*`)
- **Directive Detection**: Matches both `"use client"` and `'use client'` patterns
- **Scope Limitation**: Excludes component files and other non-page files

### Configuration Export
- **Default Export**: `"extends": ["biome-plugin-no-use-client"]`
- **Explicit Export**: `"extends": ["biome-plugin-no-use-client/next"]`
- **Automatic Scoping**: Configuration pre-includes correct file patterns

### Test Strategy
- **Shared Environment**: Integration tests use optimized shared test setup
- **Pattern Extraction**: Unit tests extract regex directly from GritQL file
- **Performance**: Complete test suite runs in ~2 seconds
- **Parallel Execution**: Tests run concurrently for faster feedback

## 🔧 Monorepo Tools

This repository uses modern tooling for efficient development:

- **Package Manager**: [pnpm](https://pnpm.io/) with workspaces
- **Build System**: [Turborepo](https://turbo.build/) for task orchestration
- **Testing**: [Vitest](https://vitest.dev/) with parallel execution
- **Code Quality**: [Biome](https://biomejs.dev/) for linting and formatting
- **Release Management**: [np](https://github.com/sindresorhus/np) with GitHub Actions
- **CI/CD**: GitHub Actions with NPM Trusted Publishing

## 📄 License

MIT © [Pieter De Pauw](https://github.com/PieterDePauw)

---

## 🔗 Links

- **NPM Package**: [biome-plugin-no-use-client](https://www.npmjs.com/package/biome-plugin-no-use-client)
- **Documentation**: [Package README](./packages/biome-plugin-no-use-client/README.md)
- **Issues**: [GitHub Issues](https://github.com/PieterDePauw/biome-plugin-no-use-client/issues)
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Changelog**: [CHANGELOG.md](./packages/biome-plugin-no-use-client/CHANGELOG.md)