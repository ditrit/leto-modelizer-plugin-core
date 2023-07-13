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

* node - [v18.4](https://nodejs.org/en/blog/release/v18.4.0)
* npm - [v8.19.3](https://www.npmjs.com/package/npm/v/8.19.3)

### Install

```
npm install --save "git://github.com/ditrit/leto-modelizer-plugin-core.git"
```

### Usage

Here is all imports you can use in your plugin:

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
  ParseError,
  FileInformation,
  FileInput,
  DefaultData,
  DefaultPlugin,
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

### Tag your plugin

To help users understand the usage of your plugin, you can tag it using two types of tags:
- `language`: This tag indicates the programming language used in your plugin.
- `category`: This tag assigns an appropriate category to your plugin, such as CI, CD, Workflow, and more.

All tags should be registered in the `DefaultConfiguration`:

```js
new DefaultConfiguration({
  tags: [
    new Tag({ type: 'category', value: 'Infrastructure' }),
    new Tag({ type: 'language', value: 'Terraform' }),
  ],
});
```

### Events

By default, plugin sends event if you provide a `next()` function in DefaultData, like:

```js
new DefaultPlugin({
  event: {
    next: () => {},
  }
})
```

If you do not, events are still stored in the `DefaultData.eventLogs`.

When you create your plugin, you can send event to Leto-modelizer to see the progression of your parsing or rendering action.

See `EventLog` in [technical documentation](https://ditrit.io/leto-modelizer-plugin-core/) for more information.

### Technical documentation

Technical documentation can be found [here](https://ditrit.io/leto-modelizer-plugin-core/).

## Default commands

Explanation of usage of scripts in `package.json`.

### build

Build this project in `dist` folder.

### prepare:docs

Fix betterdocs template for jsdoc and make it work.

### build:docs

Generate documentation with jsdoc.

### demo

Start a sample integration vue dev server.

### lint

Run eslint check on the project.

### lint:fix

Apply default fix for eslint in project.

### lint:report

Generate report of lint issues for sonar.

### lint:watch

To use in development, to see current lint errors with auto-refresh.

### test

Run all the unit tests.

### test:coverage

Generate coverage report of the unit tests.

## Development

### Directory structure

This is the default directory structure we use for this project:

```
leto-modelizer-plugin-core
├ docs                 ⇨ Contains all files generated by esdoc
├ reports              ⇨ Contains all the report files for sonar
├ guides               ⇨ Contains all the guides
│ └  migrations        ⇨ Contains all migration guides
├ src                  ⇨ Contains all files for modeling tools
│ └  models            ⇨ Contains all the models
└ tests                ⇨ Contains all files related to the tests
```

### How to release

We use [Semantic Versioning](https://semver.org/spec/v2.0.0.html) as guideline for the version management.

Steps to release:
- Checkout a branch `release/vX.Y.Z` from the latest `dev`.
- Improve your version number in `package.json`, `package-lock.json` and `changelog.md`.
- Verify the content of the `changelog.md`.
- Build the project
- Commit your modification (with the `dist` content) with this commit's name `Release version X.Y.Z`.
- Create a pull request on github to this branch in `dev`.
- After the previous PR is merged, create a pull request on github to `dev` in `main`.
- After the previous PR is merged, tag the `main` branch with `vX.Y.Z`
- After the tag is push, make the release on the tag in GitHub

### Git: Default branches

The default branch is `main`, we can't commit on it and we can only make a pull request to add some code.

Release tags are only on the `main` branch.

### Git: Branch naming policy

There is the branch naming policy: `[BRANCH_TYPE]/[BRANCH_NAME]`

* `BRANCH_TYPE` is a prefix to describe the purpose of the branch, accepted prefix are:
  * `feature`, used for feature development
  * `bugfix`, used for bug fix
  * `improvement`, used for refacto
  * `library`, used for updating library
  * `prerelease`, used for preparing the branch for the release
  * `release`, used for releasing project
  * `hotfix`, used for applying a hotfix on main
* `BRANCH_NAME` is managed by this regex: `[a-z0-9_-]` (`_` is used as space character).

Examples:

```
# BAD
add_some_test
# GOOD
improvement/unit_test

# BAD
feature/adding-some-feature
# GOOD
feature/adding_some_feature
```
