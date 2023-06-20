/**
 * Class that represents a parsing error. Used by the DefaultParser as default Error.
 * @augments {Error}
 */

class ParseError extends Error {
  /**
   * Default constructor.
   * @param {string} [message] - Message of the error.
   * @param {number} [startLine] - Start Line of the error.
   * @param {number} [startColumn] - Start Column of the error.
   * @param {number} [endLine] - End Line of the error.
   * @param {number} [endColumn] - End Column of the error.
   * @param {string} [severity] - Severity of the error: 'Warning' or 'Error'.
   */
  constructor(
    message = 'Error happened when trying to parse.',
    startLine = 0,
    startColumn = 0,
    endLine = 0,
    endColumn = 0,
    severity = 'Error',
  ) {
    super(message || 'Error happened when trying to parse.');
    /**
     * Name of the error.
     * @type {string}
     */
    this.name = 'ParseError';
    /**
     * Start Line of the error.
     * @type {number}
     * @default 0
     */
    this.startLine = startLine || 0;
    /**
     * Start Column of the error.
     * @type {number}
     * @default 0
     */
    this.startColumn = startColumn || 0;
    /**
     * End Line of the error.
     * @type {number}
     * @default 0
     */
    this.endLine = endLine || 0;
    /**
     * End Column of the error.
     * @type {number}
     * @default 0
     */
    this.endColumn = endColumn || 0;
    /**
     * Severity of the error: 'Warning' or 'Error'.
     * @type {string}
     * @default 'Error'
     */
    this.severity = severity || 'Error';
  }
}

export default ParseError;
