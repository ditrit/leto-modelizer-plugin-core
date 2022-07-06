class LetoTypeNode{
  /**
   * Default constructor.
   *
   * @param {String} logoPath The logo path of this type of object.
   * @param {String} type The type of the object.
   * @param {String} svgShape The svg file used to draw this type of object.
   * @param {String} the graphic representation of this type of object.
   */
	constructor(logoPath = null, type = null ,svgShape = null ,representation = null){   
	   /**
     	* @type {String}
     	*/
		this.logoPath=logoPath;
	   /**
     	* @type {String}
     	*/
		this.type=type;
		/**
     	* @type {String}
     	*/
		this.svgShape = svgShape;
	   /**
     	* @type {String}
     	*/
		this.representation = representation;
	}
}
export default LetoTypeNode;