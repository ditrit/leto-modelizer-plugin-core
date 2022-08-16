# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [0.2.0]

### Added

- Workflow to deploy documentation on Github pages
- Create default class structure draw/metadata/parser/render and their individual tests.
- Add default error for parser
- Add `Draw` and `drawDefaultModel` methods to DefaultDrawer.js
- Add functions to set default component position.
- Add functions to set default component position.
- Add `moveComponent` method to move svg components in modelizer.
- Have specific draw method for template
- Add outline display on select graphical component

### Changed

- Improve all class models and their individual tests.

### Removed

- Remove function renderString for SVG template.

## [0.1.0] - 2022-07-07

### Added

- Setup project (eslint, esdoc, unit test, github's workflow).
- Add new classes LetoObjectNode, LetoTypeNode, LetoAttribute, LetoLink.
- Add function renderString for SVG template.

[0.2.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.2.0/changelog.md
[0.1.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.1.0/changelog.md
