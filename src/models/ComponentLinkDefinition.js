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
   */
  constructor(props = {
    attributeRef: null,
    sourceRef: null,
    targetRef: null,
    type: null,
    model: null,
    isTemporary: false,
  }) {
    const {
      attributeRef,
      sourceRef,
      targetRef,
      type,
      model,
      isTemporary,
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
    this.model = model || null;
    this.isTemporary = isTemporary || false;
  }
}

export default ComponentLinkDefinition;
