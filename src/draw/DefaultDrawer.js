import * as d3 from 'd3';
import ElkLayout from './ElkLayout';
import * as cr from './render/ComponentRenderer';

/**
 * Class that draws a component in a graphical representation.
 */
class DefaultDrawer {
  /**
   * Default constructor
   * @param {DefaultData} pluginData - Plugin data storage.
   * @param {object} [resources] - Object that contains resources.
   * @param {string} [viewPortID] - ID of HTML element where we want to draw.
   */
  constructor(pluginData, resources = null, viewPortID = 'view-port') {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.pluginData = pluginData;

    /**
     * Plugin layout system.
     * @type {DefaultLayout}
     * @default new ElkLayout()
     */
    this.layout = new ElkLayout(this.pluginData);

    /**
     * Object that contains resources.
     * @type {object}
     * @default null
     */
    this.resources = resources;

    /**
     * ID of HTML element where we want to draw.
     * @type {string}
     * @default 'view-port'
     */
    this.viewPortID = viewPortID;

    /**
     * D3 selection of the view port.
     * @type {Selection}
     */
    this.viewPort = null;

    /**
     * D3 selection of the root.
     * @type {Selection}
     */
    this.root = null;
  }

  /**
   * Initialize drawing context.
   * @public
   */
  initDrawingContext() {
    this.viewPort = d3.select(`#${this.viewPortID}`);
    this.root = this.viewPort
      .selectAll('#root')
      .data(this.__formatComponentDataset())
      .join('svg')
      .attr('id', 'root')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('overflow', 'visible');

    this.root.append('g').attr('class', 'components');
    this.root.append('g').attr('class', 'links');
  }

  /**
   * Draw.
   * @public
   */
  draw() {
    console.log(this.__formatComponentDataset());
    this.__drawingComponents();
  }

  /**
   * Drawing components.
   * @private
   */
  __drawingComponents() {
    const context = this.root.select('.components');

    cr.render(context, this.resources);
  }

  /**
   * Format component dataset to d3 hierarchy.
   * @returns {object} - Formated component dataset.
   * @private
   */
  __formatComponentDataset() {
    const fromRootComponentDataset = {
      id: 'root',
      name: '',
      children: this.pluginData.components,
    };

    const formatedComponentDataset = d3.hierarchy(fromRootComponentDataset, (data) => {
      if (data.id === 'root') {
        return data.children;
      }

      return this.pluginData.getChildren(data.id);
    });

    formatedComponentDataset.children = formatedComponentDataset.children
      .filter((component) => (
        this.__discriminateComponentsWithouthParent()
          .includes(component.data.id)
      ));

    return [formatedComponentDataset];
  }

  /**
   * Get components without parent.
   * @returns {Component.id[]} - Components without parent.
   * @private
   */
  __discriminateComponentsWithouthParent() {
    let componentWithParent = [];

    this.pluginData.components.forEach((component) => {
      componentWithParent = componentWithParent.concat(this.pluginData.getChildren(component.id));
    });

    return this.pluginData.components
      .filter((component) => !componentWithParent.includes(component))
      .map((component) => component.id);
  }

  /**
   * Reorganize nodes layout algorithmically.
   * This method does not refresh the view.
   * You have to await it and trigger a redraw
   * @returns {Promise<void>} Promise with nothing on success otherwise an error.
   */
  async arrangeComponentsPosition() {
    await this.layout.arrangeComponentsPosition();
  }
}

export default DefaultDrawer;
