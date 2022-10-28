import * as d3 from 'd3';
import pack from 'bin-pack';
import interact from 'interactjs';
import ComponentDrawOption from '../models/ComponentDrawOption';
import ComponentLink from '../models/ComponentLink';
import actionIcons from '../assets/actions/actionsIcons';

/**
 * Class that draws a component in a graphical representation.
 * @interface
 */
class DefaultDrawer {
  /**
   * Default constructor
   * @param {Object} [resources=null] - Object that contains resources.
   * @param {String} [rootId="root"] - Id of HTML element where we want to draw.
   * @param {Object} [events] - Events list.
   * @param {Function} [events.SelectEvent.next] - Function to emit selection event.
   * @param {Function} [events.EditEvent.next] - Function to emit edit event.
   * @param {Function} [events.DeleteEvent.next] - Function to emit delete event.
   */
  constructor(resources = null, rootId = 'root', events = {
    SelectEvent: null,
    EditEvent: null,
    DeleteEvent: null,
  }) {
    /**
     * D3 library.
     */
    this.d3 = d3;
    /**
     * bin-pack library
     */
    this.pack = pack;
    /**
     * interactjs library
     */
    this.interact = interact;
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
        startX: 0,
        startY: 0,
      },
    };
    /**
     * Object to store all events.
     * @type {{DeleteEvent: null, EditEvent: null, SelectEvent: null}}
     */
    this.events = {
      SelectEvent: events.SelectEvent || null,
      EditEvent: events.EditEvent || null,
      DeleteEvent: events.DeleteEvent || null,
    };
  }

  /**
   * Draws all Components and ComponentLinks in the parentId Element.
   * @param {Component[]} [components=[]] - List of components you want to draw.
   * @param {String} [parentId=this.rootId] - Id of the container where you want to draw.
   * @param {ComponentLink[]} [links=[]] - List of links you want to draw.
   * @return {Boolean} Returns true if normally execute.
   */
  draw(components = [], parentId = this.rootId, links = null) {
    this.drawComponents(components, parentId, links);
    this.drawLinks(links);
  }

  /**
   * Draws all Links.
   * @param {ComponentLink[]} links - List of links you want to draw.
   * @return {Boolean} Returns true if normally execute.
   */
  drawLinks(links) {
    if (!links) return;

    if (document.querySelector('.test') === null) {
      this.d3.select(`#${this.rootId}`)
        .append('g')
        .classed('test', true);
    }

    const linkGen = this.d3.linkHorizontal()
      .source((data) => this.getAnchorPosition(data).source)
      .target((data) => this.getAnchorPosition(data).target);

    this.d3.select('.test')
      .selectAll('.link')
      .data(links)
      .join('path')
      .classed('link', true)
      .attr('d', linkGen)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);
  }

  /**
   * Draws all Components in the parentId Element.
   * @param {Component[]} components - List of components you want to draw.
   * @param {String} parentId - Id of the container where you want to draw.
   * @param {ComponentLink[]} links - List of links you want to draw.
   * @return {Boolean} Returns true if normally execute.
   */
  drawComponents(components, parentId, links) {
    const d3Container = this.d3.select(parentId === this.rootId ? `#${parentId}` : `#${parentId} .component-container`)
      .selectAll(`.${parentId}.component`)
      .data(components, (data) => data.id);

    const d3Elements = d3Container
      .enter().append('svg');

    d3Elements
      .attr('id', (data) => data.id)
      .attr('class', (data) => `${parentId} ${data.definition.type} component component-${data.definition.model} ${data.definition.isContainer ? 'isContainer' : ''}`)
      .html((data) => this.resources.models[data.definition.model]);

    this.__drawModels(components, parentId);

    components.forEach((component) => {
      this.setSelectionAction(component, components, links);
      if (component.children.length > 0) {
        this.drawComponents(component.children, component.id, links);
      }
    });

    this.initializeComponents(d3Elements, components, parentId);
    if (parentId === this.rootId) {
      this.setComponentAction(components, links);
      this.setViewPortAction(this.d3.select(`#${this.rootId}`));
    }

    this.d3.select(parentId === this.rootId ? `#${parentId}` : `#${parentId} .component-container`)
      .selectAll(`.${parentId}.component`)
      .attr('x', (data) => data.drawOption.x)
      .attr('y', (data) => data.drawOption.y);

    d3Container.exit().remove();

    this.initializeActionMenu();
    return true;
  }

  /**
   * Get the position of the anchors attached to the link.
   * @param link - the link we want to set the source and target anchors positions.
   * @returns {{source: number[], target: number[]}}
   */
  getAnchorPosition(link) {
    const { sourceAnchor, targetAnchor } = this.getDefaultAnchor(link);

    const root = document.querySelector(`#${this.rootId}`)
      .getBoundingClientRect();
    const { x: sourceX, y: sourceY } = document.querySelector(`#${link.source} > .template > [anchor=${sourceAnchor}]`)
      .getBoundingClientRect();
    const { x: targetX, y: targetY } = document.querySelector(`#${link.target} > .template > [anchor=${targetAnchor}]`)
      .getBoundingClientRect();

    return {
      source: [sourceX - root.left, sourceY - root.top],
      target: [targetX - root.left, targetY - root.top],
    };
  }

  /**
   * Get the anchors we want to attach to the link.
   * @param {ComponentLink} link - the link we want to set the source and target anchors.
   * @returns {{sourceAnchor: string, targetAnchor: string, type: string}
   *          |{sourceAnchor: null, targetAnchor: null, type: null}}
   */
  getDefaultAnchor(link) {
    const source = document.querySelector(`#${link.source}`)
      .getBoundingClientRect();
    const target = document.querySelector(`#${link.target}`)
      .getBoundingClientRect();

    if (target.x > (source.x + source.width)) {
      return {
        sourceAnchor: 'right',
        targetAnchor: 'left',
      };
    } if ((target.x + target.width) < source.x) {
      return {
        sourceAnchor: 'left',
        targetAnchor: 'right',
      };
    } if ((target.x + target.width) > source.x && target.x < (source.x + source.width)) {
      if (target.y > (source.y + source.height)) {
        return {
          sourceAnchor: 'bottom',
          targetAnchor: 'top',
        };
      } if ((target.y + target.height) < source.y) {
        return {
          sourceAnchor: 'top',
          targetAnchor: 'bottom',
        };
      }
    }
    return {
      sourceAnchor: 'top',
      targetAnchor: 'top',
    };
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
   * Set selection actions on component.
   * @param {Component} component - Component to set selection actions.
   * @param {Component[]} components - Components needed to set links anchors.
   * @param {ComponentLink[]} links - links to update on drag.
   */
  setSelectionAction(component, components, links) {
    const element = this.d3.select(`#${component.id}`);
    element.call(
      this.d3.drag()
        .on('start', () => {
          this.actions.drag.state = false;
        })
        .on('drag', (_event, data) => {
          this.__selectComponent(data.id);
          this.actions.drag.state = true;
          this.drawLinks(links);
        })
        .on('end', (_event, data) => {
          if (!this.actions.drag.state) {
            this.__toggleComponentSelection(data.id);
          }
          this.actions.drag.state = false;
        }),
    );
  }

  /**
   * Set actions on component.
   * @param {Component[]} components - Array containing components.
   * @param {ComponentLink[]} links - List of links you want to draw.
   */
  setComponentAction(components, links) {
    this.__drag(components, links);
    this.__dropToRoot(components, links);
    components.forEach((component) => {
      if (component.definition.isContainer) {
        this.__dropToContainer(components, component, links);
      }
    });

    this.interact('#action-menu .trash').unset();
    this.interact('#action-menu .trash').on('click', () => {
      this.__deleteComponent(this.actions.selection.current);
    });

    this.interact('#action-menu .edit').unset();
    this.interact('#action-menu .edit').on('click', () => {
      this.__editComponent(this.actions.selection.current);
    });

    document.querySelector('#action-menu .link')
      .addEventListener('click', () => { this.__addLink(links); });
  }

  /**
   * Delete component
   * @private
   */
  __deleteComponent(componentId) {
    if (this.events.DeleteEvent) {
      this.events.DeleteEvent.next({
        id: componentId,
      });
    }
  }

  /**
   * Add a link between two components
   * @param {ComponentLink[]} links - Array that contains all links.
   * @private
   */
  __addLink(links) {
    const source = this.actions.selection.current;

    this.d3.selectAll('.component')
      .on('click', (event) => {
        if (source !== event.currentTarget.id) {
          links.push(new ComponentLink({ source, target: event.currentTarget.id }));
          this.drawLinks(links);
        }

        this.d3.selectAll('.component')
          .on('click', null);
      });
  }

  /**
   * Edit component
   * @private
   */
  __editComponent(componentId) {
    if (this.events.EditEvent) {
      this.events.EditEvent.next({
        id: componentId,
      });
    }
  }

  /**
   * Set drag action.
   * @private
   */
  __drag() {
    this.interact('.component').unset();
    this.interact('.component').draggable({
      onstart: (event) => {
        this.actions.drag.startX = this.d3.select(`#${event.target.id}`).datum().drawOption.x;
        this.actions.drag.startY = this.d3.select(`#${event.target.id}`).datum().drawOption.y;
      },
      onmove: (event) => {
        this.actions.drag.state = true;
        const component = this.d3.select(`#${event.target.id}`);

        component.datum().drawOption.x += event.dx;
        component.datum().drawOption.y += event.dy;

        component
          .attr('x', (data) => data.drawOption.x)
          .attr('y', (data) => data.drawOption.y);
      },
    });
  }

  /**
   * Set action to drop component from a container component to the root element.
   * @param {Component[]} components - Array containing components.
   * @param {ComponentLink[]} links - List of links you want to draw.
   * @private
   */
  __dropToRoot(components, links) {
    this.interact(`#${this.rootId}`).unset();
    this.interact(`#${this.rootId}`).dropzone({
      accept: '.component',
      overlap: 'pointer',
      ondrop: (event) => {
        const currentComponent = this.d3.select(`#${event.relatedTarget.id}`);

        if (![...currentComponent.node().classList].includes(this.rootId)) {
          this.hideActionMenu();

          const container = this.d3.select(`#${currentComponent.node().classList[0]}`).datum();

          components.push(currentComponent.datum());
          currentComponent.datum().unsetContainerAttribute((container));
          container.children = container.children
            .filter((child) => child.id !== event.relatedTarget.id);

          container.children.forEach((child) => { child.drawOption = null; });
          this.drawComponents(container.children, container.id, links);

          this.__resetDrawOption(components, currentComponent, links);
        }
        this.drawLinks(links);
      },
    });
  }

  /**
   * Set action to drop component in a container component.
   * @param {Component[]} components - Array containing components.
   * @param {Component} component - Component to set drop action.
   * @param {ComponentLink[]} links - List of links you want to draw.
   * @private
   */
  __dropToContainer(components, component, links) {
    let invalidDropzones;
    let currentComponent;
    let initialPosition;
    this.interact(`#${component.id}`).unset();
    this.interact(`#${component.id}`).dropzone({
      accept: '.component',
      overlap: 'pointer',
      ondropactivate: (event) => {
        currentComponent = this.d3.select(`#${event.relatedTarget.id}`);
        invalidDropzones = [];
        if (currentComponent.datum().definition.isContainer) {
          this.__getChildrenContainer(currentComponent.datum().children, invalidDropzones);
        }
        initialPosition = currentComponent.node().getBoundingClientRect();
      },
      ondrop: (event) => {
        if (invalidDropzones.includes(event.target.id)) {
          this.drawLinks(links);
          return;
        }
        if (!component.definition.childrenTypes
          .includes(currentComponent.datum().definition.type)) {
          const { startX, startY } = this.actions.drag;
          currentComponent.datum().drawOption.x = startX;
          currentComponent.datum().drawOption.y = startY;
          this.displayActionMenu(initialPosition);
          this.draw(components, this.rootId, links);
          return;
        }

        this.hideActionMenu();

        const dropzone = this.d3.select(`#${event.target.id}`).datum();
        currentComponent.datum().unsetAllContainerAttribute();
        currentComponent.datum().setContainerAttribute(dropzone);

        if ([...currentComponent.node().classList].includes(this.rootId)) {
          dropzone.children.push(currentComponent.datum());

          for (let i = 0; i < components.length; i += 1) {
            if (components[i].id === currentComponent.datum().id) {
              components.splice(i, 1);
              break;
            }
          }

          this.__resetDrawOption(components, currentComponent, links);
        } else if (currentComponent.node().classList[0] !== event.target.id) {
          const container = this.d3.select(`#${currentComponent.node().classList[0]}`).datum();
          dropzone.children.push(currentComponent.datum());

          container.children = container.children
            .filter((child) => child.id !== event.relatedTarget.id);

          container.children.forEach((child) => { child.drawOption = null; });
          this.drawComponents(container.children, container.id, links);

          this.__resetDrawOption(components, currentComponent, links);
        }
        this.drawLinks(links);
      },
    });
  }

  /**
   * Action to unselect current element, if no element is selected, it's doing nothing.
   * @private
   */
  __unselectComponent() {
    if (this.actions.selection.current) {
      this.d3.select(`#${this.actions.selection.current}`)
        .style('outline', '');
      if (this.events.SelectEvent) {
        this.events.SelectEvent.next({
          isSelected: false,
          id: this.actions.selection.current,
        });
      }
      this.actions.selection.current = null;
      this.hideActionMenu();
    }
  }

  /**
   * Unselects current selected element and selects element by its id.
   * @param {String} id - Id of component to select.
   * @private
   */
  __selectComponent(id) {
    this.__unselectComponent();

    const currentComponent = this.d3.select(`#${id}`);

    this.displayActionMenu(currentComponent.node().getBoundingClientRect());

    currentComponent
      .style('outline', this.actions.selection.style)
      .style('outline-offset', this.actions.selection.offset);
    this.actions.selection.current = id;
    if (this.events.SelectEvent) {
      this.events.SelectEvent.next({
        isSelected: true,
        id,
      });
    }
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
   * Initialize the action menu.
   */
  initializeActionMenu() {
    if (document.querySelector('#action-menu') === null) {
      const viewport = this.d3.select('#viewport');
      const actionMenu = viewport.append('div')
        .attr('id', 'action-menu');

      actionMenu
        .append('button')
        .attr('class', 'edit')
        .html(actionIcons.edit);

      actionMenu
        .append('button')
        .attr('class', 'link')
        .html(actionIcons.link);

      actionMenu
        .append('button')
        .attr('class', 'trash')
        .html(actionIcons.trash);

      actionMenu
        .style('position', 'absolute')
        .style('top', 0)
        .style('left', 0)
        .style('overflow', 'hidden')
        .style('border-radius', '5px')
        .style('visibility', 'hidden')
        .style('transform', 'translateX(-50%)');

      actionMenu.selectAll('button')
        .style('width', '30px')
        .style('height', '30px')
        .style('border', 'none');

      actionMenu.selectAll('svg')
        .style('width', '20px')
        .style('height', '20px');
    }
  }

  /**
   * Display and positioning of the action menu.
   * @param {Object} position - Data of the component's position that the target of action menu.
   * @param {position.top} position.top - Viewport top position of the component.
   * @param {position.left} position.left - Viewport left position of the component.
   * @param {position.width} position.width - Width of the component.
   * @param {position.height} position.height - Height of the component.
   */
  displayActionMenu(position) {
    const {
      top, left,
      width, height,
    } = position;

    this.d3.select('#action-menu')
      .style('visibility', 'visible')
      .style('top', `${top + height + 10}px `)
      .style('left', `${left + width / 2}px`);
  }

  /**
   * Hide the action menu
   */
  hideActionMenu() {
    this.d3.select('#action-menu')
      .style('visibility', 'hidden');
  }

  /**
   * Get all container id from a container component
   * @param {Component[]} children - Array containing components.
   * @param {Array} array - Array that get all container id.
   * @private
   */
  __getChildrenContainer(children, array) {
    children.forEach((child) => {
      if (child.definition.isContainer) {
        array.push(child.id);
        this.__getChildrenContainer(child.children, array);
      }
    });
  }

  /**
   * Reset all components drawOption.
   * @param {Component[]} components - Array containing components.
   * @param {Component} currentComponent - Component that was droped.
   * @param {ComponentLink[]} links - List of links you want to draw.
   * @private
   */
  __resetDrawOption(components, currentComponent, links) {
    this.d3.selectAll('.component').each((data) => { data.drawOption = null; });
    currentComponent.datum().drawOption = null;
    this.draw(components, this.rootId, links);
  }

  /**
   * Initialize all draw options of the components.
   * @param {Object} d3Elements - D3 selected elements.
   * @param {Component[]} components - List of Components.
   * @param {String} parentId - ID of parent which contains components.
   */
  initializeComponents(d3Elements, components, parentId) {
    const componentsToInit = components.filter((component) => {
      if (component.drawOption === null) {
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
      if (this.d3.select(`#${parentId}`).datum().children.length > 0) {
        const containerY = parseInt(
          this.d3
            .select(`#${parentId} .component-container`)
            .attr('y'),
          10,
        );

        this.d3.select(`#${parentId}`)
          .attr('width', sizes.width + this.margin * 4)
          .attr('height', sizes.height + containerY + this.margin * 3)

          .select('.template')
          .attr('width', sizes.width + this.margin * 3)
          .attr('height', sizes.height + containerY + this.margin * 2)

          .select('.component-container')
          .attr('width', sizes.width + this.margin)
          .attr('height', sizes.height + this.margin);
      } else {
        const containerY = parseInt(
          this.d3
            .select(`#${parentId} .component-container`)
            .attr('y'),
          10,
        );

        this.d3.select(`#${parentId}`)
          .attr('width', 230)
          .attr('height', sizes.height + containerY + this.margin * 3)

          .select('.template')
          .attr('width', 230)
          .attr('height', sizes.height + containerY + this.margin * 3)

          .select('.component-container')
          .attr('width', 230 - this.margin * 2)
          .attr('height', sizes.height + this.margin * 2);
      }
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
  __drawModels(components, parentId) {
    const templates = [
      ...new Set(components.map((component) => component.definition.model)),
    ];

    templates.forEach((template) => {
      const elements = this.d3.selectAll(`.${parentId}.component-${template}`);
      if (this[`draw${template}`]) {
        this[`draw${template}`](elements);
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
