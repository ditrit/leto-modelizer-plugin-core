import Action from './Action';

class SelectionAllAction extends Action {
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

export default SelectionAllAction;
