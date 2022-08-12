import FileInformation from 'src/models/FileInformation';

/**
 * Object to store the file content.
 * @extends {FileInformation}
 */
class FileInput extends FileInformation {
  /**
   * Default constructor.
   * @param {String} [path=null] - File path.
   * @param {String} [name=null] - File name.
   * @param {String} [content=null] - File content.
   */
  constructor(path = null, name = null, content = null) {
    super(path, name);
    /**
     * Content of the file.
     * @type {String}
     */
    this.content = content;
  }
}

export default FileInput;
