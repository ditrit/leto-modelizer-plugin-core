/**
 * Miscellaneous information about the Component drawing.
 */
class ComponentDrawOption {
  /**
   * Default constructor
   *
   * @param {Number} x X Position of Component.
   * @param {Number} y Y Position of Component.
   * @param {Number} width Width of Component in pixel.
   * @param {Number} height Height of Component in pixel.
   */
  constructor(x = null, y = null, width = null, height = null) {
    /**
     * @type {Number}
     */
    this.x = x;
    /**
     * @type {Number}
     */
    this.y = y;
    /**
     * @type {Number}
     */
    this.width = width;
    /**
     * @type {Number}
     */
    this.height = height;
  }
}

export default ComponentDrawOption;
