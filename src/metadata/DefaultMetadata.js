/**
 * Class that represent the metadata of a specific implementation.
 * @interface
 */
class DefaultMetadata {
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
