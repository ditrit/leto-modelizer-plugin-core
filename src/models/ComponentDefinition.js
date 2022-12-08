/**
 * Definition of Component's datas and constraints
 */
class ComponentDefinition {
  /**
   * Default constructor.
   *
   * @param {object} [props={}] - Object that contains all properties to set.
   * @param {string} [props.type] - The type of the associated component.
   * @param {string} [props.icon] - The icon's name of this type of component.
   * @param {string} [props.model] - Name of SVG template to render this type of component.
   * @param {string[]} [props.parentTypes=[]] - The list of types that can be the parent.
   * @param {string[]} [props.childrenTypes=[]] - The list of types that can be the children.
   * @param {ComponentAttributeDefinition[]} [props.definedAttributes=[]] - Defined attributes for
   * this type.
   * @param {boolean} [props.isContainer=false] - Boolean means if this type can be a parent.
   * instantiated components.
   */
  constructor(props = {
    type: null,
    icon: null,
    model: null,
    parentTypes: [],
    childrenTypes: [],
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
     *
     * @type {string}
     */
    this.type = type || null;
    /**
     * The icon's name of this type of component.
     *
     * @type {string}
     */
    this.icon = icon || null;
    /**
     * Name of SVG model to render this type of component.
     *
     * @type {string}
     */
    this.model = model || null;
    /**
     * The list of types that can be the parent.
     *
     * @type {string[]}
     */
    this.parentTypes = parentTypes || [];
    /**
     * The list of types that can be the children.
     *
     * @type {string[]}
     */
    this.childrenTypes = childrenTypes || [];
    /**
     * Defined attributes for this type.
     *
     * @type {ComponentAttributeDefinition[]}
     */
    this.definedAttributes = definedAttributes || [];
    /**
     * Boolean means if this type can be a parent.
     *
     * @type {boolean}
     */
    this.isContainer = isContainer === undefined ? false : isContainer;
  }
}

export default ComponentDefinition;
