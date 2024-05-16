import ComponentLink from './ComponentLink';

/**
 * Class that describe a newly created link from Components and momentarily attached to nothing.
 */
class ComponentTemporaryLink extends ComponentLink {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.anchorName] - Name of the target where the link begins.
   * @param {ComponentLinkDefinition} [props.definition] - The definition of the link.
   */
  constructor(props = {
    anchorName: null,
  }) {
    super(props);

    /**
     * Name of the target where the link begins.
     * @type {string}
     */
    this.anchorName = props.anchorName || null;
    /**
     * X of end position of link.
     * @type {number}
     */
    this.endX = null;
    /**
     * Y of end position of link.
     * @type {number}
     */
    this.endY = null;
    /**
     * Indicate if link is temporary or not.
     * @type {boolean}
     */
    this.isTemporary = true;
  }
}

export default ComponentTemporaryLink;
