/**
 * Class that used for parsing.
 * @interface
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
   * @param {FileInput[]} [inputs=[]] - Data you want to parse.
   */
  parse(inputs = []) { /* eslint no-unused-vars: 0 */ // --> OFF
    this.pluginData.components = [];
    this.pluginData.links = [];
    this.pluginData.parseErrors = [];
  }

  /**
   * Indicate if this parser can parse this file.
   * @param {FileInformation} fileInformation - File information.
   * @return {Boolean} - Boolean that indicates if this file can be parsed or not.
   */
  isParsable(fileInformation) {
    return fileInformation !== undefined && fileInformation !== null;
  }
}

export default DefaultParser;
