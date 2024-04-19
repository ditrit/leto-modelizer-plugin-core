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
   * @param {string} [props.layoutDirection] - Layout direction of the Component.
   */
  constructor(props = {
    x: null,
    y: null,
    sceneX: null,
    sceneY: null,
    width: null,
    height: null,
    needsResizing: false,
    needsPositioning: false,
    manuallyResized: false,
    layoutDirection: 'UNDEFINED',
    anchors: null,
    hide: false,
  }) {
    const {
      x,
      y,
      sceneX,
      sceneY,
      width,
      height,
      needsResizing,
      needsPositioning,
      manuallyResized,
      anchors,
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
     * X Position of Component relative to the scene.
     * @type {number}
     */
    this.sceneX = sceneX || null;

    /**
     * Y Position of Component relative to the scene.
     * @type {number}
     */
    this.sceneY = sceneY || null;

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
     * True width of Component in pixel.
     * @type {number}
     */
    this.innerWidth = null;

    /**
     * True height of Component in pixel.
     * @type {number}
     */
    this.innerHeight = null;

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

    /**
     * Layout direction of the Component.
     * @type {string} - 'UNDEFINED', 'RIGHT', 'LEFT', 'UP', 'DOWN'
     */
    this.layoutDirection = props.layoutDirection || 'UNDEFINED';

    this.anchors = props.anchors || [];
    this.hide = props.hide || false;
  }
}

export default ComponentDrawOption;
