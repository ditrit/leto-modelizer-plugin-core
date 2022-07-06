/**
 * A model for modelling tools in Leto's projects.
 */
class LetoObjectNode {
  /**
   * Default constructor.
   *
   * @param {LetoTypeNode} letoType The letoTypeNode used to instanciate this LetoTypeNode.
   * @param {String} name The name of the object.
   * @param {String} id The id of the object.
   */
  constructor(letoType = null, name = null, id = null) {
    /**
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
     * @type {Array}
     */
    this.contains = [];
    /**
     * An array of output links attributes.
     * @type {Array}
     */
    this.attributes_output_links = [];
    /**
     * An array of input links attributes.
     * @type {Array}
     */
    this.attributes_input_links = [];
    /**
     * @type {String}
     */
    this.id = id;
  }

  /**
   * Add a new child in the array and update the nextNode of the last object.
   * @param {LetoObjectNode} child
   */
  addChild(child) {
    if (this.children.length !== 0) {
      this.children[this.children.length - 1].nextNode = child;
    }
    this.children.push(child);
  }
}

export default LetoObjectNode;
