import Action from './Action';

/**
 * Action to select all components on root container.
 */
class SelectionAllAction extends Action {
  /**
   * Select all components on root container.
   * @returns {boolean} Need to redraw to display outline on components.
   */
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
