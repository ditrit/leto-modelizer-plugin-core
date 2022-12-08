/**
 * Definition of the link between components.
 */
class ComponentLinkDefinition {
  /**
   * Default constructor.
   *
   * @param {object} [props={}] - Object that contains all properties to set.
   * @param {string} [props.attributeRef] - Reference of attribute can be the link.
   * @param {string} [props.sourceRef] - Reference of component can be the source in a link.
   * @param {string} [props.targetRef] - Reference of component can be the target of the link.
   * @param {string} [props.type] - Representation of the link.
   * @param {string} [props.color='black'] - Color of the link.
   * @param {number} [props.width=2] - Width of the link.
   * @param {number[]} [props.dashStyle] - Dash style of the link. See stroke-dasharray of svg.
   */
  constructor(props = {
    attributeRef: null,
    sourceRef: null,
    targetRef: null,
    type: null,
    color: 'black',
    width: 2,
    dashStyle: null,
  }) {
    const {
      attributeRef,
      sourceRef,
      targetRef,
      type,
      color,
      width,
      dashStyle,
    } = props;

    /**
     * Reference of attribute can be the link.
     *
     * @type {string}
     */
    this.attributeRef = attributeRef || null;
    /**
     * Reference of component can be the source in a link.
     *
     * @type {string}
     */
    this.sourceRef = sourceRef || null;
    /**
     * Reference of component can be the target of the link.
     *
     * @type {string}
     */
    this.targetRef = targetRef || null;
    /**
     * Representation of the link.
     *
     * @type {string}
     */
    this.type = type || null;
    /**
     * Color of the link.
     *
     * @type {string}
     */
    this.color = color || 'black';
    /**
     * Color of the link.
     *
     * @type {number}
     */
    this.width = width || 2;
    /**
     * Dash style of the link. See stroke-dasharray of svg.
     *
     * @type {number[]}
     */
    this.dashStyle = dashStyle || null;
  }
}

export default ComponentLinkDefinition;
