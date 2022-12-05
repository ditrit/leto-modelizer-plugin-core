/**
 * Definition of the link between components.
 */
class ComponentLinkDefinition {
  /**
   * Default constructor.
   *
   * @param {String} [props.attributeRef] - Reference of attribute can be the link.
   * @param {String} [props.sourceRef] - Reference of component can be the source in a link.
   * @param {String} [props.targetRef] - Reference of component can be the target of the link.
   * @param {String} [props.type] - Representation of the link.
   * @param {String} [props.color='black'] - Color of the link.
   * @param {Number} [props.width=2] - Width of the link.
   * @param {Number[]} [props.dashStyle] - Dash style of the link. See stroke-dasharray of svg.
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
     * @type {String}
     */
    this.attributeRef = attributeRef || null;
    /**
     * Reference of component can be the source in a link.
     * @type {String}
     */
    this.sourceRef = sourceRef || null;
    /**
     * Reference of component can be the target of the link.
     * @type {String}
     */
    this.targetRef = targetRef || null;
    /**
     * Representation of the link.
     * @type {String}
     */
    this.type = type || null;
    /**
     * Color of the link.
     * @type {String}
     */
    this.color = color || 'black';
    /**
     * Color of the link.
     * @type {Number}
     */
    this.width = width || 2;
    /**
     * Dash style of the link. See stroke-dasharray of svg.
     * @type {Number[]}
     */
    this.dashStyle = dashStyle || null;
  }
}

export default ComponentLinkDefinition;
