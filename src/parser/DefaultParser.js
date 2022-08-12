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
   * @param {String[]} [inputs=[]] - Data you want to parse.
   * @return {Object} - Object that contains all components and links.
   */
  parse(inputs = []) {
    return {
      components: inputs,
      links: inputs,
    };
  }

  /**
   * Indicate if this parser can parse this file.
   * @param {String} [fileName] - Name of file.
   * @return {Boolean} - Boolean that indicates if this file can be parsed or not.
   */
  isParsable(fileName) {
    return fileName !== undefined && fileName !== null;
  }
}

export default DefaultParser;
