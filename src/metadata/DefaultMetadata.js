/**
 * Class that represent the metadata of a specific implementation.
 * @interface
 */
class DefaultMetadata {
  /**
   * Default constructor.
   * @param {Array} resources - Resources object that contains all Metadata object.
   */
  constructor(resources) {
    /**
     * Resources object that contains all Metadata object.
     * @type {Array}
     */
    this.resources = resources;
  }

  /**
   * Validate the provided metadata with a schemas.
   * @return {Boolean} - True if metadata is valid.
   */
  validate() {
    return true;
  }

  /**
   * Get all component/link definitions from metadata.
   * @return {Object} - Object that contains component/link definitions.
   */
  getDefinitions() {
    return {
      components: [],
      links: [],
    };
  }
}

export default DefaultMetadata;
