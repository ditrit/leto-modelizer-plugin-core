# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [0.3.1] - 2022-08-23

### Fixed

- Add class `ComponentLinkDefinition` in the export of library
- Fix technical documentation
- Fix readme

## [0.3.0] - 2022-08-23

### Added

- Install `bin-pack` library.
- Add definition model for ComponentLink
- Add properties in ComponentAttributeDefiniton:
  - `linkType` used for specify the type of link (`Default` or `Reverse`)
  - `ContainerRef` used for specify the reference of valid container type
  - `definedAttributes` used to specify definition of subattribute in case of `Object` type

### Changed

- Improve `setComponentPosition` method with `bin-pack` library.
- Rename `linkTypes` to `linkRef` in ComponentAttributeDefinition
- Rename method `getComponentDefinitions` to `getDefinitions` in DefaultMetadata.
- Method `getDefinition` will return an object with component and link definitions.

### Removed

- Remove attributes `required` and `displayable` in ComponentDefinition

### Fixed

- Fix link of technical documentation in readme

## [0.2.0] - 2022-08-16

### Added

- Workflow to deploy documentation on GitHub pages
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

[0.3.1]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.3.1/changelog.md
[0.3.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.3.0/changelog.md
[0.2.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.2.0/changelog.md
[0.1.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.1.0/changelog.md
