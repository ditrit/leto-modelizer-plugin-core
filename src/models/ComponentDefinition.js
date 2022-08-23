/**
 * Definition of Component's datas and constraints
 */
class ComponentDefinition {
  /**
   * Default constructor.
   *
   * @param {String} [props.type] - The type of the associated component.
   * @param {String} [props.icon] - The icon's name of this type of component.
   * @param {String} [props.model] - Name of SVG template to render this type of component.
   * @param {String[]} [props.parentTypes=[]] - The list of types that can be the parent.
   * @param {ComponentAttributeDefinition[]} [props.definedAttributes=[]] - Defined attributes for
   * this type.
   * @param {Boolean} [props.isContainer=false] - Boolean means if this type can be a parent.
   * @param {Boolean} [props.displayable=true] - Boolean means if this type can be drawn.
   * @param {Boolean} [props.required=false] - Boolean means if this need to exist in all
   * @param {String} [props.category] - Category name of the component.
   * instantiated components.
   */
  constructor(props = {
    type: null,
    icon: null,
    model: null,
    parentTypes: [],
    definedAttributes: [],
    isContainer: false,
    displayable: true,
    required: false,
    category: null,
  }) {
    const {
      type,
      icon,
      model,
      parentTypes,
      definedAttributes,
      isContainer,
      displayable,
      required,
      category,
    } = props;
    /**
     * The type of the associated component.
     * @type {String}
     */
    this.type = type || null;
    /**
     * The icon's name of this type of component.
     * @type {String}
     */
    this.icon = icon || null;
    /**
     * Name of SVG model to render this type of component.
     * @type {String}
     */
    this.model = model || null;
    /**
     * The list of types that can be the parent.
     * @type {String[]}
     */
    this.parentTypes = parentTypes || [];
    /**
     * Defined attributes for this type.
     * @type {ComponentAttributeDefinition[]}
     */
    this.definedAttributes = definedAttributes || [];
    /**
     * Boolean means if this type can be a parent.
     * @type {Boolean}
     */
    this.isContainer = isContainer === undefined ? false : isContainer;
    /**
     * Boolean means if this type can be a draw.
     * @type {Boolean}
     */
    this.displayable = displayable === undefined ? true : displayable;
    /**
     * Boolean means if this need to exist in all instantiated components.
     * @type {Boolean}
     */
    this.required = required === undefined ? false : required;
    /**
     * Name of the category, use for components definition panel to separate the component
     * definitions in categories.
     * @type {String}
     */
    this.category = category || null;
  }
}

export default ComponentDefinition;
