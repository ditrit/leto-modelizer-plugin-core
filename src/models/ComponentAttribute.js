/**
 * Class to add Attribute in Components
 */
class ComponentAttribute {
  /**
   * Default constructor.
   *
   * @param {String} [name] - The name of the attribute.
   * @param {(String|Boolean|Number|Array|ComponentAttribute[])} [value] - The value of the
   * attribute.
   */
  constructor(
    name = null,
    value = null,
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
  }
}

export default ComponentAttribute;
