/**
 * Define Attributes for type.
 */
class ComponentAttributeDefinition {
  /**
   * Default contructor
   *
   * @param {String} [props.name] - Attribute name.
   * @param {String} [props.type] - Attribute type,
   * valid types are String/Boolean/Number/Array/Object/Link.
   * @param {String[]} [props.linkTypes=[]] - Define list of Component that can be linked with this.
   * @param {Boolean} [props.required=false] - Attribute is required.
   * @param {Object} [props.rules={}] - Rules of this type of Attribute.
   * @param {Array} [props.rules.values] - Default values of attribute.
   * @param {Number} [props.rules.min] - Minimum value of Attribute.
   * @param {Number} [props.rules.max] - Maximum value of Attribute.
   * @param {String} [props.rules.regex] - Regular expression to constrain the format of the value.
   */
  constructor(props = {
    name: null,
    type: null,
    linkTypes: [],
    required: false,
    rules: {
      values: null,
      min: null,
      max: null,
      regex: null,
    },
  }) {
    const {
      name,
      type,
      linkTypes,
      required,
      rules,
    } = props;
    /**
     * Attribute name.
     * @type {String}
     */
    this.name = name || null;
    /**
     * Attribute type, valid types are String/Boolean/Number/Array/Object/Link.
     * @type {String}
     */
    this.type = type || null;
    /**
     * Define list of Component that can be linked with this.
     * @type {String[]}
     */
    this.linkTypes = linkTypes || [];
    /**
     * Attribute is required.
     * @type {Boolean}
     */
    this.required = required || false;
    /**
     * Rules of this type of Attribute.
     * @type {Object}
     */
    this.rules = {
      values: null,
      min: null,
      max: null,
      regex: null,
      ...rules,
    };
  }
}

export default ComponentAttributeDefinition;
