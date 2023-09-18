import * as d3 from 'd3';
import ElkLayout from './layout/ElkLayout';
import ComponentRenderer from './render/ComponentRenderer';

/**
 * Class that draws a component in a graphical representation.
 */
class DefaultDrawer {
  /**
   * Default constructor
   * @param {DefaultData} pluginData - Plugin data storage.
   * @param {object} [resources] - Object that contains resources.
   * @param {string} [viewPortId] - Id of HTML element where we want to draw.
   * @param option
   */
  constructor(pluginData, resources = null, viewPortId = 'view-port', option = {
    padding: 10,
    gap: 50,
  }) {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.pluginData = pluginData;

    /**
     * Component renderer.
     */
    this.componentRenderer = new ComponentRenderer({ padding: option.padding });

    /**
     * Plugin layout system.
     * @type {DefaultLayout}
     * @default new ElkLayout()
     */
    this.layout = new ElkLayout(
      this.pluginData,
      { componentRenderer: this.componentRenderer },
      {
        'elk.padding': `[
          left=${option.padding},
          top=${option.padding},
          right=${option.padding},
          bottom=${option.padding}
        ]`,
        'elk.layered.spacing.baseValue': option.gap,
      },
    );

    /**
     * Object that contains resources.
     * @type {object}
     * @default null
     */
    this.resources = resources;

    /**
     * Id of HTML element where we want to draw.
     * @type {string}
     * @default 'view-port'
     */
    this.viewPortId = viewPortId;

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
    this.viewPort = d3.select(`#${this.viewPortId}`);
    this.root = this.viewPort
      .selectAll('#root')
      .data(this.__formatComponentDataset())
      .join('svg')
      .attr('id', 'root')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('overflow', 'visible');

    const componentDrawingContext = this.root.append('g').attr('class', 'components');

    this.root.append('g').attr('class', 'links');
    this.componentRenderer.context = componentDrawingContext;
    this.componentRenderer.resources = this.resources;
  }

  groupNodesByDepth() {
    const nodes = d3.selectAll('.component');
    const maxDepth = d3.max(nodes.data(), (d) => d.depth);
    const groupedNodes = [];

    for (let i = maxDepth - 1; i > 0; i -= 1) {
      groupedNodes.push(nodes.filter((d) => d.depth === i));
    }

    return groupedNodes;
  }

  /**
   * Draw.
   * @public
   */
  draw() {
    this.__drawingComponents();
    this.registerComponentsDrawOption();
  }

  /**
   * Drawing components.
   * @private
   */
  __drawingComponents() {
    this.componentRenderer.render();
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
        this.__discriminateComponentsWithouthParent().includes(component.data.id)
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
   * Get node position.
   * @param {Component.id} componentId - Component Id.
   * @returns {object} - Node position.
   */
  getNodePosition(componentId) {
    const component = this.pluginData.components.find((data) => data.id === componentId);

    return {
      x: component.drawOption.x,
      y: component.drawOption.y,
    };
  }

  getNodeSize(componentId) {
    const node = d3.select(`#${componentId}`).select('.model');

    return {
      width: parseInt(node.attr('width'), 10),
      height: parseInt(node.attr('height'), 10),
    };
  }

  /**
   * Reorganize nodes layout algorithmically.
   * This method does not refresh the view.
   * You have to await it and trigger a redraw.
   * @returns {Promise<void>} Promise with nothing on success otherwise an error.
   */
  async arrangeComponentsPosition() {
    await this.layout.arrangeComponentsPosition();
  }

  registerComponentsDrawOption() {
    this.pluginData.components.forEach((component) => {
      const position = this.getNodePosition(component.id);
      const size = this.getNodeSize(component.id);

      component.drawOption.x = position.x;
      component.drawOption.y = position.y;
      component.drawOption.width = size.width;
      component.drawOption.height = size.height;
    });
  }
}

export default DefaultDrawer;
