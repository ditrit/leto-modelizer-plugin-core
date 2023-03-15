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
   */
  constructor(props = {
    editor: {
      syntax: null,
    },
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
  }
}

export default DefaultConfiguration;
