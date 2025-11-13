# biome-plugin-no-use-client

A Biome GritQL plugin that detects and errors when Next.js page or layout files contain a `"use client"` directive.

## Why?

In Next.js App Router, page and layout files should typically be Server Components by default. Adding `"use client"` to these files can negatively impact performance and should generally be avoided. This plugin helps enforce this best practice by flagging such usage.

## Installation

```bash
npm install --save-dev biome-plugin-no-use-client
# or
pnpm add -D biome-plugin-no-use-client
# or
yarn add -D biome-plugin-no-use-client
```

## Usage

Add the plugin configuration to your `biome.json` or `biome.jsonc` configuration file:

### Recommended Configuration

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["biome-plugin-no-use-client"],
  "linter": {
    "enabled": true
  }
}
```

### Alternative Explicit Configuration

You can also use the explicit path if you prefer:

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "extends": ["biome-plugin-no-use-client/next"],
  "linter": {
    "enabled": true
  }
}
```

Both configurations are equivalent and will automatically scope the plugin to only run on Next.js page and layout files for optimal performance.

### Manual Configuration (Advanced)

If you need full control over the configuration, you can also configure the plugin manually:

```json
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "linter": {
    "enabled": true
  },
  "overrides": [
    {
      "includes": [
        "**/app/**/page.js",
        "**/app/**/page.jsx",
        "**/app/**/page.ts",
        "**/app/**/page.tsx",
        "**/app/**/layout.js",
        "**/app/**/layout.jsx",
        "**/app/**/layout.ts",
        "**/app/**/layout.tsx",
        "**/src/app/**/page.js",
        "**/src/app/**/page.jsx",
        "**/src/app/**/page.ts",
        "**/src/app/**/page.tsx",
        "**/src/app/**/layout.js",
        "**/src/app/**/layout.jsx",
        "**/src/app/**/layout.ts",
        "**/src/app/**/layout.tsx"
      ],
      "plugins": [
        "./node_modules/biome-plugin-no-use-client/src/no-use-client-on-page.grit"
      ]
    }
  ]
}
```

## What it detects

The plugin will error on the following files when they contain `"use client"` or `'use client'` directives:

- `**/page.js`
- `**/page.jsx`
- `**/page.ts`
- `**/page.tsx`
- `**/layout.js`
- `**/layout.jsx`
- `**/layout.ts`
- `**/layout.tsx`

## Examples

### ❌ Will error

```tsx
// app/page.tsx
"use client";

export default function Page() {
  return <div>Hello World</div>;
}
```

```tsx
// app/dashboard/layout.tsx
'use client';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

### ✅ Will not error

```tsx
// app/page.tsx - No directive (Server Component by default)
export default function Page() {
  return <div>Hello World</div>;
}
```

```tsx
// components/Button.tsx - Non-page/layout file
"use client";

export default function Button() {
  return <button>Click me</button>;
}
```

## Error message

When the plugin detects a violation, it will show:

```
Remove the 'use client' directive.
```

## Notes

- The plugin only checks files that match the page/layout naming pattern
- Component files and other non-page/layout files are not affected
- Both single and double quotes are detected
- The directive must appear as a top-level string literal

## Testing

This project includes comprehensive testing infrastructure optimized for performance:

### Test Types

- **Unit Tests** (`tests/unit.test.ts`): Fast tests that validate the GritQL pattern logic
- **Integration Tests** (`tests/integration.test.ts`): End-to-end tests using shared test environment

### Test Fixtures

Test fixtures are available in `tests/fixtures/`:

- `valid/`: Files that should NOT trigger the rule
- `invalid/`: Files that SHOULD trigger the rule
- `edge-cases/`: Complex scenarios and boundary conditions

### Running Tests

```bash
# Run all tests (fast - ~1.5 seconds)
pnpm test

# Run with watch mode for development
pnpm test:watch
```

### Performance Optimizations

The test suite uses several optimizations:
- **Shared test environment**: Single npm install shared across all integration tests
- **Fixture caching**: Test fixture content is preloaded and cached
- **Optimized cleanup**: Minimal file operations between tests

### Contributing

When contributing:

1. Add test fixtures in `tests/fixtures/` for new scenarios
2. Update unit tests for pattern logic changes
3. Add integration tests for new file types or edge cases
4. Run tests to ensure no regressions

## License

MIT
