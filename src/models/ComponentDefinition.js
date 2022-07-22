/**
 * Definition of Component's datas and constraints
 */
class ComponentDefinition {
  /**
   * Default constructor.
   *
   * @param {String} type The type of the associated component.
   * @param {String} resourceType type of resource.
   * @param {String} icon The icon's path of this type of component.
   * @param {String} svgTemplate Path of SVG template to render this type of component.
   * @param {String[]} parentTypes The list of types that can be the parent.
   * @param {ComponentAttributeDefinition[]} definedAttributes Defined attributes for this type.
   * @param {Boolean} isContainer Boolean meens if this type can be a parent, is 'true' by default.
   */
  constructor(
    type = null,
    resourceType = null,
    icon = null,
    svgTemplate = null,
    parentTypes = [],
    definedAttributes = [],
    isContainer = true,
  ) {
    /**
     * @type {String}
     */
    this.type = type;
    /**
     * @type {String}
     */
    this.resourceType = resourceType;
    /**
     * @type {String}
     */
    this.icon = icon;
    /**
     * @type {String[]}
     */
    this.parentTypes = parentTypes;
    /**
     * @type {String}
     */
    this.svgTemplate = svgTemplate;
    /**
     * @type {ComponentAttributeDefinition[]}
     */
    this.definedAttributes = definedAttributes;
    /**
     * @type {Boolean}
     */
    this.isContainer = isContainer;
  }
}
export default ComponentDefinition;
