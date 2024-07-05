import packageInfo from '../../package.json';
import Component from './Component';
import ComponentLink from './ComponentLink';
import ComponentLinkDefinition from './ComponentLinkDefinition';
import EventLog from './EventLog';
import ComponentTemporaryLink from './ComponentTemporaryLink';

const CORE_VERSION = packageInfo.version;

/**
 * Class that represents all data of a Plugin.
 */
class DefaultData {
  /**
   * Default constructor.
   * @param {DefaultConfiguration} pluginConfiguration - Plugin configuration storage.
   * @param {object} props - All properties.
   * @param {string} props.name - Name of plugin.
   * @param {string} props.version - Version of plugin.
   * @param {Component[]} [props.components] - Components array.
   * @param {Variable[]} [props.variables] - Variables array.
   * @param {object} [props.definitions] - All definitions.
   * @param {ComponentDefinition[]} [props.definitions.components] - All component definitions.
   * @param {ComponentLinkDefinition[]} [props.definitions.link] - All component link
   * definitions.
   * @param {ParseError[]} [props.parseErrors] - Parse errors array.
   * @param {object} [props.resources] - All svg models.
   * @param {object} [props.resources.icons] - All svg models' icons
   * @param {object} [props.resources.markers] - All svg models' markers.
   * @param {object} [props.resources.links] - All svg models' links.
   * @param {object} [props.resources.models] - All svg models' components.
   * @param {string} [props.resources.style] - All specific style.
   * @param {object} [props.scene] -All scene data, position, zoom factor, current selection and
   * selected container type.
   * @param {number} [props.scene.x] - Translation x of the scene.
   * @param {number} [props.scene.y] - Translation y of the scene.
   * @param {number} [props.scene.zoom] - Zoom factor of the scene.
   * @param {string[]} [props.scene.selection] - List of ids of selected components.
   * @param {string} [props.scene.selectionRef] - Type on container selection. If null it refers to
   * root container.
   * @param {object} [event] - Event manager.
   * @param {Function} [event.next] - Function to emit event.
   */
  constructor(pluginConfiguration, props = {
    name: null,
    version: null,
    components: [],
    variables: [],
    definitions: {
      components: [],
      links: [],
    },
    parseErrors: [],
    resources: {},
    scene: {
      x: 0,
      y: 0,
      zoom: 1,
      selection: [],
      selectionRef: null,
    },
  }, event = null) {
    /**
     * Plugin name.
     * @type {string}
     */
    this.name = props.name || null;
    /**
     * Plugin version.
     * @type {string}
     */
    this.version = props.version || null;
    /**
     * All plugin components.
     * @type {Component[]}
     * @default []
     */
    this.components = props.components || [];

    /**
     * All scene data, position, zoom factor, current selection and selected container type.
     * @type {object}
     */
    this.scene = {
      x: props.scene?.x || 0,
      y: props.scene?.y || 0,
      zoom: props.scene?.zoom || 1,
      selection: props.scene?.selection || [],
      selectionRef: props.scene?.selectionRef || null,
    };

    /**
     * All plugin variables.
     * @type {Variable[]}
     */
    this.variables = props.variables || [];
    /**
     * All plugin definitions.
     * @type {{components: ComponentDefinition[], links: ComponentLinkDefinition[]}}
     */
    this.definitions = {
      components: props.definitions?.components || [],
      links: props.definitions?.links || [],
    };

    /**
     * All parser errors.
     * @type {ParseError[]}
     * @default []
     */
    this.parseErrors = props.parseErrors || [];
    /**
     * Index of the last event log.
     * @type {number}
     * @default 0
     * @private
     */
    this.__eventIndex = 0;
    /**
     * Event manager.
     * @type {object}
     */
    this.eventManager = event;
    /**
     * All plugin event logs.
     * @type {EventLog[]}
     */
    this.eventLogs = [];
    /**
     * Plugin configuration storage.
     * @type {DefaultConfiguration}
     */
    this.configuration = pluginConfiguration;

    /**
     * Object that contains resources.
     * @type {object}
     * @default null
     */
    this.resources = {
      icons: { ...props.resources?.icons },
      markers: { ...props.resources?.markers },
      links: { ...props.resources?.links },
      models: { ...props.resources?.models },
      style: props.resources?.style || '',
    };
    /**
     * Current temporary link.
     * @type {ComponentTemporaryLink}
     */
    this.temporaryLink = null;
  }

  /**
   * Get version of plugin core.
   * @returns {string} Version of plugin core.
   */
  get coreVersion() {
    return CORE_VERSION;
  }

  /**
   * Get component by id.
   * @param {string} id - Component id.
   * @returns {Component} Component or null.
   */
  getComponentById(id) {
    return this.components.find((component) => component.id === id) || null;
  }

  /**
   * Recursively calculates the depth of a component within a hierarchical structure, starting at 0.
   * The depth of a component is defined as the number of levels it is nested within other
   * components.
   * A top-level component has a depth of 0. For each level of nesting, the depth increases by 1.
   * @param {string} id - Component id.
   * @returns {number} Component depth.
   */
  getComponentDepth(id) {
    const component = this.getComponentById(id);
    const containerId = component.getContainerId();

    if (!containerId) {
      return 0;
    }

    return this.getComponentDepth(containerId) + 1;
  }

  /**
   * Get component by configuration any kind of key.
   * The configuration file is using a certain type of key for the components, this key is
   * used to define their position. So in order to retrieve the component's position from the
   * configuration file, we need to know which kind of key is used.
   * By default, if not overriden by plugin, it has the same behavior as getComponentById.
   * @param {string} key - Key to use for finding the component. By default the key is the id.
   * @returns {Component} Component or null.
   */
  getComponentByConfigurationKey(key) {
    return this.getComponentById(key);
  }

  /**
   * Rename a component external ID.
   * @param {string} id - ID of component.
   * @param {string} newExternalId - New external ID of component.
   */
  renameComponentExternalId(id, newExternalId) {
    this.getComponentById(id).setExternalId(newExternalId);
  }

  /**
   * Get all components corresponding to the given type.
   * @param {string} type - Type of component to find.
   * @returns {Component[]} Component list.
   */
  getComponentsByType(type) {
    return this.components.filter(({ definition }) => definition && definition.type === type);
  }

  /**
   * Create and add new component inside components list.
   * @param {ComponentDefinition} definition - Component definition.
   * @param {string} path - Component path.
   * @returns {string} Component id.
   */
  addComponent(definition, path) {
    const id = this.generateComponentId();

    this.components.push(new Component({
      id,
      name: id,
      definition,
      path,
    }));

    return id;
  }

  /**
   * Generate id from definition and components list.
   * The id is composed of "id_" and the number of component plus 1.
   * @returns {string} Unique string for the id.
   */
  generateComponentId() {
    // the id will be used as HTML id and a number can't be used as id
    // so we are adding the templateId in order to have ids like 'id_X'
    const templateId = 'id_';
    const ids = this.components
      .map(({ id }) => id)
      .filter((id) => new RegExp(`${templateId}\\d+`).test(id))
      .map((id) => parseInt(id.substring(templateId.length), 10));

    const index = ids.length === 0 ? 1 : Math.max(...ids) + 1;

    return `${templateId}${index}`;
  }

  /**
   * Remove component by id and all attributes that used this component id.
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
   * @param {ComponentLink} link - Link to remove.
   */
  removeLink(link) {
    const { source, target } = link;
    const { attributeRef } = link.definition;

    this.getComponentById(source).removeLinkAttribute(target, attributeRef);
  }

  /**
   * Get all links from all component attributes.
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

        this.getLinkedComponentsIds(attribute).forEach((value) => links.push(new ComponentLink({
          definition,
          source: component.id,
          target: value,
          isReverse: attribute.definition.linkType === 'Reverse',
        })));
      });
    });

    if (this.temporaryLink) {
      links.push(this.temporaryLink);
    }

    return links.concat(this.getWorkflowLinks());
  }

  /**
   * Get the value of an attribute.
   * @param {ComponentAttribute} attribute - Attribute to get value.
   * @returns {string | string[]} Value of attribute.
   */
  getAttributeValue(attribute) {
    if (attribute.isVariable) {
      return this.getVariableValue(attribute.value);
    }

    return attribute.value;
  }

  /**
   * Get the ID of the linked component.
   * @param {ComponentAttribute} attribute - Link to get value.
   * @returns {string[]} ID of the linked component.
   */
  getLinkedComponentsIds(attribute) {
    const value = this.getAttributeValue(attribute);

    if (value === null) {
      return [];
    }

    return Array.isArray(value) ? value : [value];
  }

  /**
   * Get the value of a variable.
   * @param {string} name - Name of the variable.
   * @returns {string | string[]} Value of the variable.
   */
  getVariableValue(name) {
    return this.variables.find((variable) => variable.name === name)?.value || null;
  }

  /**
   * Set the value of a variable.
   * @param {string} name - Name of the variable.
   * @param {string} value - New value of the variable.
   */
  setVariableValue(name, value) {
    const variable = this.variables.find((v) => v.name === name);

    if (variable) {
      variable.value = value;
    }
  }

  /**
   * Get the ID of a linked resource.
   * @param {string} value - Value of the link.
   * @returns {string} ID of the linked resource.
   */
  getComponentIdFromValue(value) {
    return value;
  }

  /**
   * Indicate if type can have a link.
   * @param {string} type - Component type.
   * @returns {boolean} True if component can have link otherwise false.
   */
  canHaveLink(type) {
    return this.definitions.links.some(({ sourceRef }) => sourceRef === type);
  }

  /**
   * Indicate if type can be linked with another.
   * @param {string} source - Source type.
   * @param {string} target - Target type.
   * @returns {boolean} True if type can be linked to another otherwise false.
   */
  canBeLinked(source, target) {
    return this.definitions.links
      .some(({ sourceRef, targetRef }) => sourceRef === source && targetRef === target);
  }

  /**
   * Create temporary link.
   * @param {string} source - Id of component can be the source in a link.
   * @param {string} anchorName - Anchor name of the component.
   */
  createTemporaryLink(source, anchorName) {
    this.temporaryLink = new ComponentTemporaryLink({
      anchorName,
      source,
      definition: this.definitions.links.find(({ isTemporary }) => isTemporary),
    });
  }

  /**
   * Build internal links for workflow containers.
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
                model: component.definition.linkModel,
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
   * @param {string} [parentEventId] - Parent event id.
   */
  initLinkDefinitions(parentEventId) {
    const id = this.emitEvent({
      parent: parentEventId,
      type: 'Data',
      action: 'init',
      status: 'running',
    });

    this.definitions.links = [];
    this.definitions.components.forEach(({ type, definedAttributes }) => {
      this.__setLinkDefinitions(type, definedAttributes);
    });

    this.definitions.links.push(new ComponentLinkDefinition({
      isTemporary: true,
      model: 'temporaryLink',
    }));

    this.emitEvent({ id, status: 'success' });
  }

  /**
   * Set link definition in link definitions
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
          model: attributeDefinition.linkModel,
        });

        this.definitions.links.push(linkDefinition);
      } else if (attributeDefinition.type === 'Object') {
        this.__setLinkDefinitions(type, attributeDefinition.definedAttributes);
      }
    });
  }

  /**
   * Get children of container component with corresponding id.
   * @param {string} id - Component container id.
   * @returns {Component[]} Children component array.
   */
  getChildren(id) {
    return this.components.filter((component) => component.getContainerId() === id);
  }

  /**
   * Move a component to a new position in the internal component list.
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
   * @param {number} id - Event log id.
   * @returns {EventLog} Event log or undefined.
   */
  getEventLogById(id) {
    return this.eventLogs.findLast((eventLog) => id === eventLog.id);
  }

  /**
   * Delete all event logs before the specified datetime.
   * @param {number} date - Date time as timestamp.
   */
  deleteAllEventLogsBefore(date) {
    this.eventLogs = this.eventLogs.filter(({ endDate }) => endDate > date);
  }

  /**
   * Emit event with log.
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
