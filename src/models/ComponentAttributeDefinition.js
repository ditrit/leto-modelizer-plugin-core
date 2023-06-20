/**
 * Define Attributes for type.
 */
class ComponentAttributeDefinition {
  /**
   * Default constructor
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.name] - Attribute name.
   * @param {string} [props.type] - Attribute type,
   * valid types are String/Boolean/Number/Array/Object/Link/Reference.
   * @param {string} [props.displayName] - Attribute display name.
   * @param {string} [props.description] - Attribute explanation.
   * @param {string} [props.url] - URL of the documentation of the attribute.
   * @param {string} [props.linkType] - Type of link, valid types are Default/Reverse.
   * @param {string[]} [props.linkRef] - Reference of accepted component for link.
   * @param {string} [props.linkColor] - Color of the link.
   * @param {number} [props.linkWidth] - Width of the link.
   * @param {number[]} [props.linkDashStyle] - Dash style of the link. See stroke-dasharray of svg.
   * @param {string} [props.containerRef] - Reference of accepted component for container.
   * @param {boolean} [props.required] - Attribute is required.
   * @param {ComponentAttributeDefinition[]} [props.definedAttributes] - Defined attributes for
   * this type.
   * @param {object} [props.rules] - Rules of this type of Attribute.
   * @param {Array} [props.rules.values] - Default values of attribute.
   * @param {number} [props.rules.min] - Minimum value of Attribute.
   * @param {number} [props.rules.max] - Maximum value of Attribute.
   * @param {string} [props.rules.regex] - Regular expression to constrain the format of the value.
   */
  constructor(props = {
    name: null,
    type: null,
    displayName: null,
    description: null,
    url: null,
    linkType: null,
    linkRef: [],
    linkColor: 'black',
    linkWidth: 2,
    linkDashStyle: null,
    containerRef: null,
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
      displayName,
      description,
      url,
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
     * @type {string}
     */
    this.name = name || null;
    /**
     * Attribute type, valid types are String/Boolean/Number/Array/Object/Link/Reference.
     * @type {string}
     */
    this.type = type || null;
    /**
     * Attribute display name.
     * @type {string}
     */
    this.displayName = displayName || null;
    /**
     * Attribute explanation.
     * @type {string}
     */
    this.description = description || null;
    /**
     * URL of the documentation of the attribute.
     * @type {string}
     */
    this.url = url || null;
    /**
     * Type of link, valid types are Default/Reverse.
     * @type {string}
     */
    this.linkType = linkType || null;
    /**
     * Define list of Component that can be linked with this.
     * @type {string[]}
     * @default []
     */
    this.linkRef = linkRef || [];
    /**
     * Color of the link.
     * @type {string}
     * @default 'black'
     */
    this.linkColor = linkColor || 'black';
    /**
     * Width of the link.
     * @type {number}
     * @default 2
     */
    this.linkWidth = linkWidth || 2;
    /**
     * Dash style of the link. See stroke-dasharray of svg.
     * @type {number[]}
     */
    this.linkDashStyle = linkDashStyle || null;
    /**
     * Define the reference of Component that can be the container of this component.
     * @type {string}
     */
    this.containerRef = containerRef || null;
    /**
     * Defined attributes for this type.
     * @type {ComponentAttributeDefinition[]}
     */
    this.definedAttributes = definedAttributes || [];
    /**
     * Attribute is required.
     * @type {boolean}
     * @default false
     */
    this.required = required || false;
    /**
     * Rules of this type of Attribute.
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
