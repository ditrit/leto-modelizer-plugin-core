class LetoAttribute {
  /**
   * Default constructor.
   *
   * @param {String} name The name of the attribute.
   * @param {LetoObjectNode} value The value of the attribute.
   * @param {String} resourceType The type of LetoObject that the value can take.
   * @param {String} representation The graphic representation of the attribute.
   * @param {Boolean} required To know if this attribute is required or not.
   * @param {Boolean} multiple To know if this attribute is unique or not.
   */
  constructor(
    name = null,
    value = null,
    resourceType = null,
    representation = null,
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
     * @type {String}
     */
    this.resourceType = resourceType;
    /**
     * @type {String}
     */
    this.representation = representation;
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

export default LetoAttribute;
