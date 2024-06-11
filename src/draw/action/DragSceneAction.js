import Action from './Action';

/**
 * Action to drag the scene.
 */
class DragSceneAction extends Action {
  /**
   * Update scene position.
   * @param {object} event - The event containing the target information.
   * @returns {boolean} No need to redraw because scene is directly updated.
   */
  execute(event) {
    this.pluginData.scene.x += event.dx;
    this.pluginData.scene.y += event.dy;

    this.applySceneTransform();

    return false;
  }

  /**
   * Send event to indicate that scene have moving.
   * @returns {boolean} No need to redraw because scene is directly updated.
   */
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
