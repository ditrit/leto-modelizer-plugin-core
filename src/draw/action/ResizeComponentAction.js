import Action from './Action';

/**
 * Action to resize component.
 */
class ResizeComponentAction extends Action {
  /**
   * Update element size from mouse translation.
   * @param {object} event - The event containing the target information.
   * @returns {boolean} No need to draw.
   */
  execute(event) {
    const source = event.subject.datum();
    const { zoom } = this.pluginData.scene;
    const model = this.viewport.select(`.${source.data.id} .model`);
    const modelSize = model.node().getBoundingClientRect();
    const { x: maxX, y: maxY } = this.getMaxPosition(source.data.id);
    const { clientX: mouseX, clientY: mouseY } = event.sourceEvent;
    let minWidth = Math.max((maxX - modelSize.x) / zoom, source.data.definition.minWidth);
    let minHeight = Math.max((maxY - modelSize.y) / zoom, source.data.definition.minHeight);
    let width = (mouseX - modelSize.x) / zoom;
    let height = (mouseY - modelSize.y) / zoom;

    model.attr('width', width > minWidth ? width : minWidth);
    model.attr('height', height > minHeight ? height : minHeight);

    const background = this.viewport.select(`.${source.data.id} .components-background`);
    const backgroundSize = background.node().getBoundingClientRect();

    minWidth = Math.max((maxX - backgroundSize.x)
      / zoom, source.data.definition.minWidth - source.data.definition.reservedWidth);
    minHeight = Math.max((maxY - backgroundSize.y)
      / zoom, source.data.definition.minHeight - source.data.definition.reservedHeight);
    width = (mouseX - backgroundSize.x) / zoom;
    height = (mouseY - backgroundSize.y) / zoom;

    background.attr('width', width > minWidth ? width : minWidth);
    background.attr('height', height > minHeight ? height : minHeight);

    return false;
  }

  /**
   * Update component size from element.
   * @param {object} event - The event containing the target information.
   * @returns {boolean} Need to draw.
   */
  finalize(event) {
    const { id } = event.subject.datum().data;
    const model = this.viewport.select(`.${id} .model`);
    const component = this.pluginData.getComponentById(id);

    component.drawOption.width = parseFloat(model.attr('width'));
    component.drawOption.height = parseFloat(model.attr('height'));

    this.pluginData.emitEvent({
      components: [id],
      type: 'Drawer',
      action: 'resize',
      status: 'success',
    });

    return true;
  }

  /**
   * Get max position of bottom right container corner to calculate max size.
   * @param {string} containerId - Container id.
   * @returns {{x: number, y: number}} Max position of container corner.
   */
  getMaxPosition(containerId) {
    const container = this.pluginData.getComponentById(containerId);
    let maxX = 0;
    let maxY = 0;

    this.pluginData.getChildren(containerId)
      .forEach((component) => {
        const {
          x,
          y,
          width,
          height,
        } = this.viewport.select(`.${component.id} .model`).node().getBoundingClientRect();

        maxX = Math.max(maxX, x + width + container.definition.margin);
        maxY = Math.max(maxY, y + height + container.definition.margin);
      });

    return {
      x: maxX,
      y: maxY,
    };
  }
}

export default ResizeComponentAction;
