/**
 * Option for the Component drawing.
 */
class ComponentDrawOption {
  /**
   * Default constructor
   *
   * @param {Number} [props.x] - X Position of Component.
   * @param {Number} [props.y] - Y Position of Component.
   * @param {Number} [props.width] - Width of Component in pixel.
   * @param {Number} [props.height] - Height of Component in pixel.
   */
  constructor(props = {
    x: null,
    y: null,
    width: null,
    height: null,
  }) {
    const {
      x,
      y,
      width,
      height,
    } = props;

    /**
     * X Position of Component.
     * @type {Number}
     */
    this.x = x || null;
    /**
     * Y Position of Component.
     * @type {Number}
     */
    this.y = y || null;
    /**
     * Width of Component in pixel.
     * @type {Number}
     */
    this.width = width || null;
    /**
     * Height of Component in pixel.
     * @type {Number}
     */
    this.height = height || null;
  }
}

export default ComponentDrawOption;
