import LetoAttribute from './LetoAttribute';

/**
 * A model for modelling tools in Leto's projects.
 */
class LetoObjectNode {
  /**
   * Default constructor.
   *
   * @param {LetoTypeNode} letoType The letoTypeNode used to instanciate this LetoObjectNode.
   * @param {String} name The name of the object.
   * @param {String} id The id of the object.
   */
  constructor(letoType = null, name = null, id = null) {
    /**
     *
     * @type {LetoTypeNode}
     */
    this.letoType = letoType;
    /**
     * @type {String}
     */
    this.name = name;
    /**
     * Following node in the tree.
     * @type {LetoObjectNode}
     */
    this.rightSibling = null;
    /**
     * An array of imbrication attributes containing all the object's children.
     * @type {LetoAttribute[]}
     */
    this.contains = [];
    /**
     * An array of output links attributes.
     * @type {LetoLink[]}
     */
    this.attributesOutputLinks = [];
    /**
     * An array of input links attributes.
     * @type {LetoLink[]}
     */
    this.attributesInputLinks = [];
    /**
     * @type {String}
     */
    this.id = id;
    /**
     * @type {Float}
     */
    this.x = 0;
    /**
     * @type {Float}
     */
    this.y = 0;
    /**
     * @type {Float}
     */
    this.width = 0;
    /**
     * @type {Float}
     */
    this.height = 0;
  }

  /**
   * Add a new child in the array and update the rightSibling of the last object.
   * @param {LetoObjectNode} child
   */
  addContent(child) {
    if (this.contains.length !== 0) {
      if (this.contains[this.contains.length - 1].value) {
        this.contains[this.contains.length - 1].value.rightSibling = child;
      } else {
        this.contains[this.contains.length - 1].rightSibling = child;
      }
    }
    if (child.value) {
      this.contains.push(child);
    } else {
      this.contains.push(new LetoAttribute('', child));
    }
  }
}
export default LetoObjectNode;
