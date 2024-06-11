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
   * @param {object} viewport - D3 selection of the view port.
   */
  constructor(pluginData, viewport) {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.pluginData = pluginData || null;

    /**
     * D3 selection of the view port.
     * @type {object}
     */
    this.viewport = viewport || null;
  }

  /**
   * Generate layout of a container.
   * Will update all component drawOption with new position and size.
   * @param {string} id - Container id, null for root container.
   * @param {boolean} keepPosition - If true, rearrange only components without a specified
   * position; otherwise, rearrange all components.
   * @returns {boolean} Return true on successful generation.
   */
  // eslint-disable-next-line no-unused-vars
  generateComponentsLayout(id, keepPosition) {
    return true;
  }

  /**
   * Resize component to its minimum size.
   * @param {string} id - Id of component to resize.
   * @returns {boolean} Return true on successful resizing.
   */
  // eslint-disable-next-line no-unused-vars
  resize(id) {
    return true;
  }
}

export default DefaultLayout;
