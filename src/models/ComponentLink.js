import FileInformation from 'src/models/FileInformation';

/**
 * Class that links Components together.
 * @extends {FileInformation}
 */
class ComponentLink extends FileInformation {
  /**
   * Default constructor.
   *
   * @param {Object} [props.from={}] - Where the link is created.
   * @param {String} [props.from.id] - ID of the component.
   * @param {Object} [props.to={}] - Target of the link.
   * @param {String} [props.to.id] - ID of the component.
   * @param {String} [props.type] - Representation of the link.
   */
  constructor(props = {
    from: { id: null },
    to: { id: null },
    type: null,
  }) {
    super();
    const {
      from,
      to,
      type,
    } = props;
    /**
     * Where the link is created.
     * @type {Object}
     */
    this.from = { id: null, ...from };
    /**
     * Target of the link.
     * @type
     */
    this.to = { id: null, ...to };
    /**
     * Representation of the link.
     * @type {String}
     */
    this.type = type || null;
  }
}

export default ComponentLink;
