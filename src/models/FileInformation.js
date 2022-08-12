/**
 * Object to store all file information.
 */
class FileInformation {
  /**
   * Default constructor.
   * @param {String} [path=null] - File path.
   * @param {String} [name=null] - File name.
   */
  constructor(path = null, name = null) {
    /**
     * Path of the file.
     * @type {String}
     */
    this.path = path;
    /**
     * File name.
     * @type {String}
     */
    this.name = name;
  }
}

export default FileInformation;
