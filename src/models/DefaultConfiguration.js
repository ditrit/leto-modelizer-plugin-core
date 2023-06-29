/**
 * Default plugin configuration.
 */
class DefaultConfiguration {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {object} [props.editor] - Object that contains all properties of editor
   * configuration.
   * @param {object} [props.editor.syntax] - Syntax configuration.
   * @param {string} [props.restrictiveFolder] - Restrictive folder for new component if provided.
   * @param {string} [props.defaultFileName] - Default file name for new components.
   * @param {string} [props.defaultFileExtension] - Default file extension for components.
   * @param {Tag[]} [props.tags] - All plugin tags.
   */
  constructor(props = {
    editor: {
      syntax: null,
    },
    restrictiveFolder: null,
    defaultFileName: null,
    defaultFileExtension: null,
    tags: [],
  }) {
    /**
     * Object that contains all properties of editor configuration.
     * @type {object}
     */
    this.editor = {
      syntax: null,
      ...props.editor,
    };
    /**
     * Restrictive folder for new component if provided.
     * @type {string}
     */
    this.restrictiveFolder = props.restrictiveFolder || null;
    /**
     * Default file name for new components.
     * @type {string}
     */
    this.defaultFileName = props.defaultFileName || null;
    /**
     * Default file extension for components.
     * @type {string}
     */
    this.defaultFileExtension = props.defaultFileExtension || null;
    /**
     * All plugin tags.
     * @type {Tag[]}
     * @default []
     */
    this.tags = props.tags || [];
  }
}

export default DefaultConfiguration;
