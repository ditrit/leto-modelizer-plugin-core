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
   * @param {boolean} [props.hide] - Indicate if component is hidden.
   */
  constructor(props = {
    x: null,
    y: null,
    width: null,
    height: null,
    hide: false,
  }) {
    const {
      x,
      y,
      width,
      height,
      hide,
    } = props;

    /**
     * X Position of Component relative to its container(scene or component).
     * @type {number}
     */
    this.x = x || null;

    /**
     * Y Position of Component relative to its container(scene or component).
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
     * Indicate if component is hidden.
     * @type {boolean}
     */
    this.hide = hide || false;
  }
}

export default ComponentDrawOption;
