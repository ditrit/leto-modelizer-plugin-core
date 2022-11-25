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
   * @param {Boolean} [props.needsResizing] - Flag to indicate if
   * the width and height need re-computing.
   */
  constructor(props = {
    x: null,
    y: null,
    width: null,
    height: null,
    needsResizing: false,
  }) {
    const {
      x,
      y,
      width,
      height,
      needsResizing,
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
    this.needsResizing = needsResizing || false;
  }
}

export default ComponentDrawOption;
