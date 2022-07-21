class ComponentAttribute {
  /**
   * Default constructor.
   *
   * @param {String} name The name of the attribute.
   * @param {(String|Boolean|Number|Array|ComponentAttribute[])} value The value of the attribute.
   * @param {Boolean} required To know if this attribute is required or not.
   * @param {Boolean} multiple To know if this attribute is unique or not.
   */
  constructor(
    name = null,
    value = null,
    required = null,
    multiple = null,
  ) {
    /**
     * @type {String}
     */
    this.name = name;
    /**
     * @type {LetoObjectNode}
     */
    this.value = value;
    /**
     * @type {Boolean}
     */
    this.required = required;
    /**
     * @type {Boolean}
     */
    this.multiple = multiple;
  }
}

export default ComponentAttribute;
