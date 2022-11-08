# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [Unreleased]

### Added

- Add `drawLinks`, `getAnchorsPosition` and `getDefaultAnchor` methods in `DefaultDrawer.js`.
- Create a new `draw` method that executes the `drawLinks` and `drawComponents` methods.
- Add the method `addLink` in `DefaultDrawer.js` that add new link between two components.
- Add method `setReferenceAttribute` and `removeAllReferenceAttributes` in Component to update container attribute.
- Add the methods `__addLink` and `__unsetAddLink` in `DefaultDrawer`.

### Changed

- Rename the `draw` method to `drawComponents`.
- Remove method `addChild` from Component.
- Switch action menu position parameter from `absolute` to `fixed`. 

## [0.8.1] - 2022-10-12

### Fixed

- Fix action-menu events (trash & edit)

## [0.8.0] - 2022-10-12

### Added

- Add a feature that displays an action menu when a component is selected.
- Update constructor of Drawer to receive an events object.
- Emit an event on edit, selection and delete components.

## [0.7.0] - 2022-10-05

### Added

- Added a feature that resets the component to its previous position when it is dropped in a wrong container.

### Fixed

- Add `childrenTypes` in `ComponentDefinition`'s props.
- Update `ComponentDefinition`'s tests.

## [0.6.0] - 2022-10-04

## Added

- Demo of `DefaultDrawer`.
- Add feature to drag and drop component into container components in `DefaultDrawer`.
- Install `interactjs` library.
- Added a feature to filter the components that can enter a container.
- Add new attribute `childrenTypes` in the `ComponentDefinition` class.

## Changed

- Updated the demo for more relevance

## Fixed

- Fix the bug that does not define the position of components if no 'container' component exists

## [0.5.0] - 2022-09-01

### Added

- Add property `defaultFileName` in method `render` of `DefaultRender` to indicate the default file name of new component.

### Changed

- Method `render` in `DefaultRender` have to return an array of `FileInput`
- Method `parse` in `DefaultParser` have to use an array of `FileInput` as `inputs`
- Method `isParsable` in `DefaultParser` have to use `FileInformation` instead of `fileName`
- Replace `name` by `fileName` getter in `FileInformation`

### Removed

- Remove constructor from `DefaultMetadata`
- Remove expected `resources` from plugin index

## [0.4.0] - 2022-08-26

### Added

- Add property `definition` in `ComponentAttribute`
- Add property `definition` in `ComponentLink`
- Add property `attributeRef` in `ComponentLinkDefinition`
- Add method `setContainerSize` using `bin-pack` library in `DefaultDrawer`
- Add feature that drawing components in their container and resize it, in  `DefaultDrawer`

### Changed

- Rename fields in `ComponentLink`:
  - `from.id` become `source`
  - `to.id` become `target`
- Improve modules export handling

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

[0.8.1]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.8.1/changelog.md
[0.8.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.8.0/changelog.md
[0.7.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.7.0/changelog.md
[0.6.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.6.0/changelog.md
[0.5.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.5.0/changelog.md
[0.4.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.4.0/changelog.md
[0.3.1]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.3.1/changelog.md
[0.3.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.3.0/changelog.md
[0.2.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.2.0/changelog.md
[0.1.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.1.0/changelog.md
