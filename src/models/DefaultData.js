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
   *
   * @param {object} props - All properties.
   * @param {string} props.name - Name of plugin.
   * @param {string} props.version - Version of plugin.
   * @param {Component[]} [props.components=[]] - Components array.
   * @param {object} [props.definitions={}] - All definitions.
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
     *
     * @type {string}
     */
    this.name = props.name || null;
    /**
     * Plugin version.
     *
     * @type {string}
     */
    this.version = props.version || null;
    /**
     * All plugin components.
     *
     * @type {Component[]}
     */
    this.components = props.components || [];
    /**
     * All plugin definitions.
     *
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
     *
     * @type {ParseError[]}
     */
    this.parseErrors = props.parseErrors || [];
  }

  /**
   * Get version of plugin core.
   *
   * @returns {string} Version of plugin core.
   */
  get coreVersion() {
    return CORE_VERSION;
  }

  /**
   * Get component by id.
   *
   * @param {string} id - Component id.
   * @returns {Component} Component or null.
   */
  getComponentById(id) {
    return this.components.find((component) => component.id === id) || null;
  }

  /**
   * Get all components corresponding to the given type.
   *
   * @param {string} type - Type of component to find.
   * @returns {Component[]} Component list.
   */
  getComponentsByType(type) {
    return this.components.filter(({ definition }) => definition && definition.type === type);
  }

  /**
   * Create new component.
   *
   * @param {string} id - Component id.
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
   *
   * @param {string} id - Component id.
   */
  removeComponentById(id) {
    this.getChildren(id).forEach((component) => this.removeComponentById(component.id));

    this.components = this.components.filter((component) => component.id !== id);

    this.components.forEach((component) => {
      component.removeLinkAttribute(id);
    });
  }

  /**
   * Remove link attribute in components.
   *
   * @param {ComponentLink} link - Link to remove.
   */
  removeLink(link) {
    const { source, target } = link;
    const { attributeRef } = link.definition;

    this.getComponentById(source).removeLinkAttribute(target, attributeRef);
  }

  /**
   * Get all links from all component attributes.
   *
   * @returns {ComponentLink[]} List of links.
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
      this.__setLinkDefinitions(type, definedAttributes);
    });
  }

  /**
   * Set link definition in link definitions
   *
   * @param {string} type - Component type to link.
   * @param {ComponentAttributeDefinition[]} definedAttributes - Component attribute definitions.
   * @private
   */
  __setLinkDefinitions(type, definedAttributes) {
    definedAttributes.forEach((attributeDefinition) => {
      if (attributeDefinition.type === 'Link') {
        const linkDefinition = new ComponentLinkDefinition({
          type: attributeDefinition.linkType,
          attributeRef: attributeDefinition.name,
          sourceRef: type,
          targetRef: attributeDefinition.linkRef,
          color: attributeDefinition.linkColor,
          width: attributeDefinition.linkWidth,
          dashStyle: attributeDefinition.linkDashStyle,
        });

        this.definitions.links.push(linkDefinition);
      } else if (attributeDefinition.type === 'Object') {
        this.__setLinkDefinitions(type, attributeDefinition.definedAttributes);
      }
    });
  }

  /**
   * Get children of container component with corresponding id.
   *
   * @param {string} id - Component container id.
   * @returns {Component[]} Children component array.
   */
  getChildren(id) {
    return this.components.filter((component) => component.getContainerId() === id);
  }
}

export default DefaultData;
