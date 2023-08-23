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
  constructor(pluginData) {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.pluginData = pluginData ?? null;
  }

  /**
   * Does nothing to components.
   * One can override this method to implement an algorithm for automatic components layout.
   * @param {string} [containerId] - The container within which we need to organize the children,
   * and if not specified, all components will be reorganized.
   * @returns {Promise<void>} Promise with nothing on success otherwise an error.
   */
  // eslint-disable-next-line no-unused-vars
  async arrangeComponentsPosition(containerId) {
    return Promise.resolve();
  }

  /**
   * Reposition a component where there is room for it.
   * @param {string} componentId - Id of a component to be repositioned.
   */
  // eslint-disable-next-line no-unused-vars
  repositionComponent(componentId) {
  }
}

export default DefaultLayout;
