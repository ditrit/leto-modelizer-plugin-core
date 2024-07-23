/**
 * Log of parser.
 */
class ParserLog {
  /**
   * Hint severity value.
   * @type {number}
   */
  static SEVERITY_HINT = 1;

  /**
   * Info severity value.
   * @type {number}
   */
  static SEVERITY_INFO = 2;

  /**
   * Warning severity value.
   * @type {number}
   */
  static SEVERITY_WARNING = 4;

  /**
   * Error severity value.
   * @type {number}
   */
  static SEVERITY_ERROR = 8;

  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.path] - File path.
   * @param {number} [props.severity] - Log severity.
   * @param {number} [props.startLineNumber] - The starting line of the error.
   * @param {number} [props.startColumn] - The starting column of the error.
   * @param {number} [props.endLineNumber] - The ending line of the error.
   * @param {number} [props.endColumn] - The ending column of the error.
   * @param {string} [props.message] - The i18n key used in leto.
   * @param {string} [props.componentId] - The component id where the error appears.
   * @param {string} [props.attribute] - The attribute name where the error appears, if null error
   * is on the component.
   */
  constructor(props = {
    path: null,
    severity: null,
    startLineNumber: null,
    startColumn: null,
    endLineNumber: null,
    endColumn: null,
    message: null,
    componentId: null,
    attribute: null,
  }) {
    const {
      path,
      severity,
      startLineNumber,
      startColumn,
      endLineNumber,
      endColumn,
      message,
      componentId,
      attribute,
    } = props;

    /**
     * Path of the file.
     * @type {string}
     * @default null
     */
    this.path = path ?? null;

    /**
     * Log everity.
     * @type {number}
     * @default 0
     */
    this.severity = severity ?? ParserLog.SEVERITY_HINT;

    /**
     * The starting line of the error.
     * @type {number}
     */
    this.startLineNumber = startLineNumber ?? null;

    /**
     * The starting column of the error.
     * @type {number}
     */
    this.startColumn = startColumn ?? null;

    /**
     * The ending line of the error.
     * @type {number}
     */
    this.endLineNumber = endLineNumber ?? null;

    /**
     * The ending column of the error.
     * @type {number}
     */
    this.endColumn = endColumn ?? null;

    /**
     * The i18n key used in leto.
     * @type {string}
     */
    this.message = message ?? null;

    /**
     * The component id where the error appears.
     * @type {string}
     */
    this.componentId = componentId ?? null;

    /**
     * The attribute name where the error appears, if null error
     * is on the component.
     * @type {string}
     */
    this.attribute = attribute ?? null;
  }
}

export default ParserLog;
