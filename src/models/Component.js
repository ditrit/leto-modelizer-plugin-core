/**
 * A model for modelling tools in Leto Modelizer.
 */
class Component {
  /**
   * Default constructor.
   *
   * @param {String} id The id of this Component.
   * @param {String} name The name of this Component.
   * @param {ComponentDefinition} definition The Definition used to instanciate this Component.
   * @param {ComponentDrawOption} drawOption The options used to draw this Component.
   * @param {ComponentAttribute[]} attributes Attributes of Component.
   */
  constructor(
    id = null,
    name = null,
    definition = null,
    drawOption = null,
    attributes = [],
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
     * @type {Componentdefinition}
     */
    this.definition = definition;
    /**
     * @type {ComponentDrawOption}
     */
    this.drawOption = drawOption;
    /**
     * @type {ComponentAttribute[]}
     */
    this.attributes = attributes;
    /**
     * @type {Component[]}
     */
    this.children = [];
  }

  /**
   * Method that adds Component to this.children.
   *
   * @param {Component} child Component we want to add.
   */
  addChild(child) {
    const { parentTypes } = child.definition;
    const { isContainer } = this.definition;
    if (
      isContainer
      && parentTypes.includes(this.definition.type)
      && !this.children.includes(child)
    ) {
      this.children.push(child);
    }
  }
}
export default Component;
