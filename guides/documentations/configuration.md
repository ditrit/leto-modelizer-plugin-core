# How to set your plugin's configuration

The base code for a plugin is contained in the `DefaultPlugin` class. This class is the entry point to access all the functionalities of the plugin, such as its configuration:

```js
class DefaultPlugin {
  constructor(props = {
    configuration: null,
  }) {
    this.configuration = props.configuration || new DefaultConfiguration();
  }
}
```

The DefaultConfiguration class is used to set your plugin's configuration, like so:

```js
class YourPluginConfiguration extends DefaultConfiguration {
  constructor() {
    super({
      editor: {
        syntax: null,
      },
      restrictiveFolder: null,
      defaultFileName: null,
      defaultFileExtension: null,
      tags: [],
      isFolderTypeDiagram: true,
      extraResources: [],
      rootContainer: {
        margin: 30,
        gap: 50,
      },
      container: {
        margin: 30,
        gap: 50,
      },
      keysBinding: {},
      i18n: {},
    });
  }
}

```

In this part, you will see how you can:

- `editor`: Set the configuration for the code editor.
- `restrictiveFolder`: Define a restrictive folder.
- `defaultFileName`: Define a default file name and file extension.
- `defaultFileExtension`: Define a default file extension.
- `tags`: Tag your plugin
- `isFolderTypeDiagram`: Define the type for your plugin diagram
- `extraResources`: Define extra style, icons, markers or links svg model.
- `rootContainer`: Define root container options, like gap and margin.
- `container`: Define default container options, like gap and margin.
- `keysBinding`: Define key binding for actions.
- `i18n`: Define all specific translations of your plugin.

## Tag your plugin

To help users understand the usage of your plugin, you can tag it using two types of tags:

- `category`: This tag assigns an appropriate category to your plugin, such as CI/CD, Workflow, and more.
- `language`: This tag indicates the programming language used in your plugin.

All tags should be registered in the `DefaultConfiguration`:

```js
new DefaultConfiguration({
  tags: [
    new Tag({ type: 'category', value: 'Infrastructure' }),
    new Tag({ type: 'language', value: 'Terraform' }),
  ],
});
```

## Type of plugin diagram

A diagram is the result of your modeling. It is created by instantiating components, then rendered as declarative code in a file.
There are two types of plugins for creating diagrams:

- `Folder` type: represent a diagram using the contents of a folder containing one or several files.
- `File` type: represent a diagram using the contents of a specified file.

Your plugin diagram type should be registered in the `DefaultConfiguration`:

```js
new DefaultConfiguration({
  isFolderTypeDiagram: false,
});
```

If not specified, it is defaulted to `true`.

## Default file name and file extension

You can define the name of the file that will be created by default with `defaultFileName`. It must contain the name and extension.
You can define the extension required for your plugin files with `defaultFileExtension`. 

Your plugin default file name and file extension should be registered in the `DefaultConfiguration`:

```js
new DefaultConfiguration({
  defaultFileName: 'main.tf',
  defaultFileExtension: 'tf',
});
```

If not specified, both are defaulted to `null`.

## Restrictive folder

Diagram creators can specify that the creation or discovery of diagrams for their plugin should be restricted to a particular folder. You can create as many nodes as you want, but make sure to add the `/` at the end.

Your plugin restrictive folder type should be registered in the `DefaultConfiguration`:

```js
new DefaultConfiguration({
  restrictiveFolder: 'infra/dev/',
});
```

If not specified, it is defaulted to `null`. For example in githubator-plugin, `restrictiveFolder` is equal to `.github/workflows/`.

## Set editor configuration

[Monaco Editor](https://microsoft.github.io/monaco-editor/) is used as a browser-based code editor inside Leto-modelizer. You can configure the syntax for your Plugin.

```js
import PluginSyntax from 'src/configuration/syntax';

new DefaultConfiguration({
  editor: {
    syntax: PluginSyntax,
  },
});
```

See an example of a syntax configuration for [Terraform Plugin](https://github.com/ditrit/terrator-plugin/blob/main/src/configuration/syntax.js).

## Keys binding

You can modify key binding by setting the key name for each key binding.

Each actions, can have one or many associated keys.

Here is default implemented actions associated to a key binding:

- Delete object

Default key is `Suppr` and it used to delete component.

- Toggle object selection

Selection is done by a `shift` click on component. You can choose `shift` or another key to make selection.

But it will always be associated to the mouse click.

- Select all object

Default key is `A` (a uppercase) and is used to select all object in the root container.

- Deselect all object

Default key is `D` (d uppercase) and is used to clear selection.

## Add specific translations

The `i18n` object must include a language attribute where you can organize your translations as needed.
Below is an example of how to set up the i18n object within the `DefaultConfiguration`:

```js
new DefaultConfiguration({
  i18n: {
    'en-us': {
      // Place your translations here.
    },
  }
})
```

Currently, Leto-Modelizer utilizes only the parser error translations from the i18n object.
Here is an example of how to add a specific translation key for parser errors:

```js
new DefaultConfiguration({
  i18n: {
    'en-us': {
      parser: {
        error: {
          test: 'test',
        },
      },
    },
  }
});
```

To use the translation key defined in the `i18n` configuration, declare it when creating a new `ParserLog` instance.
Here’s an example:

```js
new ParserLog({
  message: 'YOUR_PLUGIN_NAME.parser.error.test',
});
```

In this example, 'YOUR_PLUGIN_NAME.parser.error.test' corresponds to the translation key test defined in the `i18n` object.

You can use `extraData` in your translation message to add relevant information:

```js
new DefaultConfiguration({
  i18n: {
    'en-us': {
      parser: {
        error: {
          test: 'test: {extraData}',
        },
      },
    },
  }
});

new ParserLog({
  message: 'YOUR_PLUGIN_NAME.parser.error.test',
  extraData: 'Contextual information',
});
```
