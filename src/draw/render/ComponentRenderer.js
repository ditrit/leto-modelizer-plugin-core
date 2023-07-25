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
 * Set components from a dataset.
 * @param {Selection} [container] - D3 selection of the root container in which you wish to create
 * components.
 * @param {Component[]} [dataset] - Dataset containing component data.
 * @returns {Selection} - D3 selection of components.
 */
export function createComponentsFromData(container, dataset) {
  return container.selectAll('.component')
    .data(dataset)
    .join('g')
    .attr('class', 'component')
    .attr('id', (data) => data.id);
}

/**
 * Render each component.
 * @param {Selection} [components] - D3 selection of all components.
 * @param {object} [resources] - Object that contains model resources.
 */
export function render(components, resources) {
  components.html((data) => renderString(
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
  ));
}
