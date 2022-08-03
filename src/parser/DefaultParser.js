/**
 * Class that used for parsing.
 * @interface
 */
class DefaultParser {
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
   * @param {String} [fileName=""] - Name of file.
   * @return {Boolean} Boolean of if this file can be parse or not.
   */
  isParsable(fileName = '') {
    return fileName !== null;
  }
}

export default DefaultParser;
