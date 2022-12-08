/**
 * Class that compile a Component to data.
 */
import FileInput from '../models/FileInput';

class DefaultRender {
  /**
   * Default constructor.
   *
   * @param {DefaultData} pluginData - Plugin data storage.
   */
  constructor(pluginData) {
    /**
     * Plugin data storage.
     *
     * @type {DefaultData}
     */
    this.pluginData = pluginData || null;
  }

  /**
   * Transform all provided components in file inputs.
   *
   * @param {FileInput[]} files - Files managed by the plugin.
   * @returns {FileInput[]} - Generated files from components.
   */
  render(files = []) {
    const rendererFiles = files.reduce((acc, file) => {
      acc[file.path] = '';

      return acc;
    }, {});

    this.renderFiles().forEach((file) => {
      rendererFiles[file.path] = file.content;
    });

    return Object.keys(rendererFiles)
      .map((path) => new FileInput({ path, content: rendererFiles[path] }));
  }

  /**
   * Transform all provided components in file inputs.
   *
   * @returns {FileInput[]} - Generated files from components.
   */
  renderFiles() {
    return [];
  }

  /**
   * Update configuration file content according to components data.
   *
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
