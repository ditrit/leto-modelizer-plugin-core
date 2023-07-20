# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

## [0.18.0] - 2023/07/20

### Added

- Add class `Variable` for variable handling.
- Add properties `name`, `type`, `value` and `category` in `Variable`.
- Add `isVariable` getter in `ComponentAttribute` to check if the attribute is a variable.
- Add methods in `DefaultData`:
  - `getAttributeValue` used to get the value of an attribute.
  - `getLinkedComponentsIds` used to get the ID of the linked component.
  - `getVariableValue` used to get the value of a variable.
  - `setVariableValue` used to set the value of a variable.
  - `getComponentIdFromValue` used to get the ID of a linked resource.

### Changed

- Change `getLinks` method in `DefaultData`

## [0.17.0] - 2023/07/05

### Added

- Add `Tag` class with `type` and `value` for tag.
- Add diagram file information in:
  - `parse` method of `DefaultParser`.
  - `parseConfiguration` method of `DefaultParser`.
  - `renderConfiguration` method of `DefaultRender`.
  - `parse` method of `DefaultPlugin`.
  - `render` method of `DefaultPlugin`.
- Add `restrictiveFolder` in `DefaultConfiguration`.
- Add manual resizing feature for container components.

### Removed

- Method `getModelFolders` from `DefaultPlugin` and `DefautParser`.

## [0.16.0] - 2023/06/06

### Added

- Add `defaultFileExtension` attribute in `DefaultConfiguration`.
- Move `defaultFileName` from `DefaultData` to `DefaultConfiguration`.
- Make `DefaultData` have `DefaultConfiguration` in constructor.
- Add method `getModelFolders` in `DefaultParser`.
- Add delete shortcut to remove components or links.
- Add read-only option to draw function.
- Add resizing on draw function when read-only is activated.
- Add `tags` attribute in `DefaultConfiguration`.

## [0.15.2] - 2023/04/18

### Fixed

- Export missing `DefaultConfiguration` class.

## [0.15.1] - 2023/04/17

### Fixed

- Fixed the bug that made the plugin core crash when reloading with a selected component not yet displayed.

## [0.15.0] - 2023/03/31

### Added

- Migration guides.
- Rework on all events.
- Store of event logs.
- `DefaultConfiguration` in `DefaultPlugin` to store all plugin configurations.
- Documentation to build a svg template.
- Add `translate.x` and `translate.y` properties in `DefaultDrawer` to get the position of the root container.
- Add method `getModels` in `DefaultParser` and `DefaultPlugin`.

### Changed

- Remove old events management in `DefaultDrawer`.
- The `y` position of the component container is now set in the model and not by the drawer.
- The width and height of `#root svg` is now equal of `#root` width and height.

### Fixed

- Prevent auto-updating of dependencies in package-lock with `=` suffix.
- Fix Firefox behavior of component outline property when it is selected.
- Fix `DefaultContainer` in demo resources to have a correct behavior on Firefox.

### Removed

- Remove `width` and `height` from `DefaultDrawer` class and constructor `options`.
- Remove viewBox initialization from `DefaultDrawer`.

## [0.14.0] - 2023/03/01

### Added

- Add method `getAttribute` to get attribute by name for a component in model template.
- Add `getUsedLinkDefinition` in `DefaultData.js` to get the link definitions used by components.
- Add `__initializeArrowMarker` method in `DefaultDrawer.js`.
- Add `actions.zoom.scale` in constructor of `DefaultDrawer.js` to get the zoom scale.
- Add marker definition in `ComponentLinkDefinition` to define the marker of the link.

### Changed

- Change `drawLinks` method in `DefaultDrawer.js` to draw arrow markers on links extremities.

### Fixed

- Fix the links width by multiplying it by the zoom scale.
- Fix `hasError` in `ComponentAttribute.js` to return false when the value of attribute is empty.

## [0.13.0] - 2023/02/09

### Added

- Add menu to create a new linkable component from selected component.
- Add `getDefinedAttributesByType` method in `Component.js`.

### Fixed

- Fix `Component.checkRequiredAttributes` method fails when required attribute is `Boolean` or `Number`.

## [0.12.1] - 2023/02/07

### Fixed

- Fix throw exception for Object or Array attribute in `checkRequiredAttributes` method in `Component.js`.

## [0.12.0] - 2023/02/02

### Added

- Add a lot of e2e tests to improve e2e coverage
- Added layout line length overrides.
- Added `workflow` display type.
  * It is designed for containers where children ordering is significant.
  * Drag and drop reordering of children is supported within these containers
- Add `getDragTarget` method to `DefaultDrawer.js`.
- Add an id to the component's icons for cypress tests.
- Add `hasError` method to `Component.js` to check if a component has an error
- Add methods checking error for all types to `ComponentAttribute.js`
- Add error icon on component SVGs.
- Add `defaultFileName` attribute to manage the default file name of the new components.
- Add method `generateComponentId` in `DefaultData.js` to generate id from definition type.
- Add helper properties for component and attribute: `displayName`, `description` and `url`.

### Changed

- Replace esdoc by jsdoc
- Make configuration readable by user in the configuration file.
- Save component's positions after the layout is automatically generated.
- Change `ComponentAttributeDefinition.` containerRef's type from array to string.
- Change parameter of method `addComponent` in `DefaultData.js` to accept now the definition and optional `folder` path and optional `fileName` path.
- Method `render` of `DefaultPlugin.js` now includes the configuration file.

### Fixed

- Save configuration even if the file content is null.
- Fix drag and drop for e2e tests
- Fix component drag behavior when the mouse click on component's icon or text.
- Fix zoom centered on the mouse.
- Fix cypress tests to works with new drag action.
- Fix error in setReferenceAttribute when there are attributes without definition.

## [0.11.0] - 2022/12/07

### Added

- Method `getchildren` by component id in `DefaultData`.
- Method `getContainerId` on `Component`.
- Add `files` parameter in method `render` of `DefaultRender` and `DefaultPlugin` to list all files managed by the plugin.
- Add `UpdateEvent` to notify modelizer of all updates on components made by user.
- Add attributes in `ComponentAttributeDefinition` to manage customization of link:
  - `LinkColor` to define the color of the link, default black.
  - `LinkWidth` to define the width of the link, default 2px.
  - `LinkDashStyle` to define the dash style of the link, default null for a line link.

### Removed

- Remove attribute `children` of `Component` to transform components tree in components Array.
- Remove `EditEvent` and `DeleteEvent` in `DefaultDrawer`.

### Changed

- Updated `drawLinks` to dynamically select curve type based on components relative positions.
- Replace method `render` by `renderFiles` as method to be overridden by plugin.

### Fixed

- Method `render` in `DefaultRender` now returns files that are no longer linked to components.
- Fixed disabled style application when the origin could have multiple targets.

## [0.10.0] - 2022/11/28

### Added

- Add save and retrieve position of component in `DefaultPlugin`:
  - Add configuration `file` in first argument of method `parse` in `DefaultPlugin`.
  - Add configuration `file` in argument of method `render` in `DefaultPlugin`.
- Add support for manual component positioning.
- Add support for top and bottom link anchors.

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
- Update component rendering in `drawComponents` to use template strings via [nunjucks](https://mozilla.github.io/nunjucks/).

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

[0.18.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.18.0/changelog.md
[0.17.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.17.0/changelog.md
[0.16.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.16.0/changelog.md
[0.15.2]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.15.2/changelog.md
[0.15.1]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.15.1/changelog.md
[0.15.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.15.0/changelog.md
[0.14.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.14.0/changelog.md
[0.13.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.13.0/changelog.md
[0.12.1]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.12.1/changelog.md
[0.12.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.12.0/changelog.md
[0.11.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.11.0/changelog.md
[0.10.0]: https://github.com/ditrit/leto-modelizer-plugin-core/blob/0.10.0/changelog.md
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
