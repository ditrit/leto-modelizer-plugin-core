/**
 * Object to store all file information.
 */
class FileInformation {
  /**
   * Default constructor.
   * @param {String} [props.path=null] - File path.
   */
  constructor(props = { path: null }) {
    const {
      path,
    } = props;

    /**
     * Path of the file.
     * @type {String}
     */
    this.path = path || null;
  }

  /**
   * Get file name.
   * @return {String} File name
   */
  get fileName() {
    return this.path ? this.path.replace(/^.*[\\/]/, '') : null;
  }
}

export default FileInformation;
