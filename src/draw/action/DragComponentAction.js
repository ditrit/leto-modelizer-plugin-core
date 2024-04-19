import Action from './Action';

class DragComponentAction extends Action {
  execute(event) {
    const sources = this.getSourcesId(event);

    sources.forEach((id) => {
      const model = this.viewport.select(`.${id} .model`);

      model
        .attr('x', parseFloat(model.attr('x')) + (event.dx / this.pluginData.scene.zoom))
        .attr('y', parseFloat(model.attr('y')) + (event.dy / this.pluginData.scene.zoom));
    });

    return false;
  }

  finalize(event) {
    const sourcesId = this.getSourcesId(event);
    const targetId = this.getTargetsId(event)[0] || null;
    const sources = sourcesId.map((id) => this.pluginData.getComponentById(id));

    if (targetId === null) {
      return this.dropOnScene(event, sources);
    }

    return this.dropOnTarget(event, sources, this.pluginData.getComponentById(targetId));
  }

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
          `.${containerId} rect.components-zone`,
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

    if (!isChangingContainer) {
      sources.forEach((source) => {
        const { dx, dy } = this.getTransform(
          `.${source.id} rect.background`,
          `.${target.id} rect.components-zone`,
        );

        source.drawOption.x = dx < 1 ? 1 : dx / this.pluginData.scene.zoom;
        source.drawOption.y = dy < 1 ? 1 : dy / this.pluginData.scene.zoom;
      });

      this.pluginData.emitEvent({
        components: sources.map(({ id }) => id),
        type: 'Drawer',
        action: 'move',
        status: 'success',
      });

      return true;
    }

    sources.forEach((source) => {
      source.setReferenceAttribute(target);
      const { dx, dy } = this.getTransform(
        `.${source.id} rect.background`,
        `.${target.id} rect.components-zone`,
      );

      source.drawOption.x = dx < 1 ? 1 : dx / this.pluginData.scene.zoom;
      source.drawOption.y = dy < 1 ? 1 : dy / this.pluginData.scene.zoom;
    });

    this.pluginData.emitEvent({
      components: sources.map(({ id }) => id),
      type: 'Drawer',
      action: 'update',
      status: 'success',
    });

    return true;
  }

  dropInWorkflow(event, sources, target) {
    const oldContainerId = sources[0].getContainerId();
    const container = this.pluginData.getComponentById(target.id);
    const children = this.pluginData.getChildren(target.id);
    const isVertical = target.definition.workflowDirection === 'vertical';
    const sourceIds = this.pluginData.components
      .filter(({ id }) => sources.some(({ id: sourceId }) => id === sourceId))
      .map(({ id }) => id);
    let afterId;

    children
      .filter(({ id }) => !sourceIds.includes(id))
      .forEach((child) => {
        const {
          x: childX,
          y: childY,
          width,
          height,
        } = this.viewport.select(`.${child.id} rect.background`).node().getBoundingClientRect();

        if (isVertical && childY + height / 2 < event.sourceEvent.clientY) {
          afterId = child.id;
        }

        if (!isVertical && childX + width / 2 < event.sourceEvent.clientX) {
          afterId = child.id;
        }
      });

    sourceIds.forEach((sourceId) => {
      const source = this.pluginData.getComponentById(sourceId);

      source.setReferenceAttribute(container);

      if (!afterId) {
        afterId = this.pluginData.components
          .find((component) => component.getContainerId() === target.id).id;

        if (sourceId !== afterId) {
          this.pluginData.insertComponentBefore(sourceId, afterId);
        }
      } else {
        this.pluginData.insertComponentAfter(sourceId, afterId);
      }
      afterId = sourceId;
    });

    if (oldContainerId !== target.id) {
      if (oldContainerId) {
        this.layout.generateComponentsLayout(oldContainerId);
      }
      this.layout.generateComponentsLayout(target.id);
    }

    this.pluginData.emitEvent({
      components: sourceIds,
      type: 'Drawer',
      action: 'update',
      status: 'success',
    });

    return true;
  }
}

export default DragComponentAction;
