/**
 * Class that represent the metadata of a specific implementation.
 */
class DefaultMetadata {
  /**
   * Default constructor.
   * @param {DefaultData} pluginData - Plugin data storage.
   */
  constructor(pluginData) {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.pluginData = pluginData || null;
  }

  /**
   * Validate the provided metadata with a schemas.
   * @returns {boolean} - True if metadata is valid.
   */
  validate() {
    return true;
  }

  /**
   * Parse all component/link definitions from metadata.
   * @param {string} [parentEventId] - Parent event id.
   */
  // eslint-disable-next-line no-unused-vars
  parse(parentEventId) {
    this.pluginData.definitions = {
      components: [],
      links: [],
    };
  }
}

export default DefaultMetadata;
