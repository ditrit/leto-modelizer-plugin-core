import packageInfo from '../../package.json';
import Component from './Component';
import ComponentLink from './ComponentLink';
import ComponentLinkDefinition from './ComponentLinkDefinition';
import EventLog from './EventLog';

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
   * @param {string} [props.defaultFileName] - Default file name for new components.
   * @param {object} [event] - Event manager.
   * @param {Function} [event.next] - Function to emit event.
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
    defaultFileName: null,
  }, event = null) {
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
    /**
     * Default file name for new components.
     *
     * @type {string}
     */
    this.defaultFileName = props.defaultFileName || null;
    /**
     * Index of the last event log.
     *
     * @type {number}
     * @private
     */
    this.__eventIndex = 0;
    /**
     * Event manager.
     *
     * @type {object}
     */
    this.eventManager = event;
    /**
     * All plugin event logs.
     *
     * @type {EventLog[]}
     */
    this.eventLogs = [];
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
   * @param {ComponentDefinition} definition - Component definition.
   * @param {string} [folder=''] - Folder path.
   * @param {string} [fileName] - File name.
   * @returns {string} Component id.
   */
  addComponent(definition, folder = '', fileName = this.defaultFileName || '') {
    const id = this.generateComponentId(definition);

    this.components.push(new Component({
      id,
      name: id,
      definition,
      path: `${folder}${fileName}`,
    }));

    return id;
  }

  /**
   * Generate id from definition and components list.
   *
   * @param {ComponentDefinition} definition - Component definition.
   * @returns {string} String that is the concatenation of the definition type and an index.
   */
  generateComponentId(definition) {
    const templateId = `${definition.type}_`;
    const ids = this.components
      .map(({ id }) => id)
      .filter((id) => new RegExp(`${templateId}\\d+`).test(id))
      .map((id) => parseInt(id.substring(templateId.length), 10));
    let index = 1;

    while (ids.includes(index)) {
      index += 1;
    }

    return `${templateId}${index}`;
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

    return links.concat(this.getWorkflowLinks());
  }

  /**
   * Build internal links for workflow containers.
   *
   * @returns {ComponentLink[]} List of links
   */
  getWorkflowLinks() {
    return this.components.filter(({ definition }) => definition.displayType?.match('workflow'))
      .reduce((links, component) => {
        const children = this.getChildren(component.id);

        if (children.length > 1) {
          for (let childIndex = 0; childIndex < children.length - 1; childIndex += 1) {
            links.push(new ComponentLink({
              definition: new ComponentLinkDefinition({
                sourceRef: '__workflow',
                attributeRef: '__next',
              }),
              source: children[childIndex].id,
              target: children[childIndex + 1].id,
            }));
          }
        }

        return links;
      }, []);
  }

  /**
   * Uniquely get the definitions used for existing links.
   *
   * @returns {ComponentLinkDefinition[]} - List of link definitions.
   */
  getUsedLinkDefinitions() {
    return this.getLinks()
      .map((link) => link.definition)
      .reduce((acc, definition) => {
        if (!acc.some((used) => (
          used.attributeRef === definition.attributeRef
          && used.sourceRef === definition.sourceRef
          && used.targetRef === definition.targetRef
        ))) {
          acc.push(definition);
        }

        return acc;
      }, []);
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

  /**
   * Move a component to a new position in the internal component list.
   *
   * @param {string} componentId - The component's id.
   * @param {number} newIndex - The new index.
   * @private
   */
  __moveComponentToIndex(componentId, newIndex) {
    const currentIndex = this.components
      .findIndex((cmp) => cmp.id === componentId);

    if (currentIndex === newIndex) {
      return;
    }
    const component = this.getComponentById(componentId);
    let adjustedIndex = Math.max(0, newIndex);

    adjustedIndex += adjustedIndex > currentIndex;
    this.components.splice(adjustedIndex, 0, component);
    this.components.splice(currentIndex + (adjustedIndex < currentIndex), 1);
  }

  /**
   * Insert the moved component before the target in the internal component list
   *
   * @param {string} movedId - The id of the component to move
   * @param {string} targetId - The id of the component that will be immediately
   * after the moved component
   */
  insertComponentBefore(movedId, targetId) {
    const targetIndex = this.components.findIndex((component) => component.id === targetId);

    if (targetIndex === -1) {
      return;
    }
    this.__moveComponentToIndex(
      movedId,
      Math.max(0, targetIndex - 1),
    );
  }

  /**
   * Insert the moved component after the target in the internal component list
   *
   * @param {string} movedId - The id of the component to move
   * @param {string} targetId - The id of the component that will be immediately
   * before the moved component
   */
  insertComponentAfter(movedId, targetId) {
    const movedIndex = this.components.findIndex((component) => component.id === movedId);
    const targetIndex = this.components.findIndex((component) => component.id === targetId);

    if (targetIndex === -1) {
      return;
    }
    this.__moveComponentToIndex(
      movedId,
      Math.min(this.components.length - 1, targetIndex + (targetIndex < movedIndex)),
    );
  }

  /**
   * Get event log by id.
   *
   * @param {number} id - Event log id.
   * @returns {EventLog} Event log or undefined.
   */
  getEventLogById(id) {
    return this.eventLogs.findLast((eventLog) => id === eventLog.id);
  }

  /**
   * Delete all event logs before the specified datetime.
   *
   * @param {number} date - Date time as timestamp.
   */
  deleteAllEventLogsBefore(date) {
    this.eventLogs = this.eventLogs.filter(({ endDate }) => endDate > date);
  }

  /**
   * Emit event with log.
   *
   * @param {object} props - EventLog information.
   * @returns {number} EventLog id.
   * @see EventLog
   */
  emitEvent(props = {}) {
    let { id } = props;
    let eventLog;

    if (!id) {
      this.__eventIndex += 1;

      id = this.__eventIndex;
      eventLog = new EventLog({ ...props, id });
      eventLog.startDate = Date.now();

      this.eventLogs.push(eventLog);
    } else {
      eventLog = this.getEventLogById(id);

      Object.keys(props).forEach((key) => {
        eventLog[key] = props[key];
      });
    }

    if (['success', 'warning', 'error'].includes(eventLog.status)) {
      eventLog.endDate = Date.now();
    }

    if (this.eventManager?.next) {
      this.eventManager.next({
        plugin: this.name,
        event: { ...eventLog },
      });
    }

    return id;
  }
}

export default DefaultData;
