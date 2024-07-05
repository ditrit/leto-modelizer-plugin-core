import Action from './Action';
import ComponentLink from '../../models/ComponentLink';

/**
 * Action to link component to another.
 */
class LinkAction extends Action {
  /**
   * Default constructor.
   * @param {DefaultData} pluginData - Plugin data storage.
   * @param {object} viewport - D3 selection of the view port.
   * @param {DefaultLayout} layout - Layout to organise components.
   */
  constructor(pluginData, viewport, layout) {
    super(pluginData, viewport, layout);

    /**
     * Whether the action is initialized or not.
     * @type {boolean}
     */
    this.isInit = false;
    /**
     * Stored link for finalize.
     * @type {null}
     */
    this.link = null;
  }

  /**
   * Draw temporary link and store link for finalize.
   * @param {object} event - The event containing the target information.
   * @returns {boolean} Need to draw to display temporary link.
   */
  execute(event) {
    if (!this.isInit) {
      this.isInit = true;
      const sourceId = event.subject.datum().data.id;
      const source = this.pluginData.getComponentById(sourceId);

      this.viewport.style('cursor', 'grabbing');
      const anchorName = event.sourceEvent.target.closest('.anchor').attributes.name.value;

      this.pluginData.components
        .filter(({ definition }) => !this.pluginData.canBeLinked(
          source.definition.type,
          definition.type,
        ))
        .forEach((component) => {
          this.viewport.select(`.${component.id}.component .canBeHidden`)
            .classed('hide', true);
        });

      this.pluginData.createTemporaryLink(sourceId, anchorName);
      this.link = new ComponentLink({
        source: sourceId,
      });
    }

    this.pluginData.temporaryLink.endX = event.sourceEvent.clientX;
    this.pluginData.temporaryLink.endY = event.sourceEvent.clientY;

    return false;
  }

  /**
   * If target can be linked to source, create link otherwise delete and clear temporary link.
   * @param {object} event - The event containing the target information.
   * @returns {boolean} Need to draw to remove temporary link.
   */
  finalize(event) {
    this.isInit = false;
    this.pluginData.temporaryLink = null;
    this.viewport.style('cursor', null);
    const source = this.pluginData.getComponentById(event.subject.datum().data.id);
    const target = this.pluginData.getComponentById(this.getTargetId(event));
    const definition = this.pluginData.definitions.links
      .find(({ sourceRef, targetRef }) => source.definition.type === sourceRef
        && target?.definition.type === targetRef);

    if (target && definition) {
      source.setLinkAttribute(new ComponentLink({
        source: source.id,
        target: target.id,
        definition,
      }));

      this.pluginData.emitEvent({
        components: [source.id],
        type: 'Drawer',
        action: 'update',
        status: 'success',
      });
    }

    return true;
  }
}

export default LinkAction;
