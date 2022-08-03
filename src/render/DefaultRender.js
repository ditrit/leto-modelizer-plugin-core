/**
 * Class that compile a Component to data.
 * @interface
 */
class DefaultRender {
  /**
   * Transform all provided components and links in string.
   * @param {Array} [components=[]] - List of components you want to convert.
   * @param {Array} [links=[]] - List of links you want to convert.
   * @return {String} - Generated string from components and links.
   */
  render(components = [], links = []) { /* eslint no-unused-vars: 0 */ // --> OFF
    return 'string';
  }
}

export default DefaultRender;
