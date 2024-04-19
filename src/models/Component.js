import ComponentAttribute from './ComponentAttribute';
import FileInformation from './FileInformation';
import ComponentDrawOption from './ComponentDrawOption';

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
    this.drawOption = drawOption || new ComponentDrawOption({
      width: definition.width,
      height: definition.height,
    });
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
   * Create all parents attributes from definitions.
   * @param {ComponentAttributeDefinition[]} definitions - All parents attributes order from
   * greatest to least depth.
   * @returns {ComponentAttribute[]} - Deeply created parent.
   * @private
   */
  __createNestedAttributes(definitions) {
    let currentAttributes = this.attributes;

    // TODO: Change `.slice().reverse()` when `toReversed` is available in Array.
    definitions.slice().reverse().forEach((parent) => {
      let attribute = currentAttributes.find(({ definition }) => definition.name === parent.name);

      if (attribute) {
        currentAttributes = attribute.value;
      } else {
        attribute = this.createAttribute({
          name: parent.name,
          definition: parent,
          type: 'Object',
          value: [],
        });
        currentAttributes.push(attribute);
        currentAttributes = attribute.value;
      }
    });

    return currentAttributes;
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
    const parents = [];
    const attributeDefinition = this.__getLinkAttribute(
      parents,
      this.definition.definedAttributes,
      link,
    );
    const currentAttributes = this.__createNestedAttributes(parents);

    let attribute = currentAttributes
      .find(({ definition }) => definition.name === attributeDefinition.name);

    if (!attribute) {
      attribute = this.createAttribute({
        name: attributeDefinition.name,
        definition: attributeDefinition,
        type: 'Array',
        value: [],
      });
      currentAttributes.push(attribute);
    }

    attribute.addLink(link.target);
  }

  /**
   * Retrieve attribute definition of the wanted link from attributes and set all parents
   * definitions of the link attributes.
   * @param {ComponentAttributeDefinition[]} parents -  Parents to set.
   * @param {ComponentAttributeDefinition[]} attributes - Attributes to search attribute link.
   * @param {ComponentLink} link - Component link
   * @returns {ComponentAttributeDefinition} Component attribute definition of the link.
   * @private
   */
  __getLinkAttribute(parents, attributes, link) {
    for (let index = 0; index < attributes.length; index += 1) { // NOSONAR
      if (attributes[index].type === 'Object') {
        const result = this.__getLinkAttribute(parents, attributes[index].definedAttributes, link);

        if (result) {
          parents.push(attributes[index]);

          return result;
        }
      }

      if (attributes[index].type === 'Link'
        && attributes[index].name === link.definition.attributeRef) {
        return attributes[index];
      }
    }

    return null;
  }

  /**
   * Remove id in link attribute corresponding to the given name if provided
   * otherwise remove id in all link attributes' value.
   * Then if value is empty remove attribute.
   * @param {string} id - Id to remove.
   * @param {string} [name] - Name of attribute to remove.
   */
  removeLinkAttribute(id, name = null) {
    this.__removeLinkAttribute(this.attributes, id, name);
  }

  /**
   * Remove all attributes related to the specified link.
   * @param {ComponentAttribute[]} attributes - Attributes to find attribute link and delete link
   * reference.
   * @param {string} id - Id of the target link.
   * @param {string} name - Attribute name that stores link ids.
   * @private
   */
  __removeLinkAttribute(attributes, id, name) {
    attributes.forEach((attribute) => {
      if (attribute.type === 'Object') {
        this.__removeLinkAttribute(attribute.value, id, name);
      }

      if (attribute.definition?.type === 'Link' && (!name || attribute.name === name)) {
        attribute.removeLink(id);
      }
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
   * Set attributes corresponding to the given attribute field in the provided array.
   * Set in sub-attributes of "Object" attributes too.
   * @param {ComponentAttribute[]} result - The array to store the found attributes.
   * @param {ComponentAttribute[]} attributes - Attributes list.
   * @param {string} field - Attribute field to check.
   * @param {...string} values - Field values to compare.
   * @private
   */
  __setAttributesByField(result, attributes, field, ...values) {
    attributes.forEach((attribute) => {
      if (attribute?.type === 'Object') {
        this.__setAttributesByField(result, attribute.value, field, ...values);
      }

      if (this.__compareAttributeField(attribute, field, ...values)) {
        result.push(attribute);
      }
    });
  }

  /**
   * Compare attribute field to given value and indicate if the value contains that attribute
   * or not.
   * @param {ComponentAttribute} attribute - Attribute to check.
   * @param {string} field - Name of attribute field.
   * @param {...string} values - Valid field value to search in attribute field.
   * @returns {boolean} True if the value of the field is contained in the provided values.
   * @private
   */
  __compareAttributeField(attribute, field, ...values) {
    if (field === 'definitionType') {
      return values.includes(attribute.definition?.type);
    }

    return values.includes(attribute[field]);
  }

  /**
   * Get attributes corresponding to the given type.
   * @param {...string} types - Type of attribute to find.
   * @returns {ComponentAttribute[]} Component attributes array.
   */
  getAttributesByType(...types) {
    const result = [];

    this.__setAttributesByField(result, this.attributes, 'type', ...types);

    return result;
  }

  /**
   * Get attributes corresponding to the given definition type.
   * @param {...string} types - Type of attribute to find.
   * @returns {ComponentAttribute[]} Component attributes array.
   */
  getAttributesByDefinitionType(...types) {
    const result = [];

    this.__setAttributesByField(result, this.attributes, 'definitionType', ...types);

    return result;
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
    const result = [];

    this.__setDefinedAttributesByType(result, this.definition.definedAttributes, type);

    return result;
  }

  /**
   * Set all wanted definition attributes in the provided array.
   * @param {ComponentAttributeDefinition[]} result - Wanted definition attributes.
   * @param {ComponentAttributeDefinition[]} attributes - Definition attributes to check.
   * @param {string} type - Type to compare.
   * @private
   */
  __setDefinedAttributesByType(result, attributes, type) {
    attributes.forEach((attribute) => {
      if (attribute.type === 'Object') {
        this.__setDefinedAttributesByType(result, attribute.definedAttributes, type);
      }

      if (attribute.type === type) {
        result.push(attribute);
      }
    });
  }

  canContain(type) {
    if (!this.definition.isContainer) {
      return false;
    }

    return this.definition.childrenTypes.includes(type);
  }
}

export default Component;
