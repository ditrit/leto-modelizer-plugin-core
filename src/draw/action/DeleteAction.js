import Action from './Action';

/**
 * Action to delete component(s).
 */
class DeleteAction extends Action {
  /**
   * Delete selected components and clear selection.
   * @returns {boolean} Need to call draw at the end.
   */
  finalize() {
    if (this.pluginData.scene.selection.length === 0) {
      return false;
    }

    this.pluginData.scene.selection.forEach((id) => {
      this.pluginData.removeComponentById(id);
    });

    this.pluginData.emitEvent({
      components: this.pluginData.scene.selection,
      type: 'Drawer',
      action: 'delete',
      status: 'success',
    });

    this.pluginData.scene.selection = [];

    return true;
  }
}

export default DeleteAction;
