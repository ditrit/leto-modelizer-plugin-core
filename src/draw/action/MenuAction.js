import Action from './Action';

/**
 * Action to send event to open menu action.
 */
class MenuAction extends Action {
  /**
   * Send event to open menu action.
   * @param {object} event - The event containing the target information.
   * @returns {boolean} No need to draw.
   */
  finalize(event) {
    this.pluginData.emitEvent({
      components: [event.subject.datum().data.id],
      type: 'Drawer',
      action: 'openMenu',
      data: event.sourceEvent,
      status: 'success',
    });

    return false;
  }
}

export default MenuAction;
