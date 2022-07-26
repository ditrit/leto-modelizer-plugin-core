/**
* Class that used for parsing.
*/
class DefaultParser {
  /**
  * Convert the content of files into Components.
  * @param {String[]} inputs Data you want to parse.
  */
  parse(inputs = []) {
    return {
      components: inputs,
      links: inputs,
    };
  }
}

export default DefaultParser;
