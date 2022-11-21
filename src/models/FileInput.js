import FileInformation from './FileInformation';

/**
 * Object to store the file content.
 * @extends {FileInformation}
 */
class FileInput extends FileInformation {
  /**
   * Default constructor.
   * @param {String} [props.path=null] - File path.
   * @param {String} [props.name=null] - File name.
   * @param {String} [props.content=null] - File content.
   */
  constructor(props = { path: null, name: null, content: null }) {
    super(props);
    const {
      content,
    } = props;

    /**
     * Content of the file.
     * @type {String}
     */
    this.content = content || null;
  }
}

export default FileInput;
