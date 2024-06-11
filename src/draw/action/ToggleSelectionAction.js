import Action from './Action';

/**
 * Action to toggle selection of a component.
 */
class ToggleSelectionAction extends Action {
  /**
   * Add or remove selected component id from selection.
   * If selection is toggle on different container, it will clear all selection and toggle only
   * target component inside the new container.
   * @param {object} event - The event containing the target information.
   * @returns {boolean} Need to draw.
   */
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
