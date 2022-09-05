import * as d3 from 'd3';
import pack from 'bin-pack';
import ComponentDrawOption from '../models/ComponentDrawOption';

/**
 * Class that draws a component in a graphical representation.
 * @interface
 */
class DefaultDrawer {
  /**
   * Default constructor
   * @param {Object} [resources=null] - Object that contains resources.
   * @param {String} [rootId="root"] - Id of HTML element where we want to draw.
   */
  constructor(resources = null, rootId = 'root') {
    /**
     * Id of HTML element where we want to draw.
     * @type {String}
     */
    this.rootId = rootId;
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
     * bin-pack library
     */
    this.pack = pack;
    /**
     * Margin value between component default position.
     * @type {Number}
     */
    this.margin = 6;
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
        deltaY: 0,
      },
    };
  }

  /**
   * Draws all Components and ComponentLinks in the parentId Element.
   * @param {Component[]} [components=[]] - List of components you want to draw.
   * @param {String} [parentId=this.rootId] - Id of the container where you want to draw.
   * @return {Boolean} Returns true if normally execute.
   */
  draw(components = [], parentId = this.rootId) {
    const d3Container = this.d3.select(parentId === this.rootId ? `#${parentId}` : `#${parentId} .container`)
      .selectAll(`.${parentId}.component`)
      .data(components, (data) => data.id);

    const d3Elements = d3Container
      .enter().append('svg');

    d3Elements
      .attr('id', (data) => data.id)
      .attr('class', (data) => `${parentId} component component-${data.definition.model}`)
      .html((data) => this.resources.models[data.definition.model]);

    this.__drawModels(components);

    components.forEach((component) => {
      this.setComponentAction(component);
      if (component.children.length > 0) {
        this.draw(component.children, component.id);
      }
    });

    this.initializeComponents(d3Elements, components, parentId);

    d3Container.exit().remove();

    this.setViewPortAction(this.d3.select(`#${parentId}`));

    return true;
  }

  /**
   * Set actions on viewport.
   * @param {Object} element - D3 element related to the actions.
   */
  setViewPortAction(element) {
    element.on('mousedown', () => {
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
   * @param {Object} element - D3 element related to the action.
   * @private
   */
  __dragStart(event, component, element) {
    this.actions.drag.state = false;
    this.d3.select('use')
      .attr('xlink:href', `#${component.id}`);
    this.actions.drag.deltaX = event.x - element.attr('x');
    this.actions.drag.deltaY = event.y - element.attr('y');
    element.attr('cursor', 'grabbing');
  }

  /**
   * Action to make on drag pending event.
   * @param {Object} event - Drag event.
   * @param {Component} component - Component related to the action.
   * @param {Object} element - D3 element related to the action.
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
   * @param {Object} element - D3 element related to the action.
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
   * Unselects current selected element and selects element by its id.
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
   * Toggles element selection by id.
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
   * Initialize all draw options of the components.
   * @param {Object} d3Elements - D3 selected elements.
   * @param {Component[]} components - List of Components.
   * @param {String} parentId - ID of parent which contains components.
   */
  initializeComponents(d3Elements, components, parentId) {
    const componentsToInit = components.filter((component) => {
      if (!component.drawOption) {
        component.drawOption = new ComponentDrawOption();
        return true;
      }
      return false;
    });

    this.storeComponentSize(components, parentId);
    const sizes = this.setContainerSize(components, parentId);
    this.setComponentPosition(componentsToInit, sizes.items);

    d3Elements
      .attr('x', (data) => data.drawOption.x)
      .attr('y', (data) => data.drawOption.y)
      .attr('width', (data) => data.drawOption.width)
      .attr('height', (data) => data.drawOption.height)
      .select('.template')
      .attr('width', '100%')
      .attr('height', '100%');
  }

  /**
   * Sets the containers sizes
   * @param {Component[]} components - Array containing components to init the drawOption.
   * @param {String} parentId - Id of the container.
   * @return {Object} - Object that contains container sizes and content positions.
   */
  setContainerSize(components, parentId) {
    let sizes = components.map((component) => ({
      width: component.drawOption.width + this.margin,
      height: component.drawOption.height + this.margin,
      id: component.id,
    }));

    sizes = this.pack(sizes);

    if (parentId !== this.rootId) {
      const containerY = parseInt(
        this.d3
          .select(`#${parentId} .component-container`)
          .attr('y'),
        10,
      );

      this.d3.select(`#${parentId} > .template`)
        .attr('width', sizes.width + this.margin * 3)
        .attr('height', sizes.height + containerY + this.margin * 2)
        .select('.component-container')
        .attr('width', sizes.width + this.margin)
        .attr('height', sizes.height + this.margin);
    }

    return sizes;
  }

  /**
   * Defines the position of the components by using bin-pack library
   * @param {Component} components - Components we want to set the position.
   * @param {Object} positions - Object that contains all positions of components to init.
   */
  setComponentPosition(components, positions) {
    components.forEach((component) => {
      const position = positions.find((element) => element.item.id === component.id);
      component.drawOption.x = position.x + this.margin;
      component.drawOption.y = position.y + this.margin;
    });
  }

  /**
   * Stores in the data the size of the component from the size of the svg model.
   * @param {Component[]} components - Array of component we want to store the size in data.
   */
  storeComponentSize(components) {
    components.forEach((component) => {
      const { width, height } = this.getComponentSize(component.id);
      component.drawOption.width = width;
      component.drawOption.height = height;
    });
  }

  /**
   * Returns the width and height of a component SVG.
   * @param {Component[]} componentId - ID of the component we want getting size.
   * @return {Object} Return the object that contains max width and height.
   */
  getComponentSize(componentId) {
    const bBox = this.d3.select(`#${componentId}`).node().getBBox();
    return { width: bBox.width, height: bBox.height };
  }

  /**
   * Calls all methods dedicated to each model.
   * @param {Components[]} components - List of components for which we want to keep the model name.
   * @private
   */
  __drawModels(components) {
    const templates = [
      ...new Set(components.map((component) => component.definition.model)),
    ];

    templates.forEach((template) => {
      const elements = this.d3.selectAll(`.component-${template}`);
      if (this[`draw${template}`]) {
        this[`draw${template}`](elements, 'init');
      }
    });
  }

  /**
   * Draws component with default template.
   * @param {Object} d3Element - D3 selected element.
   */
  drawDefaultModel(d3Element) {
    d3Element.select('.component-name').text((data) => data.name);
    d3Element.select('.component-type').text((data) => data.definition.type);
    d3Element.select('.component-icon')
      .html((data) => this.resources.icons[data.definition.icon]);
  }

  /**
   * Draws component container with default template.
   * @param {Object} d3Element - D3 selected element.
   */
  drawDefaultContainer(d3Element) {
    this.drawDefaultModel(d3Element);
  }
}
export default DefaultDrawer;
