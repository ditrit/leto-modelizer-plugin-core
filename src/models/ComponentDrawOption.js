/**
 * Option for the Component drawing.
 */
class ComponentDrawOption {
  /**
   * Default constructor
   * @param {object} [props] - Object that contains all properties to set.
   * @param {number} [props.x] - X Position of Component.
   * @param {number} [props.y] - Y Position of Component.
   * @param {number} [props.width] - Width of Component in pixel.
   * @param {number} [props.height] - Height of Component in pixel.
   * @param {boolean} [props.needsResizing] - Flag to indicate if
   * the Component's width and height need re-computing.
   * @param {boolean} [props.needsPositioning] - Flag to indicate if
   * the Component's position needs re-computing.
   * @param {boolean} [props.manuallyResized] - Flag to indicate if the Component was resized
   * manually.
   */
  constructor(props = {
    x: null,
    y: null,
    width: null,
    height: null,
    needsResizing: false,
    needsPositioning: false,
    manuallyResized: false,
  }) {
    const {
      x,
      y,
      width,
      height,
      needsResizing,
      needsPositioning,
      manuallyResized,
    } = props;

    /**
     * X Position of Component.
     * @type {number}
     */
    this.x = x || null;

    /**
     * Y Position of Component.
     * @type {number}
     */
    this.y = y || null;

    /**
     * Width of Component in pixel.
     * @type {number}
     */
    this.width = width || null;

    /**
     * Height of Component in pixel.
     * @type {number}
     */
    this.height = height || null;

    /**
     * True if the component needs to be resized
     * @type {boolean}
     */
    this.needsResizing = needsResizing || false;

    /**
     * True if the component should be positioned automatically.
     * @type {boolean}
     */
    this.needsPositioning = needsPositioning || false;

    /**
     * True if the component was manually resized.
     * @type {boolean}
     */
    this.manuallyResized = manuallyResized || false;
  }
}

export default ComponentDrawOption;
