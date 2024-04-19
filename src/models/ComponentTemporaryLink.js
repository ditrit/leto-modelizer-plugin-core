import ComponentLink from './ComponentLink';

class ComponentTemporaryLink extends ComponentLink {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.source] - Id of component can be the source in a link.
   * @param {string} [props.target] - Id of component can be the target of the link.
   * @param {ComponentLinkDefinition} [props.definition] - The definition of the link.
   */
  constructor(props = {
    anchorName: null,
  }) {
    super(props);

    this.isTemporary = true;
    this.anchorName = props.anchorName || null;
    this.endX = null;
    this.endY = null;
  }
}

export default ComponentTemporaryLink;
