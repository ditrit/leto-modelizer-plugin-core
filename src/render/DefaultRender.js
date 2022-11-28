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
   * Transform all provided components in file inputs.
   * @return {FileInput[]} - Generated files from components.
   */
  render() {
    return [];
  }

  /**
   * Update configuration file content according to components data.
   * @param {FileInput} file - Configuration file of components.
   */
  renderConfiguration(file) {
    const configuration = {};

    this.pluginData.components
      .filter((component) => component.drawOption)
      .forEach((component) => {
        configuration[component.id] = component.drawOption;
      });

    const config = JSON.parse(file.content) || {};

    config[this.pluginData.name] = configuration;

    file.content = JSON.stringify(config, (key, value) => (value === null ? undefined : value));
  }
}

export default DefaultRender;
