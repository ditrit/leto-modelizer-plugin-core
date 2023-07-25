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

    /**
     * D3 selection of all components
     * @type {selection}
     */
    this.components = null;
  }

  initDrawingContext() {
    this.viewPort = d3.select(`#${this.viewPortID}`);
    this.root = this.viewPort
      .append('svg')
      .attr('id', 'root')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('overflow', 'visible');

    this.root.append('g').attr('id', 'components');
    this.root.append('g').attr('id', 'links');
  }

  draw() {
    this.drawComponents();
  }

  drawComponents() {
    this.components = cr.createComponentsFromData(
      this.root.select('#components'),
      this.pluginData.components,
    );

    cr.render(this.components, this.resources);
    this.formatComponentDataset();
  }

  /**
   * Format dataset before to components creation.
   * @returns {object} - Formated dataset.
   */
  formatComponentDataset() {
    const fromRootComponentDataset = {
      id: 'components',
      name: '',
      children: this.pluginData.components,
    };

    const formatedComponentDataset = d3.hierarchy(fromRootComponentDataset, (data) => {
      if (data.id === 'components') {
        return data.children;
      }

      return this.pluginData.getChildren(data.id);
    });

    return formatedComponentDataset;
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
