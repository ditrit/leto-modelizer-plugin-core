/**
 * Object to store all file information.
 */
class FileInformation {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.path] - File path.
   */
  constructor(props = { path: null }) {
    const {
      path,
    } = props;

    /**
     * Path of the file.
     * @type {string}
     * @default null
     */
    this.path = path || null;
  }

  /**
   * Get file name.
   * @returns {string} File name
   */
  get fileName() {
    return this.path ? this.path.replace(/^.*[\\/]/, '') : null;
  }
}

export default FileInformation;
