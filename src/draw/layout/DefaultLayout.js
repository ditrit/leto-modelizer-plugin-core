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
   * @returns {Promise<void>} Promise with nothing on success otherwise an error.
   */
  async arrangeComponentsPosition() {
    return Promise.resolve();
  }
}

export default DefaultLayout;
