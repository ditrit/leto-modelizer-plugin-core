import ComponentDrawOption from '../models/ComponentDrawOption';

/**
 * Class that used for parsing.
 */
class DefaultParser {
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
   * Convert the content of files into Components.
   *
   * @param {FileInput[]} [inputs=[]] - Data you want to parse.
   */
  parse(inputs = []) { /* eslint no-unused-vars: 0 */ // --> OFF
    this.pluginData.components = [];
    this.pluginData.parseErrors = [];
  }

  /**
   * Set configuration into Components.
   *
   * @param {FileInput} file - Configuration file of components.
   */
  parseConfiguration(file) {
    const config = JSON.parse(file.content);

    if (!config[this.pluginData.name]) {
      return;
    }

    Object.keys(config[this.pluginData.name]).forEach((id) => {
      const component = this.pluginData.getComponentById(id);

      if (!component || !config[this.pluginData.name][id]) {
        return;
      }

      component.drawOption = new ComponentDrawOption(config[this.pluginData.name][id]);
    });
  }

  /**
   * Indicate if this parser can parse this file.
   *
   * @param {FileInformation} fileInformation - File information.
   * @returns {boolean} - Boolean that indicates if this file can be parsed or not.
   */
  isParsable(fileInformation) {
    return fileInformation !== undefined && fileInformation !== null;
  }
}

export default DefaultParser;
