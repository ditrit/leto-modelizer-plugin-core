/**
 * Class that represents a parsing error. Used by the DefaultParser as default Error.
 * @extends {Error}
 */

class ParseError extends Error {
  /**
   * Default constructor.
   *
   * @param {String} [message="Error happened when trying to parse."] - Message of the error.
   * @param {Number} [startLine=0] - Start Line of the error.
   * @param {Number} [startColumn=0] - Start Column of the error.
   * @param {Number} [endLine=0] - End Line of the error.
   * @param {Number} [endColumn=0] - End Column of the error.
   * @param {String} [severity="Error"] - Severity of the error: 'Warning' or 'Error'.
   */
  constructor(
    message = 'Error happened when trying to parse.',
    startLine = 0,
    startColumn = 0,
    endLine = 0,
    endColumn = 0,
    severity = 'Error',
  ) {
    super(message);
    /**
     * Name of the error.
     * @type {String}
     */
    this.name = 'ParseError';
    /**
     * Start Line of the error.
     * @type {Number}
     */
    this.startLine = startLine;
    /**
     * Start Column of the error.
     * @type {Number}
     */
    this.startColumn = startColumn;
    /**
     * End Line of the error.
     * @type {Number}
     */
    this.endLine = endLine;
    /**
     * End Column of the error.
     * @type {Number}
     */
    this.endColumn = endColumn;
    /**
     * Severity of the error: 'Warning' or 'Error'.
     * @type {String}
     */
    this.severity = severity;
  }
}

export default ParseError;
