/**
 * Class that represent the metadata of a specific implementation.
 * @interface
 */
class DefaultMetadata {
  /**
   * Default constructor.
   * @param {Object} metadata - Metadata provide by leto-modelizer.
   */
  constructor(metadata) {
    /**
     * Metadata object.
     * @type {Object}
     */
    this.metadata = metadata;
  }

  /**
   * Validate the provided metadata with a schemas.
   * @return {Boolean} - True if metadata is valid.
   */
  validate() {
    return true;
  }

  /**
   * Get all component definitions from metadata.
   * @return {ComponentDefinition[]} - Array of component definitions.
   */
  getComponentDefinitions() {
    return [];
  }
}

export default DefaultMetadata;
