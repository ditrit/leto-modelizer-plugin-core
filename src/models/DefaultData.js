import { version as CORE_VERSION } from '../../package.json';
import Component from './Component';

/**
 * Class that represents all data of a Plugin.
 */
class DefaultData {
  /**
   * Default constructor.
   * @param {String} props.name - Name of plugin.
   * @param {String} props.version - Version of plugin.
   * @param {Component[]} [props.components=[]] - Components array.
   * @param {ComponentLink[]} [props.links=[]] - Links array.
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
    links: [],
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
     * All plugin links.
     * @type {ComponentLink[]}
     */
    this.links = props.links || [];
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
   * Remove component by id, all attributes that used this component id
   * and the links that refer to this component.
   * @param {String} id - Component id.
   * @return {Boolean} Indicate if component is removed or not.
   */
  removeComponentById(id) {
    const isRemoved = this.__removeComponentById(this.components, id);
    this.__removeRefAttributeById(this.components, id);
    this.links = this.links.filter(({ source, target }) => source !== id && target !== id);
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
}

export default DefaultData;
