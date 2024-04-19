import Action from './Action';
import ComponentLink from '../../models/ComponentLink';

class LinkAction extends Action {

  constructor(pluginData, viewport, layout) {
    super(pluginData, viewport, layout);

    this.isInit = false;
    this.link = null;
  }

  execute(event) {
    if (!this.isInit) {
      this.isInit = true;
      const sourceId = event.subject.datum().data.id;
      const source = this.pluginData.getComponentById(sourceId);

      this.viewport.style('cursor', 'grabbing');
      const anchorName = event.sourceEvent.target.closest('.anchor').attributes.name.value;

      this.pluginData.components
        .filter(({ definition }) => !this.pluginData.canBeLink(source.definition.type, definition.type))
        .forEach((component) => {
          component.drawOption.hide = true;
        });

      this.pluginData.createTemporaryLink(sourceId, anchorName);

      this.pluginData.temporaryLink.endX = event.sourceEvent.clientX;
      this.pluginData.temporaryLink.endY = event.sourceEvent.clientY;
      this.link = new ComponentLink({
        source: sourceId,
      });

      return true;
    }

    this.pluginData.temporaryLink.endX = event.sourceEvent.clientX;
    this.pluginData.temporaryLink.endY = event.sourceEvent.clientY;

    return false;
  }

  finalize(event) {
    this.isInit = false;
    this.pluginData.temporaryLink = null;
    this.viewport.style('cursor', null);
    const source = this.pluginData.getComponentById(event.subject.datum().data.id);
    const target = this.pluginData.getComponentById(this.getTargetId(event));

    this.pluginData.components.forEach((component) => {
      component.drawOption.hide = false;
    });

    if (target) {
      source.setLinkAttribute(new ComponentLink({
        source: source.id,
        target: target.id,
        definition: this.pluginData.definitions.links
          .find(({ sourceRef, targetRef }) => source.definition.type === sourceRef
            && target.definition.type === targetRef),
      }));
    }

    return true;
  }
}

export default LinkAction;
