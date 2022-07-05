/**
 * A model for modelling tools in Leto's projects.
 */
class LetoObjectNode {
  /**
   * Default constructor.
   *
   * @param {String} logoPath The path of the svg's icon.
   * @param {String} type The type of the object.
   * @param {String} svg The svg object.
   * @param {String} name The name of the object.
   * @param {String} id The id of the object.
   */
  constructor(logoPath = null, type = null, svg = null, name = null, id = null) {
    /**
     * @type {String}
     */
    this.svg = svg;
    /**
     * @type {String}
     */
    this.logoPath = logoPath;
    /**
     * @type {String}
     */
    this.type = type;
    /**
     * @type {String}
     */
    this.name = name;
    /**
     * Following node in the tree.
     * @type {Object}
     */
    this.nextNode = null;
    /**
     * An array of LetoObjectNode containing all the object's children.
     * @type {Array}
     */
    this.children = [];
    /**
     * An array of object containing all the links of the object.
     * @type {Object}
     * @property {Object} outputs Outbound links
     * @property {Object} inputs Inbound links
     */
    this.links = {
      outputs: [],
      inputs: [],
    };
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
