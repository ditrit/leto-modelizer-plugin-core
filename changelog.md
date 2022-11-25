# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [0.9.1] - 2022/11/24

## Fixed

- Fix display of action menu.
- Emit `EditEvent` only for `Component`.

## [0.9.0] - 2022/11/24

### Added

- Add `drawLinks`, `getAnchorPoint` methods in `DefaultDrawer.js`.
- Create a new `draw` method that executes the `drawLinks` and `drawComponents` methods.
- Add method `setReferenceAttribute` and `removeAllReferenceAttributes` in Component to update container attribute.
- Add default model `DefaultData` to manage all data of the plugin.
- Add default model `DefaultPlugin` to simplify the plugin usage.
- Add method `setEvents` in `DefaultDrawer`.
- Add zoom and pan support.
- Add the method `addLink` in `DefaultDrawer.js` that adds a new link between two components.
- Add `options` prop to `DefaultDrawer` constructor to control rendering behavior.
- Add `createRenderingContext` method to `DefaultDrawer`.
- Add `SVGToScreen` and `screenToSVG` methods to `DefaultDrawer`.
- Add `setDisabledStyle` and `unsetAllDisabledStyles` methods to `DefaultDrawer`.
- Add `dragHandler`, `setupDragBehavior` and  `handleDropEvent` methods to `DefaultDrawer` to control drag and drop interaction.
- Add `startLinkCreationInteraction` and `cancelLinkCreationInteraction` methods to `DefaultDrawer`.
- Add `buildTree`, `setupTiles` and  `__buildLines` methods to `DefaultDrawer` to control the component layout.
- Add method `getLinks` in `DefaultData` to generate all links from all components attributes.
- Add method `getComponentsByType` in `DefaultData`.
- Add method `getAttributeByName` in `Component`.
- Add method `initLinkDefinitions` in `DefaultData` and call it in `init` in `DefaultPlugin`.
- Add method `removeLink` in `DefaultData`.
- Add attribute `name` for method `removeLinkAttribute` of `Component`.
- Add `getMenuAction` that contains all action handler.
- Add support for manual component positioning.

### Changed

- Rename the `draw` method to `drawComponents`.
- Switch action menu position parameter from `absolute` to `fixed`.
- Update constructor of `DefaultDrawer`, `DefaultRenderer`, `DefaultParser` and `DefaultMetadata` to use `DefaultData`.
- Update `draw` method of `DefaultDrawer` to only use the container id.
- Rename method `getDefinitions` of `DefaultMetadata` to `parse` and make it update directly the plugin data.
- Make the method `parse` of `DefaultParser` update directly the plugin data instead of return components, links and errors.
- `DefaultDrawer` constructor props re-ordered to `(pluginData, resources, events, rootId, options)` based on the likelihood of each prop being changed by the user.
- Update `drawComponents` to make full use of d3's api.
- Rename method `removeLinkAttributeById` of `Component` in `removeLinkAttribute`.
- Rework the action menu to have more visual feedback, improve positioning comportment and adapt his content with available actions.

### Removed

- Remove method `addChild` from Component.
- Remove `interactjs` and `bin-pack` dependencies.
- Remove arguments of method `render` of `DefaultRender` to directly use the plugin data.
- Remove `links` from `DefaultData`.

### Fixed
- Fix indentation in `DefaultDrawer`.

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

[0.9.1]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.9.1/changelog.md
[0.9.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.9.0/changelog.md
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
