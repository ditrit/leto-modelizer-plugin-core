/**
 * Option for the Component drawing.
 */
class ComponentDrawOption {
  /**
   * Default constructor
   *
   * @param {Number} [x] - X Position of Component.
   * @param {Number} [y] - Y Position of Component.
   * @param {Number} [width] - Width of Component in pixel.
   * @param {Number} [height] - Height of Component in pixel.
   */
  constructor(x = null, y = null, width = null, height = null) {
    /**
     * X Position of Component.
     * @type {Number}
     */
    this.x = x;
    /**
     * Y Position of Component.
     * @type {Number}
     */
    this.y = y;
    /**
     * Width of Component in pixel.
     * @type {Number}
     */
    this.width = width;
    /**
     * Height of Component in pixel.
     * @type {Number}
     */
    this.height = height;
  }
}

export default ComponentDrawOption;
