/**
 * Definition of the link between components.
 */
class ComponentLinkDefinition {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.attributeRef] - Reference of attribute can be the link.
   * @param {string} [props.sourceRef] - Reference of component can be the source in a link.
   * @param {string} [props.targetRef] - Reference of component can be the target of the link.
   * @param {string} [props.type] - Representation of the link.
   * @param {string} [props.color] - Color of the link.
   * @param {number} [props.width] - Width of the link.
   * @param {number[]} [props.dashStyle] - Dash style of the link. See stroke-dasharray of svg.
   * @param {object} [props.marker] - Marker of the link, see
   * {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Element/marker official documentation}.
   * @param {number} [props.marker.width] - Width of the marker.
   * @param {number} [props.marker.height] - Height of the marker.
   * @param {number} [props.marker.refX] - X offset of the marker from the edge of the link path.
   * @param {number} [props.marker.refY] - Y offset of the marker from
   * the edge of the link path.
   * @param {string} [props.marker.orient] - Orientation of the marker.
   * @param {string} [props.marker.path] - Path of the shape of the marker.
   */
  constructor(props = {
    attributeRef: null,
    sourceRef: null,
    targetRef: null,
    type: null,
    color: 'black',
    width: 2,
    dashStyle: null,
    marker: {
      width: 5,
      height: 5,
      refX: 4,
      refY: 2.5,
      orient: 'auto-start-reverse',
      path: 'M 0 0 L 5 2.5 L 0 5',
    },
  }) {
    const {
      attributeRef,
      sourceRef,
      targetRef,
      type,
      color,
      width,
      dashStyle,
      marker,
    } = props;

    /**
     * Reference of attribute can be the link.
     * @type {string}
     */
    this.attributeRef = attributeRef || null;
    /**
     * Reference of component can be the source in a link.
     * @type {string}
     */
    this.sourceRef = sourceRef || null;
    /**
     * Reference of component can be the target of the link.
     * @type {string}
     */
    this.targetRef = targetRef || null;
    /**
     * Representation of the link.
     * @type {string}
     */
    this.type = type || null;
    /**
     * Color of the link.
     * @type {string}
     */
    this.color = color || 'black';
    /**
     * Color of the link.
     * @type {number}
     * @default 2
     */
    this.width = width || 2;
    /**
     * Dash style of the link. See stroke-dasharray of svg.
     * @type {number[]}
     */
    this.dashStyle = dashStyle || null;

    /**
     * Marker of the link.
     */
    this.marker = marker || {
      width: 5,
      height: 5,
      refX: 4,
      refY: 2.5,
      orient: 'auto-start-reverse',
      path: 'M 0 0 L 5 2.5 L 0 5',
    };
  }
}

export default ComponentLinkDefinition;
