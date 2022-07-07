class LetoLink {
  /**
   * Default constructor.
   *
   * @param {String} name The name of the link attribute.
   * @param {String} targetId The id of the target object.
   * @param {String} sourceId The id of the source object.
   * @param {String} id The id of this link.
   * @param {String} sourceType The type of the source of the link.
   * @param {String} targetType The type of the target of the link.
   * @param {String} representation The graphic representation of the attribute.
   * @param {Boolean} required To know if this attribute is required or not.
   * @param {Boolean} multiple To know if this attribute is unique or not.
   */
  constructor(
    name = null,
    targetId = null,
    sourceId = null,
    id = null,
    sourceType = null,
    targetType = null,
    representation = null,
    required = null,
    multiple = null,
  ) {
    /**
     * @type {String}
     */
    this.name = name;
    /**
     * @type {String}
     */
    this.targetId = targetId;
    /**
     * @type {String}
     */
    this.sourceId = sourceId;
    /**
     * @type {String}
     */
    this.id = id;
    /**
     * @type {String}
     */
    this.sourceType = sourceType;
    /**
     * @type {String}
     */
    this.targetType = targetType;
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

export default LetoLink;
