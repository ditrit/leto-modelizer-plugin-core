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
 * @param {Function} [getModel] - Function that returns a model.
 * @param {object} [resources] - Object that contains model resources.
 * @returns {string} - Rendered models.
 */
export function renderModel(data, getModel, resources) {
  return renderString(
    getModel(data.definition.model),
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
 * @param {Function} [getModel] - Function that returns a model.
 * @param {object} [resources] - Object that contains model resources.
 * @private
 */
function createNodes(context, getModel, resources) {
  context.selectAll('.component')
    .data(({ children }) => children)
    .join('g')
    .attr('id', ({ data }) => data.id)
    .attr('class', 'component')
    .html(({ data }) => renderModel(data, getModel, resources))
    .filter(({ data, children }) => data.definition.isContainer && !(!children))
    .each(({ data }) => {
      createNodes(d3.select(`#${data.id}`).select('.components'), getModel, resources);
    });
}

/**
 * Render each component.
 * @param {Selection} [context] - D3 selection of the context.
 * @param {Function} [getModel] - Function that returns a model.
 * @param {object} [resources] - Object that contains model resources.
 */
export function render(context, getModel, resources) {
  createNodes(context, getModel, resources);
}
