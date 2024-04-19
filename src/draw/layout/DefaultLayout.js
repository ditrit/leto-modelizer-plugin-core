/**
 * Class that represents algorithms to automatically arrange components by
 * computing optimal positions.
 *
 * The goal of implemented algorithms is to maximize human readability.
 */
class DefaultLayout {
  /**
   * Default constructor.
   * @param {DefaultData} pluginData - Plugin data storage.
   */
  constructor(pluginData, viewport) {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.pluginData = pluginData ?? null;

    /**
     * D3 selection of the view port.
     * @type {Selection}
     */
    this.viewport = viewport;
  }

  generateComponentsLayout(id, keepPosition) {}

  resize(id) {}
}

export default DefaultLayout;
