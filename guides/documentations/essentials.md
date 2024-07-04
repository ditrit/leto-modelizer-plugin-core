# How Plugin-core works

Leto-modelizer is a tool that allows you to create your own infrastructure code via diagram by using a graphical interface. Behind this interface, the solution writes the code equivalent to the selected bricks (called components) in an infrastructure language as code chosen via a plugin (Terraform, Ansible, Kubernetes resources, etc.).

| Examples of diagrams |
| :--: |
| <img height="400" src="../../documentations/diagrams.png"/> |

Plugin-core is build to contain all the base code needed for modeling tools to create those diagrams in Leto's projects. You can use this library to create your own plugin, by overriding classes and methods. You can take a look at the official plugins below:
- [Terrator-plugin](https://github.com/ditrit/terrator-plugin)
- [Githubator-plugin](https://github.com/ditrit/githubator-plugin)

Here are all classes you can use in your plugin:

```js
DefaultPlugin.js,                // Class that represents the default Plugin structure.
DefaultMetadata.js,              // Class that represents the metadata of a specific declarative code implementation.
DefaultParser.js,                // Class that parses data to Component.
DefaultRender.js,                // Class that compiles a Component to data.
DefaultDrawer.js,                // Class that draws a Component in a graphical representation.
DefaultData.js,                  // Class that represents all data of a Plugin.
DefaultConfiguration.js,         // Class that represents default configuration of a Plugin.
Component.js,                    // Class that represents the base of modeling tools.
ComponentDefinition.js,          // Class that represents the definition of Component's data and constraints.
ComponentAttribute.js,           // Class that adds Attribute in Components.
ComponentAttributeDefinition.js, // Class that defines Component Attributes' data and constraints.
ComponentDrawOption.js,          // Class that represents option for the Component drawing.
ComponentLink.js,                // Class that links Components together.
ComponentLinkDefinition.js,      // Class that defines of the link between Components.
ParseError.js,                   // Class that represents a parsing error. Used by the DefaultParser as default Error.
FileInformation.js,              // Class that represents the object to store all file information.
FileInput.js,                    // Class that represents the object to store the file content.
Tag.js,                          // Class that represents a tag in Leto-modelizer. Used by the DefaultConfiguration class.
Variable.js,                     // Class that represents a variable in a file of a diagram. Used by the DefaultData class.
```

| Plugin lifecycle |
| :--: |
| <img height="400" src="../../documentations/lifecycle.svg"/> |

This is the default lifecycle of plugin usage in Leto Modelizer.

As you can see, plugin-core can be divided in 5 distinct parts:
- Metadata managment
- Generate components from source files (Parser)
- Generate source files from components (Renderer)
- Draw diagrams
- Storage

In each part, we will explain its purpose and its intended function.

## Base of plugin

The base code for a plugin is contained in the `DefaultPlugin` class. This class is the entry point to access all the functionalities of the plugin, like so:

```js
class DefaultPlugin {
  constructor(props = {
    event: null,
    configuration: null,
    pluginData: null,
    pluginDrawer: null,
    pluginMetadata: null,
    pluginParser: null,
    pluginRenderer: null,
  }) {
    this.configuration = props.configuration || new DefaultConfiguration();
    this.data = props.pluginData || new DefaultData(this.configuration, {}, props.event);
    this.__drawer = props.pluginDrawer || new DefaultDrawer(this.data);
    this.__metadata = props.pluginMetadata || new DefaultMetadata(this.data);
    this.__parser = props.pluginParser || new DefaultParser(this.data);
    this.__renderer = props.pluginRenderer || new DefaultRender(this.data);
  }
}
```

The `DefaultPlugin` provides these methods:

- `init`: Init method, to call once before all plugin usages. Call `this.__metadata.parse()` and `this.data.initLinkDefinitions()`.
- `initResources`: Set resources in plugin.
- `resetDrawerActions`: Reset drawer actions.
- `draw`: Draw all data in the html element defined by the id. Call `this.__drawer.draw()`
- `parse`: Convert the content of files into plugin data. Configuration file is used for setting up the components' configuration. Call `this.__parser.parse()` and `this.__parser.parseConfiguration()`.
- `isParsable`: Indicate if this parser can parse this file. Return `this.__parser.isParsable()`.
- `getModels`: Get models from all project files. Return `this.__parser.getModels(files.filter((file) => this.isParsable(file))`.
- `render`: Return all generated files from plugin data. Configuration file is used for saving the components' configuration. Call `this.__renderer.renderConfiguration()` and return `this.__renderer.render().concat(configurationFile)`.
- `arrangeComponentsPosition`: Reorganize nodes layout algorithmically.
- `repositionComponent`: Reposition a component where there is room for it.
- `getComponentPosition`: Get the coordinates to use for component draw options.
- `addComponent`: Create new component with draw option if passed as param. Return `this.data.addComponent()`.

## Metadata management

Metadata represents the structure of components by providing formatted information about components' data.
A component is the building block for creating a diagram. Some components are connected to each other either by links, or because one component may contain another. These actions can be performed through the 'draw' interface or by modifying component attributes in the component panel (in Leto-modelizer).

The global purpose of Metadata is to list all components of the application, define their content, how they are displayed and specify the rules for their various properties.

In practice, Metadata is divided into two parts:

- Declarative Part: get the JSON file that describes the component in a functional way. The format of the JSON file is defined by the plugin, not by the plugin-core.
- Technical Part: Metadata classes are used to convert previous JSON into a list of classes, used in the leto-modelizer to retrieve the list of components and their rules.

| Left: Metadata - Right: Classes from converted metadata |
| :--: |
| <img height="400" src="../../documentations/metadata_storage.png"/> |

Keep in mind that when writing metadata, you are describing the language and how it is supposed to behave visually. For instance, if there is a link between two components, you should include it in the metadata.

Here is the documentation for the [ComponentDefinition](https://ditrit.io/leto-modelizer-plugin-core/ComponentDefinition.html) class.
As you saw in the previous image, component definitions are loaded from a metadata file. Each component definition has:
- A name
- An icon
- Attributes
- ...

| Left: Components list in Leto-modelizer - Middle: Related Metadata - Right: Component Panel |
| :--: |
| <img height="400" src="../../documentations/metadata.png"/> |

Attributes of a component represent all the related properties that can/must be set inside the Component Panel (Right side of the previous image).
Link Definitions can also be loaded from the metadata file (for colored links, dashed links...).

:warning: Property `categories` of `ComponentDefinition` is used to build the tree for component inside the Component Panel.
So for a better organization, feel free to register one or more categories.

Once the component definitions are loaded, components can be instantiated from the components list (Left side of the previous image) in Leto-modelizer.
The DefaultMetadata class provides two methods:

- `validate`: Validate the metadata.
- `parse`: Set all component/link definitions in PluginData from your provided metadata.

See example on how metadata from a JSON is used inside of the terraformMetadata class for Terrator-plugin here (https://github.com/ditrit/terrator-plugin/blob/main/src/metadata/TerraformMetadata.js)

## Renderer

The Renderer is used to serialize all the instantiated components into source files (`.tf` files for Terraform, `.yaml` files for Kubernetes, ...). It uses a templating engine to work, the choice depends on the plugin. For example, terrator-plugin and githubator-plugin are using [Nunjucks templates](https://mozilla.github.io/nunjucks/).

The DefaultRender provides these methods:

- `render`: Transform all provided components in file inputs.
- `renderFiles`: Map all the given components into files and return them.
- `renderConfiguration`: Update configuration file content according to components data.

## Parser

The Parser is used to deserialize files to instantiate components and their attributes.
It uses an external parser to work, the choice of parser depends on the plugin. For example, terrator-plugin is using [ANTLR](https://www.antlr.org/) and githubator-plugin is using [Lidy](https://github.com/ditrit/lidy-js).

The DefaultParser provides these methods:

- `parse`: Convert the content of files into components.
- `getModels`: Get the list of model paths from all parsable files.
- `parseConfiguration`: Set configuration into components.
- `isParsable`: Indicate if this parser can parse this file.

## Draw diagrams

The Drawer is used to generate the diagram from components in storage.
By default, the DefaultDrawer is using [D3 library](https://d3js.org/) to draw the svg of the diagram. Only the `draw` function is called by Leto-Modelizer and used to draw all components and ComponentLinks. You can override this method if you want to use another library.

### Custom Layout

We use the [Elk library](https://eclipse.dev/elk/) to automatically arrange all components with optimal position. Check out the ElkLayout Class to learn how Elk is used for generating a layout. We structured the code to be able to implement another way of managing the layout. Check out the DefaultLayout Class with `arrangeComponentsPosition` and `repositionComponent` methods that can be overridden to implement your own algorithm for automatic components layout.

### Custom component template

By default, we provide a default icon and svg template to draw component.

If you don't want to use them, override them with your svg. See [template.md](https://github.com/ditrit/leto-modelizer-plugin-core/blob/main/guides/svg/template.md).

You can provide multiple icons and templates that can be used by the drawer.

To do that, you have to add the svg of your icons in the folder `public/icons` and the svg of your templates in the folder `public/models`.

## Storage

When the user is making an update (like instantiate a component, update a component's attribute, add a link between components...), the result is stored inside DefaultData.

The DefaultData class exposes all the following data:
- Plugin configuration
- Plugin name
- Plugin version
- Components array
- Variables array
- All component definitions
- All component link definitions
- Parse errors array
- Event manager that contains the function to emit event

So this class also contains all the methods for managing these data (get, add, remove etc...):

- `getComponentById`: Get component by id.
- `renameComponentId`: Rename a component ID and update all its occurence inside link/References attribute type.
- `getComponentsByType`: Get all components corresponding to the given type.
- `addComponent`: Create and add new component inside components list.
- `generateComponentId`: Generate id from definition and components list.
- `removeComponentById`: Remove component by id and all attributes that used this component id.
- `removeLink`: Remove link attribute in components.
- `getLinks`: Get all links from all component attributes.
- `getAttributeValue`: Get the value of an attribute.
- `getLinkedComponentsIds`: Get the ID of the linked component.
- `getVariableValue`: Get the value of a variable.
- `setVariableValue`: Set the value of a variable.
- `getWorkflowLinks`: Build internal links for workflow containers.
- `getUsedLinkDefinitions`: Uniquely get the definitions used for existing links.
- `initLinkDefinitions`: Initialize all link definitions from all component attribute definitions.
- `getChildren`: Get children of container component with corresponding id.
- `getEventLogById`: Get event log by id.
- `emitEvent`: Emit event with log.

## Summary

Here you will find a diagram summarizing the key steps in the plugin-core process.

- renderer generate components from source files and put it in storage
- parser generate source files from components in storage
- drawer generate diagram from components in storage

<img height="400" src="../../documentations/summary.png"/>

## Going further

Components have the (internal) id and the external id.
These two differs in their usage, the id is mostly used internally (drawing, links, etc...) and should never be changed once the component is created.
Whereas the external id (defaulted to the id's value), is used for all other purposes and this one is to be seen by the user of Leto-Modelizer.
As the id is used for all internal matters, several components can have the same external id and it won't affect any links or anything else 
(for an example see terrator-plugin).

Here is a sum up:

|                  | ID        | External ID                          |
|--------------    |-----------|-------------                         |
| internal purpose | Yes       | No                                   |
| Unique           | Yes       | Not necessary                        |
| Can be changed   | No        | Yes                                  |
| Seen by user     | No        | Yes                                  |
| Value            | 'id_X'    | Any string (defaulted to id's value) |
