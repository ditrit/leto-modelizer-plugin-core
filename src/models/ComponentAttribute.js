/**
 * Class to add Attribute in Components
 */
class ComponentAttribute {
  /**
   * Default constructor.
   *
   * @param {object} [props={}] - Object that contains all properties to set.
   * @param {string} [props.name=null] - The name of the attribute.
   * @param {(string | boolean | number | Array | ComponentAttribute[])} [props.value=null] - The
   * value of the attribute.
   * @param {string} [props.type=null] - The reel type of the attribute.
   * @param {ComponentAttributeDefinition} [props.definition=null] - The definition of the
   * attribute.
   */
  constructor(props = {
    name: null,
    value: null,
    type: null,
    definition: null,
  }) {
    const {
      name,
      value,
      type,
      definition,
    } = props;

    /**
     * The name of the attribute.
     *
     * @type {string}
     */
    this.name = name || null;
    /**
     * The value of the attribute.
     *
     * @type {(string | boolean | number | Array | ComponentAttribute[])}
     */
    this.value = value || null;
    /**
     * The type of the attribute, reel type of the attribute, to check if it's match with the
     * ComponentAttributeDefinition.
     *
     * @type {string}
     */
    this.type = type || null;
    /**
     * The definition of the attribute.
     *
     * @type {ComponentAttributeDefinition}
     */
    this.definition = definition || null;
  }
}

export default ComponentAttribute;
