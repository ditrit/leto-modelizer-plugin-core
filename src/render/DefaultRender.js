/**
 * Class that compile a Component to data.
 * @interface
 */
class DefaultRender {
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
   * Transform all provided components and links in file inputs.
   * @return {FileInput[]} - Generated files from components and links.
   */
  render() {
    return [];
  }
}

export default DefaultRender;
