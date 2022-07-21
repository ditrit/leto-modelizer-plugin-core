class ComponentDrawOption {
  /**
   * Default constructor
   *
   * @param {Float} x X Position of Component.
   * @param {Float} y Y Position of Component.
   * @param {Integer} width Width of Component in pixel.
   * @param {Integer} height Height of Component in pixel.
   */
  constructor(x = null, y = null, width = null, height = null) {
    /**
     * @type {Float}
     */
    this.x = x;
    /**
     * @type {Float}
     */
    this.y = y;
    /**
     * @type {Integer}
     */
    this.width = width;
    /**
     * @type {Integer}
     */
    this.height = height;
  }
}

export default ComponentDrawOption;
