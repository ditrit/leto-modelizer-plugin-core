class Link {
  /**
   * Default constructor.
   *
   * @param {Object} from Where the link is created.
   * @param {String} from.id ID of the component.
   * @param {Integer} from.anchor anchor of the component.
   * @param {Object} to Target of the link.
   * @param {String} to.id ID of the component.
   * @param {Integer} to.anchor anchor of the component.
   * @param {Boolean} isInversed representation of the link.
   */
  constructor(from, to, isInversed = null) {
    /**
     * @type {Object}
     */
    this.from = from;
    /**
     * @type
     */
    this.to = to;
    /**
     * @type {Boolean}
     */
    this.isInversed = isInversed;
  }
}

export default Link;
