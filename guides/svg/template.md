# How to build the template for a component svg

This guides will help you to understand how to create a svg model for a component.

We assume that you are familiar with :
- html/css
- svg specification

We use [nunjucks](https://mozilla.github.io/nunjucks/templating.html) as templating engine.

We will explain little think about it, but it's better to take a look at the documentation for this one.

## Nunjucks specification

As you can see, we have a specific syntax in the template svg with curly brackets `{{ }}` and percent sign `{% %}`. To 
render the template, we use the `nunjucks` templating engine.

With it, you can display all properties available in your [Component](https://ditrit.io/leto-modelizer-plugin-core/Component.html) instance. 

For example, you can display the component name with `{{ name }}` or the component type with `{{ definition.type }}`.

You can also use these functions :

### `hasError` 

This function returns `true` if the component has an error, `false` otherwise.

```jsx
{% if hasError %}
  <text>Error</text> {# only display if hasError return true #}
{% endif % }
```

### `getAttribute(attributeName)`

This function returns the attribute with the given name. For a component with the following attributes :

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
<text>
  {{ getAttribute('myAttributeName').value }}
</text>
```

### `getIcon(name)`

This function will return the svg string of the specified icon name from resources.

```jsx
<g>
{{ getIcon('resize') | safe }}
</g>
```

You have to add ` | safe ` in the templating, **otherwise the image won't be added to the final output**.

## Step by step

### 1. Create a valid definition for a component

First you have to create the base of `ComponentDefinition` associated to your svg model:

```js
new ComponentDefinition({
  model: 'DefaultModel',
  isContainer: true,
  defaultWidth: 100,
  defaultHeight: 200,
  minWidth: 100,
  minHeight: 200,
  reservedWidth: 10,
  reservedHeight: 110,
  margin: 15,
  gap: 50,
  (...)
});
```

In this example, only useful property are set for the templating documentation.

### Sizing options explanation

Refer to this image:

![Sizing explanation image.](https://github.com/ditrit/leto-modelizer-plugin-core/blob/main/guides/svg/sizing_schema.png)

You have to define first the default width/height of your component.

After you have to define the minimum width/height.

In this example minimum and default are the same:

- Default/minimum width: 100
- Default/minimum height: 200

Now you have to identify all sizes of fixed objects in your component, here we have:
- padding of 5px inside the component.
- Information area that have a height of 100.

You can now set the reserved Width/height:
- `reservedWidth` = 5px of left padding + 5px of right padding
- `reservedHeight` = 5px of top padding + 5px of bottom padding + 100 px of information area

For information, your sub-components zone will have a minimum size of 90px width and height for display sub-components.

### 2. Create the template

Now you have to create the template with a `<svg></svg>` containing a class `model` and you have to add `overflow="visible"` to make link anchors visible. 
We also need to define : 
- the sizing with the width and height.
- the position with the x and y.

Then you need to define an element that takes all the visible size of model and having attribute `class="background"`.
It's mandatory, because it helps the system to get the real size of your model.

```jsx
<!-- Template -->
<svg
  class="model"
  overflow="visible"
  width="{{ drawOption.width }}"
  height="{{ drawOption.height }}"
  x="{{ drawOption.x }}"
  y="{{ drawOption.y }}"
>
  <g>
    <rect
      class="background"
      width="100%"
      height="100%"
      rx="6"
    />
  </g>
</svg>
```

Like the demo you can add `style` do indicate to the user that your component is selected:

```jsx
<svg
  (...)
  {% if isSelected %}
  style="outline: 2px solid deepskyblue; outline-offset: 2px;"
  {% endif %}
>
```

### 3. Set up the hide option

`hide` option is a boolean to indicate that component have to be hidden from others.

This option would'nt mean that sub-components of a hiding container have to be hidden, `hide` option is only for the current component not for the children.

In the example we have only one model for container and component, but if you have model for none container component, you can directly set on root svg the hive style option.

Here is our example of hide option:

```jsx
<svg class="model" (...)>
  <g
    {% if drawOption.hide %}
    opacity="0.4"
    cursor="not-allowed"
    {% endif %}
  >
    Everything that has to be hidden
  </g>
  <g>Other think that not to be hide</g>
</svg>
```

### 4. Add the link anchor(s)

:warning: For each component model you have, you must add at least one anchor and each anchor name must be unique.

An anchor define the start and the end of a link, you can decide where you put and how many you have.

System will take the nearest anchor between two components.

To define anchors you must have a group `<g>` that have `class="{{ id }} anchors"`.

To define an anchor you have to define inside the group, an element that have `class="anchor"` and you have to name it with `name=""`.

Here is our example of anchors, one by side: 

```jsx
<g
  class="{{ id }} anchors"
  {% if canHaveLink %}
    cursor="grab"
    fill="#474262"
  {% else %}
    opacity="1"
    fill="transparent"
  {% endif %}
>
  <circle class="anchor" name="top" r="5" cx="50%" cy="1"/>
  <circle class="anchor" name="bottom" r="5" cx="50%" cy="100%"/>
  <circle class="anchor" name="left" r="5" cx="1" cy="50%"/>
  <circle class="anchor" name="right" r="5" cx="100%" cy="50%"/>
</g>
```

In our example we decided to change the display of all anchors if the component can't create a link. For doing that we use `canHaveLink`.

### 5. Add the menu button

On event `open-menu`, Leto-modelizer will open a dialog with many options like delete, resize, add link and open edit drawer.

In extremely rare case, if you do not want that user make action on this component, you can simply not add menu button on it.

To define menu button, you have to add an element that have `class="menu-button"`.

Here is our example of menu button, set in top right of component:

```jsx
<g transform="translate(-20 2)">
  <svg class="menu-button" x="100%" y="0" width="15px" height="15px" fill="white" cursor="pointer">
    <rect rx="2" width="100%" height="100%" fill="#474262"/>
    <g transform="translate(1, 1)">{{ getIcon('menu') | safe }}</g>
  </svg>
</g>
```

### 6. Add the icon of component

The icon is the small picture that appears on the component.

We have a specific available attribute to directly adding the icon of the current component.

The attribute is `icon` and it can be use like that `{{ icon | safe }}`.

It's the simplified form of `{{ getIcon(definition.icon) | safe }}`

Here is an example of display icon:

```jsx
<svg x="6" y="6" width="38" height="38">
  <rect fill="white" width="100%" height="100%" rx="5"/>
  <g class="type-icon" fill="#474262" transform="translate(3 3)">{{ icon | safe }}</g>
</svg>
```

### 7. Add the metadata you want to display

You can display all metadata of your component in the template.

Here is an example to display `name`, `type` and `externalId`: 

```jsx
<g stroke="none" fill="white" font-family="Arial" transform="translate(50 32)">
  <text class="name" font-size="12" y="-1em">{{ name }}</text>
  <text class="type" font-size="12" y="0.5em">{{ definition.type }} - id: {{ externalId }}</text>
</g>
```

### 8. Add the error status

This step is not mandatory, but you can have a special display for component in error.

In our case, we add an icon to indicate that component are in error.

Here is an example of error icon display:

```jsx
{% if hasError %}
<g transform="translate(-38 2)">
  <svg x="100%" y="0" width="15px" height="15px" fill="yellow" stroke="#474262" stroke-width="2px">
    <g transform="translate(1, 1)">{{ getIcon('error') | safe }}</g>
  </svg>
</g>
{% endif %}
```

### 9. Add the container ***(only for container template)***

To create a component container, you have to add a group `<g>` with `class="components"`.

Here is an example of container:

```jsx
<svg class="model">
  <g
    {% if drawOption.hide %}
    opacity="0.4"
    cursor="not-allowed"
    {% endif %}
  >
    Component display
  </g>
  <g class="components"></g>
</svg>
```

As you can see, we put sub-components display outside the hide option, because all components manage is visibility itself.

But you, can add all display of container inside the hide zone.

In our case we have only one model for container and not container, to do that you can use `definition.isContainer`:

Like default component you need to define an element that take all the visible size of sub-components zone, this element need to have an attribute `class="components-background"`.

It's mandatory, because it helps the system to get the real size of your sub-components zone and it will resize it.

```jsx
<svg class="model">
  <g
    {% if drawOption.hide %}
    opacity="0.4"
    cursor="not-allowed"
    {% endif %}
  >
    (...)
    
    {% if definition.isContainer %}
    <rect
      class="components-background"
      style="width: calc(100% - 12px); height: calc(100% - 56px)"
      fill="#9691B1"
      x="6"
      y="50"
      rx="4"
    />
    {% endif %}
  </g>
  {% if definition.isContainer %}
  <g class="components" transform="translate(6 50)"></g>
  {% endif %}
</svg>
```

### 10. Add the resize button ***(only for container template)***

Container can be resize so you need to add, like the menu button a button to resize the component.

To define a resize button you have to add an element with `class="resize-button"`.

Here is an example of resize button, with our model that manage container and not-container:

```jsx
<svg class="model">
  <g
    {% if drawOption.hide %}
    opacity="0.4"
    cursor="not-allowed"
    {% endif %}
  >
    (...)
    
    {% if definition.isContainer %}
    <g transform="translate(-15 -15)">
      <svg
        class="resize-button"
        x="100%"
        y="100%"
        width="15px"
        height="15px"
        fill="white"
        stroke="#474262"
        stroke-width="2px"
        cursor="nw-resize"
      >
        <rect rx="2" width="100%" height="100%" fill="#9691B1"/>
        <g transform="translate(14 1) rotate(90)">{{ getIcon('resize') | safe }}</g>
      </svg>
    </g>
    {% endif %}
  </g>
  {% if definition.isContainer %}
  <g class="components" transform="translate(6 50)"></g>
  {% endif %}
</svg>
```

## Tips and Tricks

### Position the elements

To position elements inside components we can't use the `x` and `y` attributes, because the Firefox browser have specific behavior with them.
So we use the`<g></g>` element and the `transform` attribute with the `translate(x,y)` function, to have a new position reference frame for each element of our component.

### Center an element from component width and height

To center an element, you need to use the `transform` attribute with the `translate(x,y)` function, and the `x` and `y` of the element.

**Important :** don't forget to center the `width` and `height` of the `<svg></svg>` that contains the element, so you don't get a bug with Firefox.

```jsx
<svg class="model" width="200" height="200">
  <!-- Center the rectangle :
  - Set x and/or y to 50% to center from width and/or height
  - Set overflow to visible to be able to see the SVG when it's outside the svg
  -->
  <svg x="50%" y="50%" width="50" height="30">
    <!-- Translate the circle to the center of the SVG:
    "translate(-rectWidth/2, -rectHeight/2)"
    -->
    <g transform="translate(-25,-15)">
      <rect width="100%" height="100%" fill="black"/>
    </g>
  </svg>
</svg>
```

### Personalize the template

You can personalize the template by adding attributes to the `<svg></svg>` element, like the `rx` and `ry` to have
rounded corners, or the `stroke` and `stroke-width` to have a border, etc. I invite you to read the
[SVG documentation](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/svg).
