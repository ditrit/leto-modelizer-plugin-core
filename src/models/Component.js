/**
 * A model for modelling tools in Leto's projects.
 */
class Component {
  /**
   * Default constructor.
   *
   * @param {String} id The id of the Component.
   * @param {String} name The name of the Component.
   * @param {ComponentType} type The ComponentType used to instanciate this Component.
   * @param {ComponentDrawOption} drawOption The options used to draw this Component.
   */
  constructor(
    id = null,
    name = null,
    type = null,
    drawOption = null,
  ) {
    /**
     * @type {String}
     */
    this.id = id;
    /**
     * @type {String}
     */
    this.name = name;
    /**
     * @type {ComponentType}
     */
    this.type = type;
    /**
     * @type {ComponentDrawOption}
     */
    this.drawOption = drawOption;
    /**
     * @type {ComponentAttribute[]}
     */
    this.attribute = [];
    /**
     * @type {Component[]}
     */
    this.subContent = [];
  }

  addSubContent(component) {
    const { containerTypes } = component.type;
    const { isContainer } = this.type;
    if (
      isContainer
      && containerTypes.include(this.type.name)
      && !this.subContent.include(component)
    ) {
      this.subContent.push(component);
    }
  }
}
export default Component;
