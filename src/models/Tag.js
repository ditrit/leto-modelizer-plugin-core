/**
 * Represent a tag in Leto-modelizer.
 */
class Tag {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.type] - The type of this tag.
   * @param {string} [props.value] - The value of this tag.
   */
  constructor(props = {
    type: null,
    value: null,
  }) {
    const {
      type,
      value,
    } = props;

    /**
     * The type of this tag.
     * @type {string}
     * @default null
     */
    this.type = type || null;
    /**
     * The value of this tag.
     * @type {string}
     * @default null
     */
    this.value = value || null;
  }
}

export default Tag;
