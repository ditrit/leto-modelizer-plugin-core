import * as d3 from 'd3';
import { renderString } from 'nunjucks';

class ComponentRenderer {
  constructor(options = {
    gap: 10,
    padding: 6,
    resources: null,
  }) {
    /**
     * Gap between components.
     * @type {number}
     * @default 10
     */
    this.gap = options.gap;

    /**
     * Space between the component and the border of its container.
     * @type {number}
     * @default 10
     */
    this.padding = options.padding;

    /**
     * Object that contains resources.
     * @type {object}
     */
    this.resources = options.resources;

    /**
     * Drawing context.
     * @type {object}
     * @default null
     * @private
     */
    this.drawingContextId = 'root';
  }

  /**
   * Check if the data has the option to draw.
   * @param {Component} [data] - Data of component.
   * @param {string} [option] - Option to check if exists.
   * @returns {boolean} - True if the option exists, false otherwise.
   * @private
   */
  __checkDataDrawingOptionExists(data, option) {
    return !(!data.drawOption || !data.drawOption[option]);
  }

  /**
   * Create models.
   * @param {Component} [data] - Data of component.
   * @returns {string} - Rendered models.
   */
  renderModel(data) {
    const { padding } = this;

    return renderString(
      this.getModel(data.definition.model),
      {
        ...data,
        padding,
        icon: this.resources.icons[data.definition.icon],
        hasError: data.hasError(),
        hasWidth: this.__checkDataDrawingOptionExists(data, 'width'),
        hasHeight: this.__checkDataDrawingOptionExists(data, 'height'),
        hasX: this.__checkDataDrawingOptionExists(data, 'x'),
        hasY: this.__checkDataDrawingOptionExists(data, 'y'),
        getAttribute: (name) => data.attributes.find((attribute) => attribute.name === name),
      },
    );
  }

  /**
   * Create nodes.
   * @param {string} contextId - Id of current context.
   * @param {number} [depth] - Depth of current context.
   * @private
   */
  render(contextId = this.drawingContextId) {
    const context = d3.select(`#${contextId}`);

    context.select('.components').selectAll(`.component[depth="${context.datum().depth + 1}"]`)
      .data(({ children }) => children)
      .join('g')
      .attr('id', ({ data }) => data.id)
      .attr('class', 'component')
      .attr('depth', (data) => data.depth)
      .html(({ data }) => this.renderModel(data))
      .filter(({ data, children }) => data.definition.isContainer && !(!children))
      .each(({ data }) => this.render(data.id));
  }

  setAutomaticlyContainerSize(nodeId) {
    const node = d3.select(`#${nodeId}`);
    const { width, height } = node.select('.components').node().getBoundingClientRect();

    node.datum().data.drawOption.innerWidth = width;
    node.datum().data.drawOption.innerHeight = height;

    node.html(this.renderModel(node.datum().data));
    this.render(nodeId);
  }

  /**
   * Get model.
   * @param {string} [model] - Model name.
   * @returns {string} - Model.
   * @private
   */
  getModel(model) {
    return this.resources.models[model];
  }
}

export default ComponentRenderer;
