/**
 * Class that represents a parsing error. Used by the DefaultParser as default Error.
 *
 * @augments {Error}
 */

class ParseError extends Error {
  /**
   * Default constructor.
   *
   * @param {string} [message="Error happened when trying to parse."] - Message of the error.
   * @param {number} [startLine=0] - Start Line of the error.
   * @param {number} [startColumn=0] - Start Column of the error.
   * @param {number} [endLine=0] - End Line of the error.
   * @param {number} [endColumn=0] - End Column of the error.
   * @param {string} [severity="Error"] - Severity of the error: 'Warning' or 'Error'.
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
     *
     * @type {string}
     */
    this.name = 'ParseError';
    /**
     * Start Line of the error.
     *
     * @type {number}
     */
    this.startLine = startLine;
    /**
     * Start Column of the error.
     *
     * @type {number}
     */
    this.startColumn = startColumn;
    /**
     * End Line of the error.
     *
     * @type {number}
     */
    this.endLine = endLine;
    /**
     * End Column of the error.
     *
     * @type {number}
     */
    this.endColumn = endColumn;
    /**
     * Severity of the error: 'Warning' or 'Error'.
     *
     * @type {string}
     */
    this.severity = severity;
  }
}

export default ParseError;
