import * as d3 from 'd3';

/**
 * Class that draws a component in a graphical representation.
 * @interface
 */
class DefaultDrawer {
  /**
   * Default constructor
   * @param {Object} resources - Object that contains resources.
   */
  constructor(resources = null) {
    /**
     * Object that contains resources.
     * @type {Object}
     */
    this.resources = resources;
    /**
     * D3 library.
     */
    this.d3 = d3;
  }

  /**
   * Draw all Components and ComponentLinks in the parentId Element.
   * @param {String} [parentId="#root"] - Id of HTML element where we want to draw.
   * @param {Component[]} [components=[]] - List of components we want to draw.
   * @return {Boolean} Return true if normally execute.
   */
  draw(parentId = '#root', components = []) {
    const componentsSelection = this.d3.select(parentId)
      .selectAll('.component')
      .data(components, (data) => data.id);
    const component = componentsSelection.enter()
      .append('svg');

    component.attr('class', 'component');
    component.each((_data, index, array) => {
      const model = this.resources.models[_data.definition.svgTemplate]
        || this.resources.models.DefaultModel;
      this.d3.select(array[index])
        .node().innerHTML = model;

      const icon = this.resources.icons[_data.definition.icon]
        || this.resources.icons.DefaultIcon;
      this.d3.select(array[index])
        .select('.component-icon')
        .node().innerHTML = icon;
    });

    this.drawDefaultResource(component);

    componentsSelection.exit()
      .remove();
    return true;
  }

  /**
   * Draw component with default template.
   * @param {Object} component - HTML elements selected by D3.js
   */
  drawDefaultResource(component) {
    component.attr('id', (data) => data.id);
    component.attr('x', (data) => data.drawOption.x);
    component.attr('y', (data) => data.drawOption.y);
    component.select('.component-name')
      .text((data) => data.name);
    component.select('.component-type')
      .text((data) => data.definition.type);
  }
}

export default DefaultDrawer;
