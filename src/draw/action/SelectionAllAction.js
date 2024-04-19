import Action from './Action';

class SelectionAllAction extends Action {
  execute() {
    this.pluginData.scene.selection = this.pluginData.components
      .filter((component) => component.getContainerId() === null)
      .map(({ id }) => id);

    this.pluginData.emitEvent({
      components: [...this.pluginData.scene.selection],
      type: 'Drawer',
      action: 'select',
      status: 'success',
    });

    return true;
  }
}

export default SelectionAllAction;
