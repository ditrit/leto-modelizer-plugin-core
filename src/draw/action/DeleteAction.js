import Action from './Action';

class DeleteAction extends Action {
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
