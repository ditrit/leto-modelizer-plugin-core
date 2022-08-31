/**
 * Class that used for parsing.
 * @interface
 */
class DefaultParser {
  /**
   * Default constructor.
   * @param {ComponentDefinition[]} [definitions=[]] - All component definitions that can be managed
   * by the parser.
   */
  constructor(definitions = []) {
    /**
     * All component definitions that can be managed by the parser.
     * @type {ComponentDefinition[]}
     */
    this.definitions = definitions;
  }

  /**
   * Convert the content of files into Components.
   * @param {FileInput[]} [inputs=[]] - Data you want to parse.
   * @return {Object} - Object that contains all components, links and errors.
   */
  parse(inputs = []) { /* eslint no-unused-vars: 0 */ // --> OFF
    return {
      components: [],
      links: [],
      errors: [],
    };
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
