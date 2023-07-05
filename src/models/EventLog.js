/**
 * Event log.
 */
class EventLog {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.id] - EventLog id.
   * @param {string} [props.parentId] - Parent id, to attach this log to another, like a
   * sub-process.
   * @param {string[]} [props.files] - Path of updated files.
   * @param {string[]} [props.components] - Id of updated components.
   * @param {string[]} [props.links] - Id of updated links.
   * @param {string} [props.type] - Type of log. Can be 'Plugin', 'Render', 'Metadata',
   * 'Drawer', 'Parser' or 'Data'.
   * @param {string} [props.action] - Action of log. Can be 'init', 'read', 'write', 'add',
   * 'update', 'move', 'resize', 'select' or 'delete'.
   * @param {string} [props.status] - Status of log. Can be 'running', 'success', 'warning'
   * or 'error'.
   * @param {string | number | Array | object} [props.data] - Extra data of log.
   */
  constructor(props = {
    id: null,
    parentId: null,
    files: null,
    components: null,
    links: null,
    type: null,
    action: null,
    status: null,
    data: null,
  }) {
    const {
      id,
      parentId,
      files,
      components,
      links,
      type,
      action,
      status,
      data,
    } = props;

    /**
     * EventLog id.
     * @type {string}
     */
    this.id = id || null;
    /**
     * Parent id, to attach this log to another, like a sub-process.
     * @type {string}
     */
    this.parentId = parentId || null;
    /**
     * Date time of event creation, as timestamp.
     * @type {number}
     */
    this.startDate = null;
    /**
     * Date time of event end, as timestamp.
     * @type {number}
     */
    this.endDate = null;
    /**
     * Path of updated files.
     * @type {string[]}
     */
    this.files = files || null;
    /**
     * Id of updated components.
     * @type {string[]}
     */
    this.components = components || null;
    /**
     * Id of updated links.
     * @type {string[]}
     */
    this.links = links || null;
    /**
     * Type of log. Can be 'Plugin', 'Render', 'Metadata', 'Drawer', 'Parser' or 'Data'.
     * @type {string}
     */
    this.type = type || null;
    /**
     * Action of log. Can be 'init', 'read', 'write', 'add', 'update', 'move', 'select' or 'delete'.
     * @type {string}
     */
    this.action = action || null;
    /**
     * Status of log. Can be 'running', 'success', 'warning' or 'error'.
     * @type {string}
     */
    this.status = status || null;
    /**
     * Extra data of log.
     * @type {string | number | Array | object}
     */
    this.data = data || null;
  }
}

export default EventLog;
