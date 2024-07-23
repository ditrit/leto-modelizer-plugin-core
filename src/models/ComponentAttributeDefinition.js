/**
 * Definition of Component Attributes' data and constraints.
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
   * @param {string[]} [props.tags] - Attribute tags.
   * @param {string} [props.url] - URL of the documentation of the attribute.
   * @param {string} [props.linkType] - Type of link, valid types are Default/Reverse.
   * @param {string[]} [props.linkRef] - Reference of accepted component for link.
   * @param {string[]} [props.linkModel] - Name of SVG model to render the link of component.
   * @param {string} [props.containerRef] - Reference of accepted component for container.
   * @param {boolean} [props.required] - Attribute is required.
   * @param {ComponentAttributeDefinition[]} [props.definedAttributes] - Defined attributes for
   * this type.
   * @param {object} [props.rules] - Rules of this type of Attribute.
   * @param {Array} [props.rules.values] - Default values of attribute.
   * @param {number} [props.rules.min] - Minimum value of Attribute.
   * @param {number} [props.rules.max] - Maximum value of Attribute.
   * @param {string} [props.rules.regex] - Regular expression to constrain the format of the value.
   * @param {string} [props.rules.regexMessage] - Message so use in case of regex error.
   */
  constructor(props = {
    name: null,
    type: null,
    displayName: null,
    description: null,
    tags: [],
    url: null,
    linkType: null,
    linkRef: [],
    linkModel: null,
    containerRef: null,
    required: false,
    definedAttributes: [],
    rules: {
      values: null,
      min: null,
      max: null,
      regex: null,
      regexMessage: null,
    },
  }) {
    const {
      name,
      type,
      displayName,
      description,
      tags,
      url,
      linkType,
      linkRef,
      linkModel,
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
     * Attribute tags.
     * @type {string[]}
     */
    this.tags = tags || [];
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
     * Name of SVG model to render the link of component.
     * @type {string}
     */
    this.linkModel = linkModel || null;
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
      values: [],
      min: null,
      max: null,
      regex: null,
      regexMessage: null,
      ...rules,
    };
  }
}

export default ComponentAttributeDefinition;
