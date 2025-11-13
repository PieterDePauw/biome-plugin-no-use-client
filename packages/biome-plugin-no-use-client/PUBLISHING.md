# Publishing Guide

This document describes how to publish new versions of `biome-plugin-no-use-client` to NPM.

## Prerequisites

1. **NPM Access**: Ensure you're logged in to NPM with publishing permissions
   ```bash
   npm whoami  # Should show: pieterdepauw
   ```

2. **2FA Enabled**: Two-factor authentication should be enabled for security
   ```bash
   npm profile get  # Check 2FA status
   ```

3. **Clean Working Directory**: All changes should be committed
   ```bash
   git status  # Should show clean working directory
   ```

## Publishing Process

The publishing workflow is streamlined using the `np` tool, which is already configured.

### Step 1: Navigate to Package Directory
```bash
cd /Users/pieter/GitHub/biome-plugin-no-use-client/packages/biome-plugin-no-use-client
```

### Step 2: Run Tests (Optional - np will do this automatically)
```bash
pnpm test
```

### Step 3: Publish
```bash
pnpm release
```

That's it! The `np` tool will guide you through the process with interactive prompts.

## What `np` Does Automatically

When you run `pnpm release`, the `np` tool will:

1. **Pre-flight Checks**:
   - Verify git working directory is clean
   - Check you're on the correct branch (usually main/master)
   - Run tests to ensure everything passes

2. **Version Selection**:
   - Prompt you to choose version bump type:
     - `patch` (0.2.0 → 0.2.1) - Bug fixes
     - `minor` (0.2.0 → 0.3.0) - New features
     - `major` (0.2.0 → 1.0.0) - Breaking changes

3. **Release Process**:
   - Update package.json version
   - Update CHANGELOG.md (if configured)
   - Create git commit with version bump
   - Create git tag (e.g., v0.2.1)
   - Push commits and tags to GitHub
   - Publish package to NPM
   - Create GitHub release (optional)

## Version Selection Guidelines

Choose the appropriate version bump based on the changes:

### Patch (0.2.x)
- Bug fixes
- Documentation improvements
- Internal refactoring with no API changes
- Performance improvements

### Minor (0.x.0)
- New features that are backwards compatible
- New configuration options
- Additional file patterns supported
- New export paths

### Major (x.0.0)
- Breaking changes to the GritQL pattern
- Removal of deprecated features
- Changes that require users to modify their configuration
- Minimum Node.js version increases

## Troubleshooting

### Tests Failing
If tests fail during the publishing process:
```bash
# Run tests manually to see the issue
pnpm test

# Fix any issues, commit changes, then retry
git add .
git commit -m "Fix test issues"
pnpm release
```

### Authentication Issues
If NPM authentication fails:
```bash
# Re-login to NPM
npm login

# Verify login
npm whoami
```

### Version Already Published
If the version already exists on NPM:
```bash
# Check current NPM version
npm view biome-plugin-no-use-client version

# Choose a higher version when prompted by np
```

## Manual Publishing (Not Recommended)

If you need to publish manually for any reason:

```bash
# Update version manually
npm version patch  # or minor/major

# Publish to NPM
npm publish

# Push git changes
git push --follow-tags
```

**Note**: Using `np` is strongly recommended as it handles all these steps correctly and includes safety checks.

## Post-Publishing

After successful publishing:

1. **Verify Release**: Check the package appears on NPM
   ```bash
   pnpm view  # Uses the "view" script to check NPM
   ```

2. **Test Installation**: Test installing the package in a fresh project
   ```bash
   # In a test project
   npm install biome-plugin-no-use-client@latest
   ```

3. **Update Documentation**: Ensure README and other docs reflect any new features

## Configuration

The publishing workflow is configured via these package.json entries:

```json
{
  "scripts": {
    "release": "np",
    "view": "npm view biome-plugin-no-use-client",
    "info": "npm info biome-plugin-no-use-client"
  },
  "files": [
    "src",
    "next.jsonc",
    "README.md",
    "LICENSE"
  ]
}
```

The `files` array controls which files are included in the published package. Only essential files are included to keep the package size small.

## Support

For publishing issues:
- Check the [np documentation](https://github.com/sindresorhus/np)
- Review NPM publishing guidelines
- Ensure all prerequisites are met