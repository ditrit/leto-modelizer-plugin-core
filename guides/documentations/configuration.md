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
      tags: [],
      isFolderTypeDiagram: true,
      defaultFileName: null,
      defaultFileExtension: null,
      restrictiveFolder: null,
      editor: {
        syntax: null,
      },
    });
  }
}

```

In this part, you will see how you can:

- Tag your plugin
- Define the type for your plugin diagram
- Define a default file name and file extension
- Define a restrictive folder
- Set the configuration for the code editor

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
