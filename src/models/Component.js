import ComponentAttribute from './ComponentAttribute';
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
   * Set container value in attributes.
   * @param {Component} container - Container.
   */
  setContainerAttribute(container) {
    const attributeDefinition = this.definition.definedAttributes
      .find((definition) => definition.containerRef.includes(
        container.definition.type,
      ));

    if (!attributeDefinition) {
      return;
    }

    const attributes = this.attributes
      .filter(({ definition }) => definition.name === attributeDefinition.name);

    if (attributes.length > 0) {
      attributes.forEach((attribute) => {
        attribute.value = container.id;
      });
    } else {
      this.attributes.push(new ComponentAttribute({
        name: attributeDefinition.name,
        value: container.id,
        type: 'String',
        definition: attributeDefinition,
      }));
    }
  }

  /**
   * Remove all attributes referring to the container.
   */
  unsetAllContainerAttribute() {
    this.attributes = this.attributes.filter(({ definition }) => definition.type !== 'Reference');
  }

  /**
   * Remove attribute referring to the container.
   * @param {Component} container - Container.
   */
  unsetContainerAttribute(container) {
    this.attributes = this.attributes.filter(({ definition, value }) => !(definition.type === 'Reference'
      && definition.containerRef === container.definition.type
      && value === container.id));
  }
}

export default Component;
