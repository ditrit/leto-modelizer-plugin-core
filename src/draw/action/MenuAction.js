import Action from './Action';

class MenuAction extends Action {
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
