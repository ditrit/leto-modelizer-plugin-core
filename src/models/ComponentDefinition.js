/**
 * Definition of Component's datas and constraints
 */
class ComponentDefinition {
  /**
   * Default constructor.
   *
   * @param {String} [type] - The type of the associated component.
   * @param {String} [icon] - The icon's name of this type of component.
   * @param {String} [svgTemplate] - Name of SVG template to render this type of component.
   * @param {String[]} [parentTypes=[]] - The list of types that can be the parent.
   * @param {ComponentAttributeDefinition[]} [definedAttributes=[]] - Defined attributes for this
   * type.
   * @param {Boolean} [isContainer=true] - Boolean means if this type can be a parent.
   */
  constructor(
    type = null,
    icon = null,
    svgTemplate = null,
    parentTypes = [],
    definedAttributes = [],
    isContainer = true,
  ) {
    /**
     * The type of the associated component.
     * @type {String}
     */
    this.type = type;
    /**
     * The icon's name of this type of component.
     * @type {String}
     */
    this.icon = icon;
    /**
     * Name of SVG template to render this type of component.
     * @type {String[]}
     */
    this.parentTypes = parentTypes;
    /**
     * The list of types that can be the parent.
     * @type {String}
     */
    this.svgTemplate = svgTemplate;
    /**
     * Defined attributes for this type.
     * @type {ComponentAttributeDefinition[]}
     */
    this.definedAttributes = definedAttributes;
    /**
     * Boolean means if this type can be a parent.
     * @type {Boolean}
     */
    this.isContainer = isContainer;
  }
}

export default ComponentDefinition;
