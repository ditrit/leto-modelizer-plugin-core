/**
 * Define Attributes for type.
 */
class ComponentAttributeDefinition {
  /**
   * Default constructor
   *
   * @param {String} [props.name] - Attribute name.
   * @param {String} [props.type] - Attribute type,
   * valid types are String/Boolean/Number/Array/Object/Link/Reference.
   * @param {String} [props.linkType] - Type of link, valid types are Default/Reverse.
   * @param {String[]} [props.linkRef=[]] - Reference of accepted component for link.
   * @param {String} [props.linkColor='black'] - Color of the link.
   * @param {Number} [props.linkWidth=2] - Width of the link.
   * @param {Number[]} [props.linkDashStyle] - Dash style of the link. See stroke-dasharray of svg.
   * @param {String[]} [props.containerRef=[]] - Reference of accepted component for container.
   * @param {Boolean} [props.required=false] - Attribute is required.
   * @param {ComponentAttributeDefinition[]} [props.definedAttributes=[]] - Defined attributes for
   * this type.
   * @param {Object} [props.rules={}] - Rules of this type of Attribute.
   * @param {Array} [props.rules.values] - Default values of attribute.
   * @param {Number} [props.rules.min] - Minimum value of Attribute.
   * @param {Number} [props.rules.max] - Maximum value of Attribute.
   * @param {String} [props.rules.regex] - Regular expression to constrain the format of the value.
   */
  constructor(props = {
    name: null,
    type: null,
    linkType: null,
    linkRef: [],
    linkColor: 'black',
    linkWidth: 2,
    linkDashStyle: null,
    containerRef: [],
    required: false,
    definedAttributes: [],
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
      linkType,
      linkRef,
      linkColor,
      linkWidth,
      linkDashStyle,
      containerRef,
      definedAttributes,
      required,
      rules,
    } = props;

    /**
     * Attribute name.
     * @type {String}
     */
    this.name = name || null;
    /**
     * Attribute type, valid types are String/Boolean/Number/Array/Object/Link/Reference.
     * @type {String}
     */
    this.type = type || null;
    /**
     * Type of link, valid types are Default/Reverse.
     * @type {String}
     */
    this.linkType = linkType || null;
    /**
     * Define list of Component that can be linked with this.
     * @type {String[]}
     */
    this.linkRef = linkRef || [];
    /**
     * Color of the link.
     * @type {String}
     */
    this.linkColor = linkColor || 'black';
    /**
     * Width of the link.
     * @type {Number}
     */
    this.linkWidth = linkWidth || 2;
    /**
     * Dash style of the link. See stroke-dasharray of svg.
     * @type {Number[]}
     */
    this.linkDashStyle = linkDashStyle || null;
    /**
     * Define list of Component that can be the container of this component.
     * @type {String[]}
     */
    this.containerRef = containerRef || [];
    /**
     * Defined attributes for this type.
     * @type {ComponentAttributeDefinition[]}
     */
    this.definedAttributes = definedAttributes || [];
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
