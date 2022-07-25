/**
 * Define Attributes for type.
 */
class ComponentAttributeDefinition {
  /**
     * Default contructor
     *
     * @param {String} name Attribute name.
     * @param {String} type Attribute type, valid types are String/Boolean/Number/Array/Object/Link.
     * @param {String[]} linkTypes Define list of Component that can be linked with this.
     * @param {Boolean} required Attribute is required.
     * @param {Object} rules Rules of this type of Attribute.
     * @param {Array} rules.values Default values of attribute.
     * @param {Number} rules.min Minimum value of Attribute.
     * @param {Number} rules.max Maximum value of Attribute.
     * @param {String} rules.regex Regular expression to constrain the format of the value.
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
         * @type {String}
         */
    this.name = name;
    /**
         * @type {String}
         */
    this.type = type;
    /**
         * @type {String[]}
         */
    this.linkTypes = linkTypes;
    /**
         * @type {Boolean}
         */
    this.required = required;
    /**
          * @type {Object}
          */
    this.rules = rules;
  }
}

export default ComponentAttributeDefinition;
