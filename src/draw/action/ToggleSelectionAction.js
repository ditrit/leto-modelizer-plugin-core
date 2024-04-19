import Action from './Action';

class ToggleSelectionAction extends Action {
  finalize(event) {
    const target = event.subject.datum().data;
    const containerId = target.getContainerId();

    if (this.pluginData.scene.selection.includes(target.id)) {
      this.pluginData.scene.selection = this.pluginData.scene.selection
        .filter((id) => id !== target.id);
    } else {
      if (this.pluginData.scene.selection.length === 0) {
        this.pluginData.scene.selectionRef = containerId;
      }

      if (containerId === this.pluginData.scene.selectionRef) {
        this.pluginData.scene.selection.push(target.id);
      } else {
        this.pluginData.scene.selectionRef = containerId;
        this.pluginData.scene.selection = [target.id];
      }
    }

    this.pluginData.emitEvent({
      components: [...this.pluginData.scene.selection],
      type: 'Drawer',
      action: 'select',
      status: 'success',
    });

    return true;
  }
}

export default ToggleSelectionAction;
