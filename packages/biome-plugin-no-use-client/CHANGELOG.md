# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-01-13

### Added
- Simplified usage with default export configuration
- Support for both `"extends": ["biome-plugin-no-use-client"]` and `"extends": ["biome-plugin-no-use-client/next"]`
- Comprehensive test suite with 57 passing tests
- Enhanced README documentation with usage examples
- Parallel test execution for faster development feedback

### Changed
- Updated package exports to include default export pointing to `next.jsonc`
- Improved vitest configuration for Vitest 4.0.8 compatibility
- Optimized test performance and reliability

### Fixed
- Corrected plugin path resolution for monorepo usage
- Fixed package.json files array to include all necessary configuration files

## [0.1.0] - Previous versions

### Added
- Initial Biome GritQL plugin implementation
- Detection of "use client" directives in Next.js page and layout files
- Support for both single and double quotes
- Comprehensive file pattern matching for App Router structure
- Basic configuration export

[0.2.0]: https://github.com/PieterDePauw/biome-plugin-no-use-client/releases/tag/v0.2.0
[0.1.0]: https://github.com/PieterDePauw/biome-plugin-no-use-client/releases/tag/v0.1.0