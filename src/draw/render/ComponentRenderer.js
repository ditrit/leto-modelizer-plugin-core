import { renderString } from 'nunjucks';

/**
 * Class to render component.
 */
class ComponentRenderer {
  /**
   * Default constructor.
   * @param {DefaultData} pluginData - Plugin data storage.
   * @param {object} viewport - D3 selection of the view port.
   */
  constructor(pluginData, viewport) {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.pluginData = pluginData || null;

    /**
     * D3 selection of the view port.
     * @type {Selection}
     */
    this.viewport = viewport || null;
  }

  /**
   * Return a model from a Component data and Nunjucks template.
   * @param {Component} component - Component to render.
   * @returns {string} - Rendered model.
   */
  renderModel(component) {
    return renderString(
      this.pluginData.resources.models[component.definition.model],
      {
        ...component,
        drawOption: {
          ...component.drawOption,
          x: component.drawOption.x || 0,
          y: component.drawOption.y || 0,
          width: component.drawOption.width || component.definition.width,
          height: component.drawOption.height || component.definition.height,
        },
        icon: this.pluginData.resources.icons[component.definition.icon],
        hasError: component.hasError(),
        hasX: !!component.drawOption.x,
        hasY: !!component.drawOption.y,
        isSelected: this.pluginData.scene.selection.includes(component.id),
        getIcon: (name) => this.pluginData.resources.icons[name],
        canHaveLink: this.pluginData.canHaveLink(component.definition.type),
        getAttribute: (name) => component.attributes.find((attribute) => attribute.name === name),
      },
    );
  }

  /**
   * Render nodes for each component inside context.
   * @param {string} id - Id of current context.
   */
  render(id) {
    const context = this.viewport.select(`.${id}`);

    context.select('.components').selectAll(`.component[depth="${context.datum().depth + 1}"]`)
      .data(({ children }) => children || [])
      .join('g')
      .attr('class', ({ data }) => `${data.id} component ${data.definition.isContainer
        ? 'container' : ''}`)
      .attr('depth', ({ data }) => this.pluginData.getComponentDepth(data.id) + 1)
      .html(({ data }) => this.renderModel(data))
      .filter(({ data, children }) => data.definition.isContainer && !(!children))
      .each(({ data }) => this.render(data.id));
  }
}

export default ComponentRenderer;
