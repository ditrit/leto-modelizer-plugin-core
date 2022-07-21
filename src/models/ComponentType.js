class ComponentType {
  /**
   * Default constructor.
   *
   * @param {String} name The type of the component.
   * @param {String} icon The icon's path of this type of component.
   * @param {String} svgTemplate Path of SVG template to render this type of component.
   * @param {String[]} containerTypes List of types can be contain this type of component.
   * @param {Boolean} isContainer This type of component can have subContent.
   */
  constructor(
    name = null,
    icon = null,
    svgTemplate = null,
    containerTypes = [],
    isContainer = null,
  ) {
    /**
     * @type {String}
     */
    this.name = name;
    /**
     * @type {String}
     */
    this.icon = icon;
    /**
     * @type {String[]}
     */
    this.containerTypes = containerTypes;
    /**
     * @type {String}
     */
    this.svgTemplate = svgTemplate;
    /**
     * @type {Boolean}
     */
    this.isContainer = isContainer;
  }
}
export default ComponentType;
