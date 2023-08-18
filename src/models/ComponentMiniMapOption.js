/**
 * Definition of Component's datas and constraints
 */
class ComponentMiniMapOption {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.shape] - Which shape should the component have on the map.
   * Built-in shapes are: rectangle, circle, triangle.
   * @param {string} [props.fill] - Fill color in CSS format (ie. lightblue, #19fa12).
   * @param {string} [props.stroke] - Stroke color in CSS format (ie. lightblue, #19fa12).
   */
  constructor(props = {
    shape: 'rectangle',
    fill: 'none',
    stroke: 'black',
  }) {
    const {
      shape,
      fill,
      stroke,
    } = props;

    /**
     * Which shape should the component have on the map.
     * @type {string}
     */
    this.shape = shape || 'rectangle';

    /**
     * Fill color in CSS format (ie. lightblue, #19fa12).
     * @type {string}
     */
    this.fill = fill || 'none';

    /**
     * Stroke color in CSS format (ie. lightblue, #19fa12).
     * @type {string}
     */
    this.stroke = stroke || 'black';
  }
}
export default ComponentMiniMapOption;
