import FileInformation from 'src/models/FileInformation';

/**
 * Class that links Components together.
 * @extends {FileInformation}
 */
class ComponentLink extends FileInformation {
  /**
   * Default constructor.
   *
   * @param {Object} [from={}] - Where the link is created.
   * @param {String} [from.id] - ID of the component.
   * @param {Object} [to={}] - Target of the link.
   * @param {String} [to.id] - ID of the component.
   * @param {String} [type] - Representation of the link.
   */
  constructor(from = { id: null }, to = { id: null }, type = null) {
    super();
    /**
     * Where the link is created.
     * @type {Object}
     */
    this.from = from;
    /**
     * Target of the link.
     * @type
     */
    this.to = to;
    /**
     * Representation of the link.
     * @type {String}
     */
    this.type = type;
  }
}

export default ComponentLink;
