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
}

export default DefaultParser;
