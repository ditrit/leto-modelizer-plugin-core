import Action from './Action';

class DragSceneAction extends Action {
  execute(event) {
    this.pluginData.scene.x += event.dx;
    this.pluginData.scene.y += event.dy;

    this.applySceneTransform();

    return false;
  }

  finalize() {
    this.pluginData.emitEvent({
      components: [], // no components because its scene.
      type: 'Drawer',
      action: 'move',
      status: 'success',
    });

    return false;
  }
}

export default DragSceneAction;
