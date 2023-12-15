import ComponentDrawOption from '../models/ComponentDrawOption';

/**
 * Class used for parsing data to Component.
 */
class DefaultParser {
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
   * Convert the content of files into Components.
   * @param {FileInformation} diagram - Diagram file information.
   * @param {FileInput[]} [inputs] - Data you want to parse.
   * @param {string} [parentEventId] - Parent event id.
   */
  parse(diagram, inputs = [], parentEventId = null) { /* eslint no-unused-vars: 0 */ // --> OFF
    this.pluginData.components = [];
    this.pluginData.parseErrors = [];
  }

  /**
   * Get the list of model paths from all parsable files.
   * @param {FileInformation[]} [files] - List of parsable files.
   * @returns {string[]} List of folder and file paths that represent a model.
   */
  getModels(files = []) {
    return files.map(({ path }) => path);
  }

  /**
   * Set configuration into Components.
   * @param {FileInformation} diagram - Diagram file information.
   * @param {string} diagram.path - Absolute path of the diagram.
   * @param {FileInput} file - Configuration file of components.
   * @param {string} [parentEventId] - Parent event id.
   */
  parseConfiguration(diagram, file, parentEventId = null) {
    const diagramPath = diagram.path?.split('/').slice(1).join('/');
    const logId = this.pluginData.emitEvent({
      parent: parentEventId,
      type: 'Parser',
      action: 'read',
      status: 'running',
      files: [file.path],
      data: {
        global: false,
      },
    });

    if (file.content == null) {
      this.pluginData.emitEvent({
        id: logId,
        status: 'warning',
        data: {
          code: 'no_content',
          global: false,
        },
      });

      return;
    }

    const config = JSON.parse(file.content);

    if (!config[diagramPath]) {
      this.pluginData.emitEvent({
        id: logId,
        status: 'warning',
        data: {
          code: 'no_diagram_content',
          global: false,
        },
      });

      return;
    }

    if (!config[diagramPath][this.pluginData.name]) {
      this.pluginData.emitEvent({
        id: logId,
        status: 'warning',
        data: {
          code: 'no_plugin_content',
          global: false,
        },
      });

      return;
    }

    Object.keys(config[diagramPath][this.pluginData.name]).forEach((id) => {
      const component = this.pluginData.getComponentById(id);

      if (!component || !config[diagramPath][this.pluginData.name][id]) {
        return;
      }

      component.drawOption = new ComponentDrawOption(
        config[diagramPath][this.pluginData.name][id],
      );
    });

    this.pluginData.emitEvent({ id: logId, status: 'success' });
  }

  /**
   * Indicate if this parser can parse this file.
   * @param {FileInformation} fileInformation - File information.
   * @returns {boolean} - Boolean that indicates if this file can be parsed or not.
   */
  isParsable(fileInformation) {
    return fileInformation !== undefined && fileInformation !== null;
  }
}

export default DefaultParser;
