/**
 * A model for modelling tools in Leto Modelizer.
 */
class Component {
  /**
   * Default constructor.
   *
   * @param {String} [id] - The id of this Component.
   * @param {String} [name] - The name of this Component.
   * @param {ComponentDefinition} [definition] - The Definition used to instantiate this Component.
   * @param {ComponentDrawOption} [drawOption] - The options used to draw this Component.
   * @param {ComponentAttribute[]} [attributes=[]] - Attributes of Component.
   */
  constructor(
    id = null,
    name = null,
    definition = null,
    drawOption = null,
    attributes = [],
  ) {
    /**
     * The id of this Component.
     * @type {String}
     */
    this.id = id;
    /**
     * The name of this Component.
     * @type {String}
     */
    this.name = name;
    /**
     * The Definition used to instantiate this Component.
     * @type {Componentdefinition}
     */
    this.definition = definition;
    /**
     * The options used to draw this Component.
     * @type {ComponentDrawOption}
     */
    this.drawOption = drawOption;
    /**
     * Attributes of Component.
     * @type {ComponentAttribute[]}
     */
    this.attributes = attributes;
    /**
     * Array that contains all sub-components.
     * @type {Component[]}
     */
    this.children = [];
  }

  /**
   * Method that adds Component to this.children.
   *
   * @param {Component} child - Component we want to add.
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

  * [Symbol.iterator]() {
    const allDescendants = this.children.slice();
    yield this;
    while (allDescendants.length !== 0) {
      const child = allDescendants.shift();
      yield child;
      allDescendants.push(...child.children);
    }
  }
}

export default Component;
