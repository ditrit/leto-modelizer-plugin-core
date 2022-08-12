/**
 * Object to store all file information.
 */
class FileInformation {
  /**
   * Default constructor.
   * @param {String} [props.path=null] - File path.
   * @param {String} [props.name=null] - File name.
   */
  constructor(props = { path: null, name: null }) {
    const {
      path,
      name,
    } = props;
    /**
     * Path of the file.
     * @type {String}
     */
    this.path = path || null;
    /**
     * File name.
     * @type {String}
     */
    this.name = name || null;
  }
}

export default FileInformation;
