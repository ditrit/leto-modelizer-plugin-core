import FileInformation from './FileInformation';

/**
 * Object to store the file content.
 * @augments {FileInformation}
 */
class FileInput extends FileInformation {
  /**
   * Default constructor.
   * @param {object} [props={}] - Object that contains all properties to set.
   * @param {string} [props.path=null] - File path.
   * @param {string} [props.name=null] - File name.
   * @param {string} [props.content=null] - File content.
   */
  constructor(props = { path: null, name: null, content: null }) {
    super(props);
    const {
      content,
    } = props;

    /**
     * Content of the file.
     * @type {string}
     */
    this.content = content || null;
  }
}

export default FileInput;
