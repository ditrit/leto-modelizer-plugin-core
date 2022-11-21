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
  setReferenceAttribute(container) {
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
   * Remove all reference attributes, corresponding to the container if existing.
   * @param {Component} container - Container.
   */
  removeAllReferenceAttributes(container) {
    if (container) {
      this.attributes = this.attributes
        .filter(({ definition, value }) => !(definition.type === 'Reference'
        && definition.containerRef === container.definition.type
        && value === container.id));
    } else {
      this.attributes = this.attributes.filter(({ definition }) => definition.type !== 'Reference');
    }
  }

  /**
   * Set the attribute of a given link
   * @param {ComponentLink} link - The link we want to set the attribute.
   */
  setLinkAttribute(link) {
    const attributeDefinition = this.definition.definedAttributes
      .find(({ name }) => name === link.definition.attributeRef);
    const attribute = this.attributes.find(({ definition }) => definition.type === 'Link'
      && attributeDefinition.name === definition.name);

    if (attribute && !attribute.value.includes(link.target)) {
      attribute.value.push(link.target);
    } else if (!attribute) {
      this.attributes.push(new ComponentAttribute({
        name: attributeDefinition.name,
        definition: attributeDefinition,
        type: 'Array',
        value: [link.target],
      }));
    }
  }

  /**
   * Remove id in all link attributes' value then if value is empty remove attribute.
   * @param {String} id - Id to remove.
   */
  removeLinkAttributeById(id) {
    this.attributes = this.attributes
      .filter((attribute) => {
        if (attribute.definition && attribute.definition.type === 'Link') {
          const index = attribute.value.findIndex((value) => value === id);

          if (index >= 0) {
            attribute.value.splice(index, 1);
          }

          return attribute.value.length !== 0;
        }

        return true;
      });
  }
}

export default Component;
