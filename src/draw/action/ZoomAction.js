import Action from './Action';

/**
 * Action to zoom on scene.
 */
class ZoomAction extends Action {
  /**
   * Zoom on scene.
   * @param {object} event - The event containing the target information.
   * @returns {boolean} No need to draw.
   */
  execute(event) {
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;

    const { x: viewportX, y: viewportY } = this.viewport.node().getBoundingClientRect();

    const relativeMouseX = event.clientX - viewportX;
    const relativeMouseY = event.clientY - viewportY;
    const initialSceneX = this.pluginData.scene.x;
    const initialSceneY = this.pluginData.scene.y;

    this.pluginData.scene.zoom *= zoomFactor;

    // Calculate translation after applying zoom
    const finalSceneX = relativeMouseX - (relativeMouseX - initialSceneX) * zoomFactor;
    const finalSceneY = relativeMouseY - (relativeMouseY - initialSceneY) * zoomFactor;

    // Update scene translation
    this.pluginData.scene.x = finalSceneX;
    this.pluginData.scene.y = finalSceneY;

    this.applySceneTransform();

    this.pluginData.emitEvent({
      type: 'Drawer',
      action: 'zoom',
      status: 'success',
    });

    return false;
  }
}

export default ZoomAction;
