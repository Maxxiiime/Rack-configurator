# Changelog

Each version should:

- List its release date in the above format.
- Group changes to describe their impact on the project, as follows:
  `Added` for new features.
  `Changed` for changes in existing functionality.
  `Deprecated` for once-stable features removed in upcoming releases.
  `Removed` for deprecated features removed in this release.
  `Fixed` for any bug fixes.
  `Security` to invite users to upgrade in case of vulnerabilities.

## [1.0.0] - February 21st 2023

### Initial release

## [1.0.1] - April 14th 2023

### Added

- Eslintignore file
- .vscode folder

### Changed

- New prettier and eslint settings
- Add dependencies to readme file

## [1.1.0] - May 4th 2023

### Added

- Error boundary component for handling uncaught errors
- Perf component from r3f-perf package for performance monitoring in dev environment
- Deploy script for deployment via Vercel webhooks
- Added deploy command `npm run deploy:vercel` to package.json to trigger Vercel deploy script

## [1.2.0] - May 23th 2023

### Added

- Option to collapse sidepanel

## [2.0.0] - August 24th 2023

### Added

- Support for TypeScript
- .npmrc example file

### Fixed

- Relative import path for @/stores/
