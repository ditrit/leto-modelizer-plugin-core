# leto-modelizer-plugin-core

Library that contains all models for modelling tools in Leto's projects.

This library is used to create your own plugin for the [Leto Modelizer](https://github.com/ditrit/leto-modelizer) tool.

## Get started

### Install

```
npm install --save "git://github.com/ditrit/leto-modelizer-plugin-core.git"
```

### Usage

Here is all import you can use in your plugin:

```js
import {
  Component,
  ComponentDefinition,
  ComponentAttributeDefinition,
  ComponentDrawOption,
  ComponentAttribute,
  ComponentLink,
  DefaultDrawer,
  DefaultMetadata,
  DefaultParser,
  DefaultRender,
  ParseError
} from "leto-modelizer-plugin-core";
```

For more information about all imports please refer to [technical documentation](https://ditrit.io/leto-modelizer-plugin-core/v0.2.0/) and [project template](https://github.com/ditrit/leto-modelizer-plugin-template).

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

### Default Plugin structure

For your plugin to be used by `Leto Modelizer`, it needs to have this structure:

```js
// src/index.js
export default {
  PluginDrawer: MyPluginDrawer,     // MyPluginDrawer has to extend DefaultDrawer
  PluginMetadata: MyPluginMetadata, // MyPluginMetadata has to extend DefaultMetadata
  PluginParser: MyPluginParser,     // MyPluginParser has to extend DefaultParser
  PluginRenderer: MyPluginRenderer, // MyPluginRenderer has to extend DefaultRender
  resources,
};
```

`resources` represents an object that contains all your assets for the plugin.
By default, the project template provide a `DefaultModel.svg` and a `DefaultIcon.svg`.

The object `resources` is managed by a [script](https://github.com/ditrit/leto-modelizer-plugin-template/blob/main/scripts/generateResources.js) in the project template for its generation.

### How it works

| Plugin lifecycle |
| :--: |
| <img height="400" src="/documentations/lifecycle.svg"/> |

This is the default lifecycle of plugin usage in Leto Modelizer.

### Plugin creation

Create you plugin project from [leto-modelizer-plugin-template](https://github.com/ditrit/leto-modelizer-plugin-template) and follow the readme section of the template project.

### Technical documentation

Technical documentation can be found [here](https://ditrit.io/leto-modelizer-plugin-core/).

## Default commands

Explanation of usage of scripts in `package.json`.

### build

Build this project in `dist` folder.

### build:docs

Generate documentation with esdoc.

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
├ docs                 ⇨ Contains all files generate by esdoc
├ reports              ⇨ Contains all the report files for sonar
├ src                  ⇨ Contains all files for modelling tools
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

Release tag are only on the `main` branch.

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
