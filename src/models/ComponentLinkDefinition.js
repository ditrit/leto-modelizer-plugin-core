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
   */
  constructor(props = {
    attributeRef: null,
    sourceRef: null,
    targetRef: null,
    type: null,
  }) {
    const {
      attributeRef,
      sourceRef,
      targetRef,
      type,
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
  }
}

export default ComponentLinkDefinition;
