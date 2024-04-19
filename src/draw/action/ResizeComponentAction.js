import Action from './Action';

class ResizeComponentAction extends Action {
  execute(event) {
    const source = event.subject.datum();
    const { zoom } = this.pluginData.scene;
    const model = this.viewport.select(`.${source.data.id} .model`);
    const modelSize = model.node().getBoundingClientRect();
    const { x: maxX, y: maxY } = this.getMaxPosition(source.data.id);
    const { clientX: mouseX, clientY: mouseY } = event.sourceEvent;
    let minWidth = (maxX - modelSize.x) / zoom;
    let minHeight = (maxY - modelSize.y) / zoom;
    let width = (mouseX - modelSize.x) / zoom;
    let height = (mouseY - modelSize.y) / zoom;

    if (width > minWidth) {
      model.attr('width', width);
    }

    if (height > minHeight) {
      model.attr('height', height);
    }

    const background = this.viewport.select(`.${source.data.id} .components-zone`);
    const backgroundSize = background.node().getBoundingClientRect();

    minWidth = (maxX - backgroundSize.x) / zoom;
    minHeight = (maxY - backgroundSize.y) / zoom;
    width = (mouseX - backgroundSize.x) / zoom;
    height = (mouseY - backgroundSize.y) / zoom;

    if (width > minWidth) {
      background.attr('width', width);
    }

    if (height > minHeight) {
      background.attr('height', height);
    }

    return false;
  }

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

  getMaxPosition(containerId) {
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
        const currentX = x + width;
        const currentY = y + height;

        maxX = currentX > maxX ? currentX : maxX;
        maxY = currentY > maxY ? currentY : maxY;
      });

    return {
      x: maxX,
      y: maxY,
    };
  }
}

export default ResizeComponentAction;
