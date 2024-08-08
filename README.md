# leto-modelizer-plugin-core

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-plugin-core&metric=alert_status)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-plugin-core)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-plugin-core&metric=reliability_rating)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-plugin-core)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-plugin-core&metric=sqale_rating)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-plugin-core)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-plugin-core&metric=security_rating)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-plugin-core)

[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-plugin-core&metric=code_smells)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-plugin-core)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-plugin-core&metric=bugs)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-plugin-core)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-plugin-core&metric=vulnerabilities)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-plugin-core)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-plugin-core&metric=sqale_index)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-plugin-core)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-plugin-core&metric=ncloc)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-plugin-core)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-plugin-core&metric=coverage)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-plugin-core)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer-plugin-core&metric=duplicated_lines_density)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer-plugin-core)

[![](https://dcbadge.vercel.app/api/server/zkKfj9gj2C?style=flat&theme=default-inverted)](https://discord.gg/zkKfj9gj2C)

Library that contains all models for modeling tools in Leto's projects.

This library is used to create your own plugin for the [Leto Modelizer](https://github.com/ditrit/leto-modelizer) tool.

## Get started

### Requirements

* node - [v20.16.0](https://nodejs.org/en/blog/release/v20.16.0)
* npm - [v10.8.1](https://www.npmjs.com/package/npm/v/10.8.1)

### Install

```
npm install --save @ditrit/leto-modelizer-plugin-core
```

### Run demo

```bash
git clone git@github.com:ditrit/leto-modelizer-plugin-core.git
cd leto-modelizer-plugin-core
npm install
npm run demo
```

:warning: If you have this error when trying to run demo:
```bash
npm warn reify The "linked" install strategy is EXPERIMENTAL and may contain bugs.
npm error Cannot read properties of undefined (reading 'path')
```

You have to configure npm with:
```bash
npm config set install-strategy hoisted
```

Then 
```bash
rm -rf node_modules
npm install
npm run demo
```

### Usage

Here are all imports you can use in your plugin:

```js
import {
  Component,
  ComponentDefinition,
  ComponentAttributeDefinition,
  ComponentDrawOption,
  ComponentAttribute,
  ComponentLink,
  ComponentLinkDefinition,
  DefaultDrawer,
  DefaultMetadata,
  DefaultParser,
  DefaultRender,
  ParserLog,
  FileInformation,
  FileInput,
  DefaultData,
  DefaultPlugin,
  DefaultConfiguration,
  Tag,
  Variable,
} from "leto-modelizer-plugin-core";
```

For more information about all imports please refer to [technical documentation](https://ditrit.io/leto-modelizer-plugin-core/) and [project template](https://github.com/ditrit/leto-modelizer-plugin-template).

You can use it in that way:

```js
import { DefaultParser } from 'leto-modelizer-plugin-core';

class FruitParser extends DefaultParser {
  parse(inputs) {
    // Write your own parser here
    return {
      components: [/* ... */], // Generated components from parser
      links: [/* ... */]       // Generated component links from parser
    }
  }
}

export default FruitParser;
```

To see a complete example, please refer to [iactor](https://github.com/ditrit/iactor).

## How to create your plugin

You can use [this template repository](https://github.com/ditrit/leto-modelizer-plugin-template) to create your own plugin.

The project template leto-modelizer-plugin-template provides you the default structure of a plugin and all useful scripts to generate resources and other.

It is strongly recommended to use it and the following documentation will make references to it.

Furthermore, in this template there are code comments to explain how to override methods/classes and usages.

### How to create your own models

You can read the [template documentation](/guides/svg/template.md) to see how to create your own models.

### Default Plugin structure

For your plugin to be used by `Leto Modelizer`, it needs to have this structure:

```js
// src/index.js
export default new DefaultPlugin({
  pluginData: MyPluginData,         // MyPluginData has to extend DefaultData
  pluginDrawer: MyPluginDrawer,     // MyPluginDrawer has to extend DefaultDrawer
  pluginMetadata: MyPluginMetadata, // MyPluginMetadata has to extend DefaultMetadata
  pluginParser: MyPluginParser,     // MyPluginParser has to extend DefaultParser
  pluginRenderer: MyPluginRenderer, // MyPluginRenderer has to extend DefaultRender
});
```

### How it works

| Plugin lifecycle |
| :--: |
| <img height="400" src="/documentations/lifecycle.svg"/> |

This is the default lifecycle of plugin usage in Leto Modelizer.

### Plugin creation

Create you plugin project from [leto-modelizer-plugin-template](https://github.com/ditrit/leto-modelizer-plugin-template) and follow the readme section of the template project.

### Plugin configuration

The [configuration.md](https://github.com/ditrit/leto-modelizer-plugin-core/blob/main/guides/documentations/configuration.md) explains how you can configure your plugin.

### Events

By default, the plugin sends events if you provide a `next()` function in DefaultData, like:

```js
new DefaultPlugin({
  event: {
    next: () => {},
  }
})
```

If you do not, events are still stored in the `DefaultData.eventLogs`.

When you create your plugin, you can send events to Leto-modelizer to see the progression of your parsing or rendering action.

See `EventLog` in [technical documentation](https://ditrit.io/leto-modelizer-plugin-core/) for more information.

### Technical documentation

Technical documentation can be found [here](https://ditrit.io/leto-modelizer-plugin-core/).
