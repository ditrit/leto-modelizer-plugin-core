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
   * @param {String[]} [props.childrenTypes=[]] - The list of types that can be children.
   * @param {ComponentAttributeDefinition[]} [props.definedAttributes=[]] - Defined attributes for
   * this type.
   * @param {Boolean} [props.isContainer=false] - Boolean means if this type can be a parent.
   * instantiated components.
   */
  constructor(props = {
    type: null,
    icon: null,
    model: null,
    parentTypes: [],
    definedAttributes: [],
    isContainer: false,
  }) {
    const {
      type,
      icon,
      model,
      parentTypes,
      childrenTypes,
      definedAttributes,
      isContainer,
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
     * The list of types that can be a child.
     * @type {String[]}
     */
    this.childrenTypes = childrenTypes || [];
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
  }
}

export default ComponentDefinition;
