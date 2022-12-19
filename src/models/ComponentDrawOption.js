/**
 * Option for the Component drawing.
 */
class ComponentDrawOption {
  /**
   * Default constructor
   *
   * @param {object} [props={}] - Object that contains all properties to set.
   * @param {number} [props.x] - X Position of Component.
   * @param {number} [props.y] - Y Position of Component.
   * @param {number} [props.width] - Width of Component in pixel.
   * @param {number} [props.height] - Height of Component in pixel.
   * @param {boolean} [props.needsResizing] - Flag to indicate if
   * the Component's width and height need re-computing.
   * @param {boolean} [props.needsPositioning] - Flag to indicate if
   * the Component's position needs re-computing.
   */
  constructor(props = {
    x: null,
    y: null,
    width: null,
    height: null,
    needsResizing: false,
    needsPositioning: false,
  }) {
    const {
      x,
      y,
      width,
      height,
      needsResizing,
      needsPositioning,
    } = props;

    /**
     * X Position of Component.
     *
     * @type {number}
     */
    this.x = x || null;
    /**
     * Y Position of Component.
     *
     * @type {number}
     */
    this.y = y || null;
    /**
     * Width of Component in pixel.
     *
     * @type {number}
     */
    this.width = width || null;
    /**
     * Height of Component in pixel.
     *
     * @type {number}
     */
    this.height = height || null;
    this.needsResizing = needsResizing || false;
    this.needsPositioning = needsPositioning || false;
  }
}

export default ComponentDrawOption;
