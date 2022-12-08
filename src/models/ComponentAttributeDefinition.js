/**
 * Define Attributes for type.
 */
class ComponentAttributeDefinition {
  /**
   * Default constructor
   *
   * @param {object} [props={}] - Object that contains all properties to set.
   * @param {string} [props.name] - Attribute name.
   * @param {string} [props.type] - Attribute type,
   * valid types are String/Boolean/Number/Array/Object/Link/Reference.
   * @param {string} [props.linkType] - Type of link, valid types are Default/Reverse.
   * @param {string[]} [props.linkRef=[]] - Reference of accepted component for link.
   * @param {string} [props.linkColor='black'] - Color of the link.
   * @param {number} [props.linkWidth=2] - Width of the link.
   * @param {number[]} [props.linkDashStyle] - Dash style of the link. See stroke-dasharray of svg.
   * @param {string[]} [props.containerRef=[]] - Reference of accepted component for container.
   * @param {boolean} [props.required=false] - Attribute is required.
   * @param {ComponentAttributeDefinition[]} [props.definedAttributes=[]] - Defined attributes for
   * this type.
   * @param {object} [props.rules={}] - Rules of this type of Attribute.
   * @param {Array} [props.rules.values] - Default values of attribute.
   * @param {number} [props.rules.min] - Minimum value of Attribute.
   * @param {number} [props.rules.max] - Maximum value of Attribute.
   * @param {string} [props.rules.regex] - Regular expression to constrain the format of the value.
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
     *
     * @type {string}
     */
    this.name = name || null;
    /**
     * Attribute type, valid types are String/Boolean/Number/Array/Object/Link/Reference.
     *
     * @type {string}
     */
    this.type = type || null;
    /**
     * Type of link, valid types are Default/Reverse.
     *
     * @type {string}
     */
    this.linkType = linkType || null;
    /**
     * Define list of Component that can be linked with this.
     *
     * @type {string[]}
     */
    this.linkRef = linkRef || [];
    /**
     * Color of the link.
     *
     * @type {string}
     */
    this.linkColor = linkColor || 'black';
    /**
     * Width of the link.
     *
     * @type {number}
     */
    this.linkWidth = linkWidth || 2;
    /**
     * Dash style of the link. See stroke-dasharray of svg.
     *
     * @type {number[]}
     */
    this.linkDashStyle = linkDashStyle || null;
    /**
     * Define list of Component that can be the container of this component.
     *
     * @type {string[]}
     */
    this.containerRef = containerRef || [];
    /**
     * Defined attributes for this type.
     *
     * @type {ComponentAttributeDefinition[]}
     */
    this.definedAttributes = definedAttributes || [];
    /**
     * Attribute is required.
     *
     * @type {boolean}
     */
    this.required = required || false;
    /**
     * Rules of this type of Attribute.
     *
     * @type {object}
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
