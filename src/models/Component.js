import FileInformation from './FileInformation';

/**
 * A model for modelling tools in Leto Modelizer.
 * @extends {FileInformation}
 */
class Component extends FileInformation {
  /**
   * Default constructor.
   *
   * @param {String} [props.id] - The id of this Component.
   * @param {String} [props.name] - The name of this Component.
   * @param {ComponentDefinition} [props.definition] - The Definition used to instantiate this
   * Component.
   * @param {ComponentDrawOption} [props.drawOption] - The options used to draw this Component.
   * @param {ComponentAttribute[]} [props.attributes=[]] - Attributes of Component.
   * @param {ComponentAttribute[]} [props.children=[]] - Children of Component.
   */
  constructor(props = {
    id: null,
    name: null,
    definition: null,
    drawOption: null,
    attributes: [],
    children: [],
  }) {
    super(props);
    const {
      id,
      name,
      definition,
      drawOption,
      attributes,
      children,
    } = props;
    /**
     * The id of this Component.
     * @type {String}
     */
    this.id = id || null;
    /**
     * The name of this Component.
     * @type {String}
     */
    this.name = name || null;
    /**
     * The Definition used to instantiate this Component.
     * @type {ComponentDefinition}
     */
    this.definition = definition || null;
    /**
     * The options used to draw this Component.
     * @type {ComponentDrawOption}
     */
    this.drawOption = drawOption || null;
    /**
     * Attributes of Component.
     * @type {ComponentAttribute[]}
     */
    this.attributes = attributes || [];
    /**
     * Array that contains all subcomponents.
     * @type {Component[]}
     */
    this.children = children || [];
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
}

export default Component;
