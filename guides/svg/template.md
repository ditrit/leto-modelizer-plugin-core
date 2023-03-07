# How to build a component model

## Example of model :

For this example, we use a container template. It contains all necessary information to understand how to transform
it into a "non-container" template.

### A basic model of container component :

```jsx
<svg class="template" width="250" height="200">
  <rect class="component-hitbox" width="100%" height="100%" fill="white"/>

  <g transform="translate(5,5)">
    <svg id="icon-{{id}}" class="component-icon" width="32" height="32"></svg>

    <g transform="translate(35,0)">
      <text class="component-name" y="1em">{{ name }}</text>
      <text class="component-type" y="2.5em">{{ definition.type }}</text>
    </g>
  </g>

  <g transform="translate(0,50)">
    <svg class="component-container" overflow="visible">
      <rect class="container-background" width="100%" height="100%" fill="whitesmoke"/>
    </svg>
  </g>

  {% if hasError %}
    <g class="component-error">
      <svg width="15" height="15" x="200" y="10" viewBox="0 0 100 100">
        <circle fill="red" r="50" cx="50" cy="50"></circle>
      </svg>
    </g>
  {% endif %}
</svg>
```

### Why I see curly brackets and percent sign in this model ?

As you can see, we have a specific syntax in the template svg with curly brackets `{{ }}` and percent sign `{% %}`. To 
render the template, we use the `nunjucks` templating engine. If you want to know more about it, you can read the
[nunjucks documentation](https://mozilla.github.io/nunjucks/templating.html).

With it, you can display all properties available in your
[Component](https://ditrit.io/leto-modelizer-plugin-core/Component.html) instance. For example, you can display the
component name with `{{ name }}` or the component type with `{{ definition.type }}`.

You can also use these functions :

- `hasError` : return `true` if the component has an error, `false` otherwise.

```jsx
{% if hasError %}
  <text class="component-error" y="2.5em">Error</text>
{% endif % }
```

- `getAttribute(attributeName)` : return the attribute with the given name. For a component with the following
  attributes :

```js
const Component = {
  name: 'MyComponent',
  definition: {
    type: 'MyType'
  },
  attributes: [
    {
      name: 'myAttributeName',
      value: 'foo',
    },
    {
      name: 'myOtherAttributeName',
      value: 'bar',
    },
  ]
}
```

You can display the value of `myAttributeName` like this :

```jsx
<text class="component-my-attribute-name" y="2.5em">
  {{ getAttribute('myAttributeName').value }}
</text>
```

## Step by step

### 1. Create the template :

First you have to create the template with a `<svg></svg>` containing a class `template`. We also need to define the
width and height for the drawer to work properly.

```jsx
<!-- Template -->
<svg class="template" width="250" height="200"></svg>
```

### 2. Add the hitbox :

The hitbox is the area where you can click to select or drag the component. It is usually a `<rect />` but it can be any
shape you want.

**Important :** you need to set the fill attribute and set a `component-hitbox` class.

```jsx
<svg class="template" width="250" height="200">
  <!-- Hitbox -->
  <rect class="component-hitbox" width="100%" height="100%" fill="white"/>
</svg>
```

### 3. Add the icon container :

The icon is the small picture that appears on the component. The drawer will use the icon property of the component 
definition to define which icon will be displayed on the template.

**Important :** you must set the id to `icon-{{id}}` and a class to `component-icon`.

```jsx
<svg class="template" width="250" height="200">
  <rect class="component-hitbox" width="100%" height="100%" fill="white"/>

  <!-- Icon container -->
  <svg id="icon-{{id}}" class="component-icon" width="32" height="32"></svg>
</svg>
```

*Note : the icon will be added and the viewBox will be set by the drawer, you don't need to add it manually.*

### 4. Add the metadata you want to display :

In our case, we want to display the name and the type of the component. To do so, add two `<text></text>` with the
`component-name` and `component-type` classes.

**Important :** we need to use `nunjucks` syntax to render the name and the type.

```jsx
<svg class="template" width="250" height="200">
  <rect class="component-hitbox" width="100%" height="100%" fill="white"/>

  <svg id="icon-{{id}}" class="component-icon" width="32" height="32"></svg>

  <!-- Metadata -->
  <text class="component-name" y="1em">{{ name }}</text>
  <text class="component-type" y="2.5em">{{ definition.type }}</text>
</svg>
```

### 5. Add the container ***(only for container template)*** :

To add a container, you need to add a `<svg></svg>` with a `component-container` class, and inside it, you need to add
a `<rect></rect>` with a `container-background` class.

**Important :** you need to set the `overflow` attribute to `visible` to be able to see the children when you drag them
outside the container. You also need to fill the `container-background` with the `fill` attribute for drop detection.

```jsx
<svg class="template" width="250" height="200">
  <rect class="component-hitbox" width="100%" height="100%" fill="white"/>

  <svg id="icon-{{id}}" class="component-icon" width="32" height="32"></svg>

  <text class="component-name" y="1em">{{ name }}</text>
  <text class="component-type" y="2.5em">{{ definition.type }}</text>

  <!-- Container -->
  <svg class="component-container" overflow="visible">
    <rect class="container-background" width="100%" height="100%" fill="whitesmoke"/>
  </svg>
</svg>
```

### 6. Add the error icon :

This step is not mandatory, but if you want to display an error icon when the component has an error, you need to add
a `<g></g>` with a `component-error` class. We used `nunjucks` to have a conditional rendering. When the component has
an error, we display the error icon. Otherwise, we don't display it.

**Important :** you need to set the `viewBox` attribute to be equal to your icon width and height.

```jsx
<svg class="template" width="250" height="200">
  <rect class="component-hitbox" width="100%" height="100%" fill="white"/>

  <svg id="icon-{{id}}"
       class="component-icon"
       width="32" height="32"></svg>

  <text class="component-name" y="1em">{{ name }}</text>
  <text class="component-type" y="2.5em">{{ definition.type }}</text>

  <svg class="component-container" overflow="visible">
    <rect class="container-background" width="100%" height="100%" fill="whitesmoke"/>
  </svg>

  <!-- Error icon-->
  {% if hasError %}
  <g class="component-error">
    <!-- This is a placeholder, you can define the icon you want by replacing this svg. -->
    <svg width="15" height="15" viewBox="0 0 100 100">
      <circle fill="red" r="50" cx="50" cy="50"></circle>
    </svg>
  </g>
  {% endif %}
</svg>
```

### 7. Position the elements :

Now that we have all the elements, we can position them. We can't use the `x` and `y` attributes, because the Firefox
browser have specific behavior with them. So we use the`<g></g>` element and the `transform` attribute with the
`translate(x,y)` function, to have a new position reference frame for each element of our component.

```jsx
<svg class="template" width="250" height="200">
  <rect class="component-hitbox" width="100%" height="100%" fill="white"/>

  <!-- Position the Icons and Metadata -->
  <g tranform="translate(5,5)">
    <svg id="icon-{{id}}" class="component-icon" width="32" height="32"></svg>
    <g transform="translate(32,0)">
      <text class="component-name" y="1em">{{ name }}</text>
      <text class="component-type" y="2.5em">{{ definition.type }}</text>
    </g>
  </g>

  <!-- Position the container -->
  <g transform="transform(0,50)">
    <svg class="component-container" overflow="visible">
      <rect class="container-background" width="100%" height="100%" fill="whitesmoke"/>
    </svg>
  </g>

  {% if hasError %}
  <!-- Position the error icon -->
  <g class="component-error" transform="translate(150,5)">
    <svg width="15" height="15" viewBox="0 0 100 100">
      <circle fill="red" r="50" cx="50" cy="50"></circle>
    </svg>
  </g>
  {% endif %}
</svg>
```

## Tips and Tricks

### Center an element from component width and height :

To center an element, you need to use the `transform` attribute with the `translate(x,y)` function, and the `x` and `y`
of the element.

**Important :** don't forget to center the `width` and `height` of the `<svg></svg>` that contains the element, so you
don't get a bug with Firefox.

```jsx
<svg class="template" width="200" height="200">
  <!-- Center the rectangle :
  - Set x and/or y to 50% to center from width and/or height
  - Set overflow to visible to be able to see the SVG when it's outside the svg
  -->
  <svg x="50%" y="50%" width="50" height="30" overflow="visible">
    <!-- Translate the circle to the center of the SVG:
    "translate(-rectWidth/2, -rectHeight/2)"
    -->
    <g transform="translate(-25,-15)">
      <rect width="100%" height="100%" fill="black"/>
    </g>
  </svg>
</svg>
```

### Personalize the template :

You can personalize the template by adding attributes to the `<svg></svg>` element, like the `rx` and `ry` to have
rounded corners, or the `stroke` and `stroke-width` to have a border, etc. I invite you to read the
[SVG documentation](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg).
