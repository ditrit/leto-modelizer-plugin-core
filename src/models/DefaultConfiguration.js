/**
 * Default plugin configuration.
 */
class DefaultConfiguration {
  /**
   * Default constructor.
   *
   * @param {object} [props={}] - Object that contains all properties to set.
   * @param {object} [props.editor={}] - Object that contains all properties of editor
   * configuration.
   * @param {object} [props.editor.syntax] - Syntax configuration.
   * @param {string} [props.defaultFileName] - Default file name for new components.
   * @param {string} [props.defaultFileExtension] - Default file extension for components.
   */
  constructor(props = {
    editor: {
      syntax: null,
    },
    defaultFileName: null,
    defaultFileExtension: null,
  }) {
    /**
     * Object that contains all properties of editor configuration.
     *
     * @type {object}
     */
    this.editor = {
      syntax: null,
      ...props.editor,
    };
    /**
     * Default file name for new components.
     *
     * @type {string}
     */
    this.defaultFileName = props.defaultFileName || null;
    /**
     * Default file extension for components.
     *
     * @type {string}
     */
    this.defaultFileExtension = props.defaultFileExtension || null;
  }
}

export default DefaultConfiguration;
