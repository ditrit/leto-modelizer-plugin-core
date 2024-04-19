import { renderString } from 'nunjucks';

class ComponentRenderer {
  constructor(pluginData, viewport) {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.pluginData = pluginData;

    /**
     * D3 selection of the view port.
     * @type {Selection}
     */
    this.viewport = viewport;
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
   * Return a model from a Component data and Nunjucks template.
   * @param {Component} [data] - Data of component.
   * @returns {string} - Rendered models.
   */
  renderModel(component) {
    return renderString(
      this.pluginData.resources.models[component.definition.model],
      {
        ...component,
        padding: this.pluginData.container.padding,
        icon: this.pluginData.resources.icons[component.definition.icon],
        hasError: component.hasError(),
        hasX: this.__checkDataDrawingOptionExists(component, 'x'),
        hasY: this.__checkDataDrawingOptionExists(component, 'y'),
        max: (...args) => Math.max(...args),
        isSelected: this.pluginData.scene.selection.includes(component.id),
        getAttribute: (name) => component.attributes.find((attribute) => attribute.name === name),
        getIcon: (name) => this.pluginData.resources.icons[name],
        canHaveLink: this.pluginData.canHaveLink(component.definition.type),
      },
    );
  }

  /**
   * Render nodes for each Components inside context.
   * @param {string} selector - Id of current context.
   * @private
   */
  render(id) {
    const context = this.viewport.select(`.${id}`);

    context.select('.components').selectAll(`.component[depth="${context.datum().depth + 1}"]`)
      .data(({ children }) => children || [])
      .join('g')
      .attr('class', ({ data }) => `${data.id} component ${data.definition.isContainer ? 'container' : ''}`)
      .attr('depth', ({ data }) => this.pluginData.getComponentDepth(data.id) + 1)
      .html(({ data }) => this.renderModel(data))
      .filter(({ data, children }) => data.definition.isContainer && !(!children))
      .each(({ data }) => this.render(data.id));
  }
}

export default ComponentRenderer;
