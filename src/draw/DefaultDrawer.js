import * as d3 from 'd3';
import ComponentDrawOption from 'src/models/ComponentDrawOption';

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
    /**
     * Margin value between component default position.
     * @type {Number}
     */
    this.margin = 10;
    /**
     * Store for actions, used to set specific actions values when making actions.
     * @type {Object}
     */
    this.actions = {
      selection: {
        current: null,
        style: '2px solid hsl(205, 100%, 50%)',
        offset: '3px',
      },
      drag: {
        state: false,
        deltaX: 0,
        deltay: 0,
      },
    };
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
    const svgContainer = componentsSelection.enter().append('svg');

    svgContainer.each((_data, index, array) => {
      this.d3.select(array[index]).attr('class', `component component-${_data.definition.svgTemplate}`);
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

    this.initializeComponents(components, svgContainer);

    [...new Set(components.map((component) => component.definition.svgTemplate))]
      .forEach((template) => {
        const svg = this.d3.select(parentId)
          .selectAll(`.component-${template}`);

        if (this[`draw${template}`]) {
          this[`draw${template}`](svg);
        } else {
          this.drawDefaultModel(svg);
        }
      });

    this.setViewPortAction(this.d3.select('#viewport'));

    components.forEach((component) => {
      this.setComponentAction(component);
    });

    componentsSelection.exit()
      .remove();
    return true;
  }

  /**
   * Set actions on viewport.
   * @param {Object} d3Element - D3 selected element.
   */
  setViewPortAction(d3Element) {
    d3Element.on('mousedown', () => {
      this.__unselectComponent();
    });
  }

  /**
   * Set actions on component.
   * @param {Component} component - Component to set actions.
   */
  setComponentAction(component) {
    const element = this.d3.select(`#${component.id}`);
    element.call(
      this.d3.drag()
        .on('start', (event) => {
          this.__dragStart(event, component, element);
        })
        .on('drag', (event) => {
          this.__selectComponent(component.id);
          this.__dragPending(event, component, element);
        })
        .on('end', (event) => {
          if (!this.actions.drag.state) {
            this.__toggleComponentSelection(event.subject.id);
          }
          this.__dragEnd(element);
        }),
    );
  }

  /**
   * Action to make on drag start event.
   * @param {Object} event - Drag event.
   * @param {Component} component - Component related to the action.
   * @param {Object} d3Element - D3 element related to the action.
   * @private
   */
  __dragStart(event, component, d3Element) {
    this.actions.drag.state = false;
    this.d3.select('use')
      .attr('xlink:href', `#${component.id}`);
    this.actions.drag.deltaX = event.x - d3Element.attr('x');
    this.actions.drag.deltaY = event.y - d3Element.attr('y');
    d3Element.attr('cursor', 'grabbing');
  }

  /**
   * Action to make on drag pending event.
   * @param {Object} event - Drag event.
   * @param {Component} component - Component related to the action.
   * @param {Object} d3Element - D3 element related to the action.
   * @private
   */
  __dragPending(event, component, element) {
    this.actions.drag.state = true;
    const x = event.x - this.actions.drag.deltaX;
    const y = event.y - this.actions.drag.deltaY;

    element.attr('x', x).attr('y', y);
    component.drawOption.x = x;
    component.drawOption.y = y;
  }

  /**
   * Action to make on drag end event.
   * @param {Object} event - Drag event.
   * @param {Component} component - Component related to the action.
   * @param {Object} d3Element - D3 element related to the action.
   * @private
   */
  __dragEnd(element) {
    element.attr('cursor', 'grab');
    this.actions.drag.state = false;
    this.actions.drag.deltaX = 0;
    this.actions.drag.deltaY = 0;
  }

  /**
   * Action to unselect current element, if no element is selected, it's doing nothing.
   * @private
   */
  __unselectComponent() {
    if (this.actions.selection.current) {
      this.d3.select(`#${this.actions.selection.current}`)
        .style('outline', '');
      this.actions.selection.current = null;
    }
  }

  /**
   * Unselect current selected element and select element by its id.
   * @param {String} id - Id of component to select.
   * @private
   */
  __selectComponent(id) {
    this.__unselectComponent();

    this.d3.select(`#${id}`)
      .style('outline', this.actions.selection.style)
      .style('outline-offset', this.actions.selection.offset);
    this.actions.selection.current = id;
  }

  /**
   * Toggle element selection by id.
   * @param {String} id - Id of component to select.
   * @private
   */
  __toggleComponentSelection(id) {
    if (this.actions.selection.current === id) {
      this.__unselectComponent();
    } else {
      this.__selectComponent(id);
    }
  }

  /**
   * Initialize all draw option of the components.
   * @param {Component[]} components - List of Components.
   * @param {Object} svgContainer - D3 Object contains components SVGs.
   */
  initializeComponents(components, svgContainer) {
    const componentsToInit = [];
    const componentMaxSize = { width: 0, height: 0 };

    svgContainer.each((_data, index, array) => {
      const component = components[index];
      if (!component.drawOption) {
        component.drawOption = new ComponentDrawOption();
        componentsToInit.push(components[index]);
      }
      this.storeComponentSize(array[index], component);
      if (component.drawOption.width > componentMaxSize.width) {
        componentMaxSize.width = component.drawOption.width;
      }
      if (component.drawOption.height > componentMaxSize.height) {
        componentMaxSize.height = component.drawOption.height;
      }
    });

    if (componentsToInit.length > 0) {
      const viewportWidth = document.querySelector('#viewport').clientWidth;
      componentsToInit.forEach((component, index) => this.setComponentPosition(
        component,
        index,
        viewportWidth,
        componentMaxSize,
      ));
    }
  }

  /**
   * Defines the position of the components by computing
   * a grid from the viewport's width and the largest component.
   * @param {Component} component - Components we want to set the position.
   * @param {Object} maxSize - Object contains the max width and height of components SVG.
   */
  setComponentPosition(component, index, viewportWidth, maxSize) {
    const { width, height } = maxSize;
    const maxColumn = parseInt(viewportWidth / (width + this.margin), 10);

    const indexX = index % maxColumn;
    const indexY = parseInt(index / maxColumn, 10);

    component.drawOption.x = indexX * (width + this.margin);
    component.drawOption.y = indexY * (height + this.margin);
  }

  /**
   * Set size of the component from the reel size of the svg model.
   * @param {Object} svgItem - HTML element selected contained svgContainer.
   * @param {Component} component - Component object we want to set the size.
   */
  storeComponentSize(svgItem, component) {
    const { width, height } = this.getComponentSize(svgItem);
    component.drawOption.width = width;
    component.drawOption.height = height;
  }

  /**
   * Return the width and height of a component SVG.
   * @param {Object} svgItem - HTML element contained by svgContainer.
   * @return {Object} Return the object that contains max width and height.
   */
  getComponentSize(svgItem) {
    const bBox = this.d3.select(svgItem).node().getBBox();
    return { width: bBox.width, height: bBox.height };
  }

  /**
   * Draw component with default template.
   * @param {Object} svgContainer - HTML elements selected by D3.js.
   */
  drawDefaultModel(svgContainer) {
    svgContainer.attr('id', (data) => data.id);
    svgContainer.attr('x', (data) => data.drawOption.x);
    svgContainer.attr('y', (data) => data.drawOption.y);
    svgContainer.attr('cursor', 'grab');
    svgContainer.select('.component-name').text((data) => data.name);
    svgContainer.select('.component-type').text((data) => data.definition.type);
  }
}

export default DefaultDrawer;
