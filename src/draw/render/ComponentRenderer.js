import * as d3 from 'd3';
import { renderString } from 'nunjucks';

/**
 * Check if the data has the option to draw.
 * @param {Component} [data] - Data of component.
 * @param {string} [option] - Option to check if exists.
 * @returns {boolean} - True if the option exists, false otherwise.
 * @private
 */
function checkDataDrawingOptionExists(data, option) {
  return !(!data.drawOption || !data.drawOption[option]);
}

/**
 * Create models.
 * @param {Component} [data] - Data of component.
 * @param {object} [resources] - Object that contains model resources.
 * @returns {string} - Rendered models.
 */
function renderModel(data, resources) {
  return renderString(
    resources.models[data.definition.model],
    {
      ...data,
      icon: resources.icons[data.definition.icon],
      hasError: data.hasError(),
      hasWidth: checkDataDrawingOptionExists(data, 'width'),
      hasHeight: checkDataDrawingOptionExists(data, 'height'),
      hasX: checkDataDrawingOptionExists(data, 'x'),
      hasY: checkDataDrawingOptionExists(data, 'y'),
      getAttribute: (name) => data.attributes.find((attribute) => attribute.name === name),
    },
  );
}

/**
 * Create nodes.
 * @param {Selection} [context] - D3 selection of the context.
 * @param {object} [resources] - Object that contains model resources.
 */
function createNodes(context, resources) {
  context.selectAll('.component')
    .data(({ children }) => children)
    .join('g')
    .attr('id', ({ data }) => data.id)
    .attr('class', 'component')
    .html(({ data }) => renderModel(data, resources))
    .filter(({ data, children }) => data.definition.isContainer && !(!children))
    .each(({ data }) => {
      createNodes(d3.select(`#${data.id}`).select('.components'), resources);
    });
}

/**
 * Render each component.
 * @param {Selection} [context] - D3 selection of the context.
 * @param {object} [resources] - Object that contains model resources.
 */
export function render(context, resources) {
  createNodes(context, resources);
}
