/**
 * Define Attributes for type.
 */
class ComponentAttributeDefinition {
  /**
   * Default contructor
   *
   * @param {String} [name] - Attribute name.
   * @param {String} [type] - Attribute type,
   * valid types are String/Boolean/Number/Array/Object/Link.
   * @param {String[]} [linkTypes=[]] - Define list of Component that can be linked with this.
   * @param {Boolean} [required=false] - Attribute is required.
   * @param {Object} [rules={}] - Rules of this type of Attribute.
   * @param {Array} [rules.values] - Default values of attribute.
   * @param {Number} [rules.min] - Minimum value of Attribute.
   * @param {Number} [rules.max] - Maximum value of Attribute.
   * @param {String} [rules.regex] - Regular expression to constrain the format of the value.
   */
  constructor(
    name = null,
    type = null,
    linkTypes = [],
    required = false,
    rules = {
      values: null,
      min: null,
      max: null,
      regex: null,
    },
  ) {
    /**
     * Attribute name.
     * @type {String}
     */
    this.name = name;
    /**
     * Attribute type, valid types are String/Boolean/Number/Array/Object/Link.
     * @type {String}
     */
    this.type = type;
    /**
     * Define list of Component that can be linked with this.
     * @type {String[]}
     */
    this.linkTypes = linkTypes;
    /**
     * Attribute is required.
     * @type {Boolean}
     */
    this.required = required;
    /**
     * Rules of this type of Attribute.
     * @type {Object}
     */
    this.rules = rules;
  }
}

export default ComponentAttributeDefinition;
