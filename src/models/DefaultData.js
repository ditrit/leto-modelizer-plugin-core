import packageInfo from '../../package.json';
import Component from './Component';
import ComponentLink from './ComponentLink';
import ComponentLinkDefinition from './ComponentLinkDefinition';

const CORE_VERSION = packageInfo.version;

/**
 * Class that represents all data of a Plugin.
 */
class DefaultData {
  /**
   * Default constructor.
   * @param {String} props.name - Name of plugin.
   * @param {String} props.version - Version of plugin.
   * @param {Component[]} [props.components=[]] - Components array.
   * @param {Object} [props.definitions={}] - All definitions.
   * @param {ComponentDefinition[]} [props.definitions.components=[]] - All component definitions.
   * @param {ComponentLinkDefinition[]} [props.definitions.link=[]] - All component link
   * definitions.
   * @param {ParseError[]} [props.parseErrors=[]] - Parse errors array.
   */
  constructor(props = {
    name: null,
    version: null,
    components: [],
    definitions: {
      components: [],
      links: [],
    },
    parseErrors: [],
  }) {
    /**
     * Plugin name.
     * @type {String}
     */
    this.name = props.name || null;
    /**
     * Plugin version.
     * @type {String}
     */
    this.version = props.version || null;
    /**
     * All plugin components.
     * @type {Component[]}
     */
    this.components = props.components || [];
    /**
     * All plugin definitions.
     * @type {{components: ComponentDefinition[], links: ComponentLinkDefinition[]}}
     */
    this.definitions = {
      components: [],
      links: [],
    };
    if (props.definitions) {
      this.definitions.components = props.definitions.components || [];
      this.definitions.links = props.definitions.links || [];
    }
    /**
     * All parser errors.
     * @type {ParseError[]}
     */
    this.parseErrors = props.parseErrors || [];
  }

  /**
   * Get version of plugin core.
   * @returns {String} Version of plugin core.
   */
  get coreVersion() {
    return CORE_VERSION;
  }

  /**
   * Get component by id.
   * @param {String} id - Component id.
   * @return {Component} Component or null.
   */
  getComponentById(id) {
    return this.__getComponentById(this.components, id);
  }

  /**
   * Get component by id.
   * If components is not present in the provided components, look on their children.
   * @param {Component[]} components - Components to search the id.
   * @param {String} id - Id to search.
   * @return {Component|null} Return searched component or null.
   * @private
   */
  __getComponentById(components, id) {
    // Remove sonar code smell, because its more optimized with a for loop.
    for (let index = 0; index < components.length; index += 1) { // NOSONAR
      if (components[index].id === id) {
        return components[index];
      }
      const component = this.__getComponentById(components[index].children, id);

      if (component) {
        return component;
      }
    }

    return null;
  }

  /**
   * Get all components by type
   * @param {String} type - Type of component to find.
   * @returns {Component[]} Component list.
   */
  getComponentsByType(type) {
    const components = [];

    this.__setComponentsByType(components, this.components, type);

    return components;
  }

  /**
   * Set all components of provided type in the provided array.
   * @param {Component[]} result - Component array to set.
   * @param {Component[]} components - Array to find components.
   * @param {String} type - Component type to search.
   * @private
   */
  __setComponentsByType(result, components, type) {
    // Remove sonar code smell, because its more optimized with a for loop.
    for (let index = 0; index < components.length; index += 1) { // NOSONAR
      if (components[index].definition.type === type) {
        result.push(components[index]);
      }
      this.__setComponentsByType(result, components[index].children, type);
    }
  }

  /**
   * Create new component.
   * @param {String} id - Component id.
   * @param {ComponentDefinition} definition - Component definition.
   */
  addComponent(id, definition) {
    this.components.push(new Component({
      id,
      name: id,
      definition,
    }));
  }

  /**
   * Remove component by id and all attributes that used this component id.
   * @param {String} id - Component id.
   * @return {Boolean} Indicate if component is removed or not.
   */
  removeComponentById(id) {
    const isRemoved = this.__removeComponentById(this.components, id);

    this.__removeRefAttributeById(this.components, id);

    return isRemoved;
  }

  /**
   * Remove components by id.
   * If not present in the provided components, look on their children.
   * @param {Component[]} components - Components to search the id.
   * @param {String} id - Id to remove.
   * @return {Boolean} Indicate if the component is removed.
   * @private
   */
  __removeComponentById(components, id) {
    // Remove sonar code smell, because its more optimized with a for loop.
    for (let index = 0; index < components.length; index += 1) { // NOSONAR
      if (components[index].id === id) {
        components.splice(index, 1);

        return true;
      }
      if (this.__removeComponentById(components[index].children, id)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Remove id in all attributes' value then if value is empty remove attribute.
   * @param {Component[]} components - Components to search the id.
   * @param {String} id - Id to remove.
   * @private
   */
  __removeRefAttributeById(components, id) {
    components.forEach((component) => {
      if (component.children.length > 0) {
        this.__removeRefAttributeById(component.children, id);
      }

      component.removeLinkAttributeById(id);
    });
  }

  /**
   * Get all links from all component attributes.
   * @returns {ComponentLink[]}
   */
  getLinks() {
    const links = [];

    this.definitions.links.forEach((definition) => {
      const components = this.getComponentsByType(definition.sourceRef);

      components.forEach((component) => {
        const attribute = component.getAttributeByName(definition.attributeRef);

        if (!attribute) {
          return;
        }

        attribute.value.forEach((value) => links.push(new ComponentLink({
          definition,
          source: component.id,
          target: value,
        })));
      });
    });

    return links;
  }

  /**
   * Initialize all link definitions from all component attribute definitions.
   */
  initLinkDefinitions() {
    this.definitions.links = [];
    this.definitions.components.forEach(({ type, definedAttributes }) => {
      this.__setLinksDefinition(type, definedAttributes);
    });
  }

  /**
   * Set link definition in link definitions
   * @param {String} type - Source ref.
   * @param {ComponentAttributeDefinition} definedAttributes - Component attribute definitions.
   * @private
   */
  __setLinksDefinition(type, definedAttributes) {
    console.log('plugin-core', definedAttributes);
    if (!definedAttributes) {
      return;
    }

    definedAttributes.forEach((attributeDefinition) => {
      if (attributeDefinition.type === 'Link') {
        const linkDefinition = new ComponentLinkDefinition({ type: attributeDefinition.linkType });

        if (attributeDefinition.linkType === 'Reverse') {
          linkDefinition.sourceRef = attributeDefinition.linkRef;
          linkDefinition.targetRef = type;
        } else {
          linkDefinition.sourceRef = type;
          linkDefinition.targetRef = attributeDefinition.linkRef;
        }

        linkDefinition.attributeRef = attributeDefinition.name;

        this.definitions.links.push(linkDefinition);
      } else if (attributeDefinition.type === 'Object') {
        this.__setLinksDefinition(type, attributeDefinition.definedAttributes);
      }
    });
  }
}

export default DefaultData;
