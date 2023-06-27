import FileInput from '../models/FileInput';

/**
 * Class that compile a Component to data.
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
   * @param {FileInput[]} [files] - Files managed by the plugin.
   * @param {string} [parentEventId] - Parent event id.
   * @returns {FileInput[]} - Generated files from components.
   */
  render(files = [], parentEventId = null) {
    const rendererFiles = files.reduce((acc, file) => {
      acc[file.path] = '';

      return acc;
    }, {});

    this.renderFiles(parentEventId).forEach((file) => {
      rendererFiles[file.path] = file.content;
    });

    return Object.keys(rendererFiles)
      .map((path) => new FileInput({ path, content: rendererFiles[path] }));
  }

  /**
   * Transform all provided components in file inputs.
   * @param {string} [parentEventId] - Parent event id.
   * @returns {FileInput[]} - Generated files from components.
   */
  // eslint-disable-next-line no-unused-vars
  renderFiles(parentEventId = null) {
    return [];
  }

  /**
   * Update configuration file content according to components data.
   * @param {FileInformation} diagram - Diagram file information.
   * @param {FileInput} file - Configuration file of components.
   * @param {string} [parentEventId] - Parent event id.
   */
  renderConfiguration(diagram, file, parentEventId = null) {
    const id = this.pluginData.emitEvent({
      parent: parentEventId,
      type: 'Render',
      action: 'write',
      status: 'running',
      files: [file.path],
      data: {
        global: false,
      },
    });
    const configuration = JSON.parse(file.content) || {};

    if (!configuration[diagram.path]) {
      configuration[diagram.path] = {};
    }

    configuration[diagram.path][this.pluginData.name] = {};

    this.pluginData.components
      .filter((component) => component.drawOption)
      .forEach((component) => {
        configuration[diagram.path][this.pluginData.name][component.id] = component.drawOption;
      });

    file.content = JSON.stringify(
      configuration,
      (key, value) => (value === null ? undefined : value),
      2,
    );

    this.pluginData.emitEvent({ id, status: 'success' });
  }
}

export default DefaultRender;
