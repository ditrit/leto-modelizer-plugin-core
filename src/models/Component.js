import ComponentAttribute from './ComponentAttribute';
import FileInformation from './FileInformation';

/**
 * A model for modelling tools in Leto Modelizer.
 * @augments {FileInformation}
 */
class Component extends FileInformation {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.id] - The id of this Component.
   * @param {string} [props.name] - The name of this Component.
   * @param {ComponentDefinition} [props.definition] - The Definition used to instantiate this
   * Component.
   * @param {ComponentDrawOption} [props.drawOption] - The options used to draw this Component.
   * @param {ComponentAttribute[]} [props.attributes] - Attributes of Component.
   */
  constructor(props = {
    id: null,
    name: null,
    definition: null,
    drawOption: null,
    attributes: [],
  }) {
    super(props);
    const {
      id,
      name,
      definition,
      drawOption,
      attributes,
    } = props;

    /**
     * Use for drawer to get the type of object.
     * @type {string}
     * @private
     */
    this.__class = 'Component';
    /**
     * The id of this Component.
     * @type {string}
     */
    this.id = id || null;
    /**
     * The name of this Component.
     * @type {string}
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
     * @default []
     */
    this.attributes = attributes || [];
  }

  /**
   * Set the id of this Component with value parameter.
   * @param {string} value - New id value.
   */
  setId(value) {
    this.id = value;
  }

  /**
   * Set container value in attributes.
   * @param {Component} container - Container.
   */
  setReferenceAttribute(container) {
    const attributeDefinition = this.definition.definedAttributes
      .find((definition) => definition.containerRef === container.definition.type);

    if (!attributeDefinition) {
      return;
    }

    const attributes = this.attributes
      .filter(({ definition }) => definition?.name === attributeDefinition.name);

    if (attributes.length > 0) {
      attributes.forEach((attribute) => {
        attribute.setReferenceValue(container.id);
      });
    } else {
      this.attributes.push(this.createAttribute({
        name: attributeDefinition.name,
        value: container.id,
        type: 'String',
        definition: attributeDefinition,
      }));
    }
  }

  /**
   * Create a new instance of ComponentAttribute with the provided properties.
   * @param {object} props - Properties to initialize the ComponentAttribute with.
   * @returns {ComponentAttribute} A new ComponentAttribute instance.
   */
  createAttribute(props) {
    return new ComponentAttribute(props);
  }

  /**
   * Remove all reference attributes, corresponding to the container if existing.
   * @param {Component} container - Container.
   */
  removeAllReferenceAttributes(container) {
    if (container) {
      this.attributes = this.attributes
        .filter((attribute) => !(attribute.definition.type === 'Reference'
          && attribute.definition.containerRef === container.definition.type
          && attribute.getReferenceValue() === container.id));
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
      attribute.addLink(link.target);
    } else if (!attribute) {
      this.attributes.push(this.createAttribute({
        name: attributeDefinition.name,
        definition: attributeDefinition,
        type: 'Array',
        value: [link.target],
      }));
    }
  }

  /**
   * Remove id in link attribute corresponding to the given name if provided
   * otherwise remove id in all link attributes' value.
   * Then if value is empty remove attribute.
   * @param {string} id - Id to remove.
   * @param {string} [name] - Name of attribute to remove.
   */
  removeLinkAttribute(id, name = null) {
    this.attributes = this.attributes
      .filter((attribute) => {
        if (name && attribute.name !== name) {
          return true;
        }
        if (attribute.definition && attribute.definition.type === 'Link') {
          return attribute.removeLink(id);
        }

        return true;
      });
  }

  /**
   * Get attribute corresponding to the given name.
   * @param {string} name - Name of attribute to find.
   * @returns {ComponentAttribute|null} Component attribute or null.
   */
  getAttributeByName(name) {
    return this.__getAttributeByName(this.attributes, name);
  }

  /**
   * Get attribute from attributes list corresponding to the given name.
   * Search in sub-attributes of "Object" attributes also.
   * @param {ComponentAttribute[]} attributes - Attributes list.
   * @param {string} name - Name of attribute to find.
   * @returns {ComponentAttribute|null} Component attribute or null.
   * @private
   */
  __getAttributeByName(attributes, name) {
    for (let index = 0; index < attributes.length; index += 1) { // NOSONAR
      if (attributes[index].name === name) {
        return attributes[index];
      }
      if (attributes[index].type === 'Object') {
        const attribute = this.__getAttributeByName(attributes[index].value, name);

        if (attribute) {
          return attribute;
        }
      }
    }

    return null;
  }

  /**
   * Get attributes corresponding to the given type.
   * @param {...string} types - Type of attribute to find.
   * @returns {ComponentAttribute[]} Component attributes array.
   */
  getAttributesByType(...types) {
    const result = [];

    this.__setAttributesByType(this.attributes, result, types);

    return result;
  }

  /**
   * Set attributes corresponding to the given type in the provided array.
   * Search in sub-attributes of "Object" attributes also.
   * @param {ComponentAttribute[]} attributes - Attributes list.
   * @param {ComponentAttribute[]} result - The array to store the found attributes.
   * @param {...string} types - One or more attribute types to search for.
   * @private
   */
  __setAttributesByType(attributes, result, types) {
    attributes.forEach((attribute) => {
      if (attribute?.type === 'Object') {
        this.__setAttributesByType(attribute.value, result, types);
      }

      if (types.includes(attribute?.definition.type)) {
        result.push(attribute);
      }
    });
  }

  /**
   * Retrieve container id from attributes.
   * @returns {string} Id of container or null.
   */
  getContainerId() {
    const attribute = this.attributes.find(({ definition }) => definition
      && definition.type === 'Reference');

    return !attribute ? null : attribute.getReferenceValue();
  }

  /**
   * Check if the component has an error.
   * @returns {boolean} - true if the component has an error otherwise false.
   */
  hasError() {
    return this.checkRequiredAttributes() || this.checkAttributesErrors();
  }

  /**
   * Check if a required attribute is absent.
   * @returns {boolean} - true if a required attribute is absent otherwise false.
   */
  checkRequiredAttributes() {
    return this.definition.definedAttributes
      .filter((defAttribute) => defAttribute.required)
      .some((defAttribute) => {
        const attribute = this.getAttributeByName(defAttribute.name);

        return !attribute
          || attribute.value === null
          || attribute.value === undefined
          || ((attribute.type === 'Array' || attribute.type === 'Object')
            && attribute.value.length === 0)
          || (attribute.type === 'String' && attribute.value.trim() === '');
      });
  }

  /**
   * Check if attributes has an error.
   * @returns {boolean} - true if attributes has an error otherwise false.
   */
  checkAttributesErrors() {
    return this.attributes.some((attribute) => (attribute.hasError()));
  }

  /**
   * Get defined attributes by type.
   * @param {string} type - Type of attributes to get.
   * @returns {ComponentAttributeDefinition[]} - Defined attributes.
   */
  getDefinedAttributesByType(type) {
    return this.definition.definedAttributes.filter((attribute) => attribute.type === type);
  }
}

export default Component;
