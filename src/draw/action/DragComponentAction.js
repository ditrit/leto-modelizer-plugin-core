import Action from './Action';

/**
 * Action to drag component.
 */
class DragComponentAction extends Action {
  /**
   * Default constructor.
   * @param {DefaultData} pluginData - Plugin data storage.
   * @param {object} viewport - D3 selection of the view port.
   * @param {DefaultLayout} layout - Layout to organise components.
   */
  constructor(pluginData, viewport, layout) {
    super(pluginData, viewport, layout);

    /**
     * Whether the action is initialized or not.
     * @type {boolean}
     */
    this.isInit = false;
  }

  /**
   * Update position of sources element.
   * @param {object} event - The event containing the target information.
   * @returns {boolean} No need to redraw because, element is directly updated.
   */
  execute(event) {
    const sources = this.getSourcesId(event);

    if (!this.isInit) {
      this.isInit = true;

      const parentTypes = this.getParentTypes(sources);

      this.pluginData.components
        .filter(({ id, definition }) => !parentTypes.includes(definition.type)
          && !sources.includes(id))
        .forEach((component) => {
          this.viewport.select(`.${component.id}.component .canBeHidden`)
            .classed('hide', true);
        });
    }

    sources.forEach((id) => {
      const model = this.viewport.select(`.${id} .model`);

      model
        .attr('x', (parseFloat(model.attr('x')) || 0) + (event.dx / this.pluginData.scene.zoom))
        .attr('y', (parseFloat(model.attr('y')) || 0) + (event.dy / this.pluginData.scene.zoom));
    });

    return false;
  }

  /**
   * Update component position and update parent of component if needed.
   * @param {object} event - The event containing the target information.
   * @returns {boolean} Need to call draw at the end.
   */
  finalize(event) {
    this.isInit = false;

    const sourcesId = this.getSourcesId(event);
    const targetId = this.getTargetsId(event)[0] || null;
    const sources = sourcesId.map((id) => this.pluginData.getComponentById(id));

    if (targetId === null) {
      this.dropOnScene(event, sources);

      return true;
    }

    return this.dropOnTarget(event, sources, this.pluginData.getComponentById(targetId));
  }

  /**
   * Drop components on scene, remove referenced parent attribute.
   * @param {object} event - The event containing the target information.
   * @param {Component[]} sources - Sources to drop.
   * @returns {boolean} Need to redraw only if sources have container.
   */
  dropOnScene(event, sources) {
    const containerId = sources[0].getContainerId();
    const hasContainer = containerId !== null;
    const container = this.pluginData.getComponentById(containerId);
    let action;

    sources.forEach((source) => {
      const {
        x: sourceX,
        y: sourceY,
      } = this.getSourcePosition(source.id);

      if (hasContainer) {
        source.removeAllReferenceAttributes(container);

        const { dx, dy } = this.getTransform(
          `.${containerId} .components-background`,
          '.scene',
        );

        source.drawOption.x = sourceX + (dx - this.pluginData.scene.x) / this.pluginData.scene.zoom;
        source.drawOption.y = sourceY + (dy - this.pluginData.scene.y) / this.pluginData.scene.zoom;

        action = 'update';
      } else {
        source.drawOption.x = sourceX;
        source.drawOption.y = sourceY;
        action = 'move';
      }
    });

    if (container && container.definition.displayType === 'workflow') {
      this.layout.generateComponentsLayout(containerId);
    }

    this.pluginData.emitEvent({
      components: sources.map(({ id }) => id),
      type: 'Drawer',
      action,
      status: 'success',
    });

    return hasContainer;
  }

  /**
   * Drop components into container.
   * @param {object} event - The event containing the target information.
   * @param {Component[]} sources - Sources to drop.
   * @param {Component} target - Target container.
   * @returns {boolean} Redraw only if source can be dropped on target.
   */
  dropOnTarget(event, sources, target) {
    if (!sources.every((source) => target.canContain(source.definition.type))) {
      sources.forEach((source) => {
        const model = this.viewport.select(`.${source.id} .model`);

        model
          .attr('x', parseFloat(model.attr('x')) + (event.dx / this.pluginData.scene.zoom))
          .attr('y', parseFloat(model.attr('y')) + (event.dy / this.pluginData.scene.zoom));
      });

      return false;
    }

    if (target.definition.displayType === 'workflow') {
      return this.dropInWorkflow(event, sources, target);
    }

    const isChangingContainer = sources[0].getContainerId() !== target.id;

    sources.forEach((source) => {
      if (isChangingContainer) {
        source.setReferenceAttribute(target);
      }

      const { dx, dy } = this.getTransform(
        `.${source.id} .background`,
        `.${target.id} .components-background`,
      );

      source.drawOption.x = dx < 1 ? 1 : dx / this.pluginData.scene.zoom;
      source.drawOption.y = dy < 1 ? 1 : dy / this.pluginData.scene.zoom;
    });

    this.pluginData.emitEvent({
      components: sources.map(({ id }) => id),
      type: 'Drawer',
      action: isChangingContainer ? 'update' : 'move',
      status: 'success',
    });

    return true;
  }

  /**
   * Drop component into workflow container.
   * @param {object} event - The event containing the target information.
   * @param {Component[]} sources - Sources to drop.
   * @param {Component} target - Target container.
   * @returns {boolean} Need to call draw at the end.
   */
  dropInWorkflow(event, sources, target) {
    const oldContainerId = sources[0].getContainerId();
    const container = this.pluginData.getComponentById(target.id);
    const children = this.pluginData.getChildren(target.id);
    const isVertical = target.definition.workflowDirection === 'vertical';
    const sourceIds = this.pluginData.components
      .filter(({ id }) => sources.some(({ id: sourceId }) => id === sourceId))
      .map(({ id }) => id);
    let nextId;

    children
      .filter(({ id }) => !sourceIds.includes(id))
      .forEach((child) => {
        const {
          x: childX,
          y: childY,
          width,
          height,
        } = this.viewport.select(`.${child.id} .model`).node().getBoundingClientRect();

        if (isVertical && childY + (height / 2) < event.sourceEvent.clientY) {
          nextId = child.id;
        }

        if (!isVertical && childX + (width / 2) < event.sourceEvent.clientX) {
          nextId = child.id;
        }
      });

    sourceIds.forEach((sourceId) => {
      const source = this.pluginData.getComponentById(sourceId);

      source.setReferenceAttribute(container);

      if (!nextId) {
        nextId = this.pluginData.components
          .find((component) => component.getContainerId() === target.id).id;

        if (sourceId !== nextId) {
          this.pluginData.insertComponentBefore(sourceId, nextId);
        }
      } else {
        this.pluginData.insertComponentAfter(sourceId, nextId);
      }
      nextId = sourceId;
    });

    if (oldContainerId !== target.id && oldContainerId) {
      this.layout.generateComponentsLayout(oldContainerId, false);
    }

    this.layout.generateComponentsLayout(target.id, false);

    this.pluginData.emitEvent({
      components: sourceIds,
      type: 'Drawer',
      action: 'update',
      status: 'success',
    });

    return true;
  }

  /**
   * Get all parent types that the sources have in common.
   * @param {string[]} sources - Component ids list.
   * @returns {string[]} Parent types list.
   */
  getParentTypes(sources) {
    const map = new Map();

    sources.map((id) => this.pluginData.getComponentById(id))
      .forEach(({ id, definition }) => {
        definition.parentTypes.forEach((type) => {
          if (!map.has(type)) {
            map.set(type, []);
          }

          map.get(type).push(id);
        });
      });

    const types = [];

    map.forEach((ids, type) => {
      if (ids.length === sources.length) {
        types.push(type);
      }
    });

    return types;
  }
}

export default DragComponentAction;
