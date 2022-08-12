/**
 * Class to add Attribute in Components
 */
class ComponentAttribute {
  /**
   * Default constructor.
   *
   * @param {String} [name=null] - The name of the attribute.
   * @param {(String|Boolean|Number|Array|ComponentAttribute[])} [value=null] - The value of the
   * @param {String} [type=null] - The type of the attribute.
   * attribute.
   */
  constructor(
    name = null,
    value = null,
    type = null,
  ) {
    /**
     * The name of the attribute.
     * @type {String}
     */
    this.name = name;
    /**
     * The value of the attribute.
     * @type {(String|Boolean|Number|Array|ComponentAttribute[])}
     */
    this.value = value;
    /**
     * The type of the attribute, reel type of the attribute, to check if it's match with the
     * ComponentAttributeDefinition.
     * @type {String}
     */
    this.type = type;
  }
}

export default ComponentAttribute;
