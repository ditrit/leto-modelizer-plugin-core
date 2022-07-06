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
    this.attributesOutputLinks = [];
    /**
     * An array of input links attributes.
     * @type {Array}
     */
    this.attributesInputLinks = [];
    /**
     * @type {String}
     */
    this.id = id;
  }

  /**
   * Add a new child in the array and update the rightSibling of the last object.
   * @param {LetoObjectNode} child
   */
  addContent(child){
    if (this.contains.length!=0){
      if(this.contains[this.contains.length-1].value){
        this.contains[this.contains.length-1].value.setRightSibling(child);
      }
      else{
        this.contains[this.contains.length-1].setRightSibling(child);
      }
    }
    if(child.value){
      this.contains.push(child);
    }
    else{
      this.contains.push({
        name: "",
        value : child,
      })
    }
  }
  /**
   * Add a new output link in the array.
   * @param {Object} link
   */
  addOutputLink(link){
    this.attributesOutputLinks.push(link);
  }
  /**
   * Add a new input link in the array.
   * @param {Object} link
   */
  addInputLink(link){
    this.attributesInputLinks.push(link);
  }
  /**
   * Remove an output link from the array by its id.
   * @param {String} linkId
   */
  removeOutputLink(linkId){
    let outputs = this.attributesOutputLinks;
    outputs.forEach(link =>{
      if(link.id == linkId){
        outputs.splice(outputs.indexOf(link));
      }
    })
  }
  /**
   * Remove an input link from the array by its id.
   * @param {String} linkId
   */
  removeInputLink(linkId){
    let inputs = this.attributesInputLinks;
    inputs.forEach(link =>{
      if(link.id == linkId){
        inputs.splice(inputs.indexOf(link));
      }
    })
  }
  /**
   * Apply a function on a LetoObjectNode by traversing the tree
   * @param {LetoObjectNode, function()} node, callback
   */
  static walkTree(node,callback){
    if (node == null){
      return;
    }
    node = (node.value) ? node.value : node;
    this.walkTree(node.rightSibling,callback);
    this.walkTree(node.contains[0],callback);
    callback(node);
  }
}

export default LetoObjectNode;
