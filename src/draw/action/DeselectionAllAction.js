import Action from './Action';

/**
 * Action to clear selection.
 */
class DeselectionAllAction extends Action {
  /**
   * Clear selection.
   * @returns {boolean} Need to call draw at the end.
   */
  execute() {
    this.pluginData.scene.selection = [];

    this.pluginData.emitEvent({
      components: [],
      type: 'Drawer',
      action: 'select',
      status: 'success',
    });

    return true;
  }
}

export default DeselectionAllAction;
