/**
 * Class that represents a parsing error. Used by the DefaultParser as default Error.
 */

class ParseError extends Error {
  /**
   * Default constructor.
   *
   * @param {String} message Message of the error.
   * @param {String} name Name of the error.
   * @param {Number} startLine start Line of the error.
   * @param {Number} startColumn start Column of the error.
   * @param {Number} endLine end Line of the error.
   * @param {Number} endColumn end Column of the error.
   * @param {String} severity severity of the error: 'Warning' or 'Error'.
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
     * @type {String}
     */
    this.name = 'ParseError';
    /**
     * @type {Number}
     */
    this.startLine = startLine;
    /**
     * @type {Number}
     */
    this.startColumn = startColumn;
    /**
     * @type {Number}
     */
    this.endLine = endLine;
    /**
     * @type {Number}
     */
    this.endColumn = endColumn;
    /**
     * @type {String}
     */
    this.severity = severity;
  }
}

export default ParseError;
