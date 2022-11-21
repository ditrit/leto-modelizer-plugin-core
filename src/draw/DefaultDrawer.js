import * as d3 from 'd3';
import actionIcons from '../assets/actions/actionIcons';
import ComponentLink from '../models/ComponentLink';

/**
 * Class that draws a component in a graphical representation.
 * @interface
 */
class DefaultDrawer {
  /**
   * Default constructor
   * @param {DefaultData} pluginData - Plugin data storage.
   * @param {Object} [resources=null] - Object that contains resources.
   * @param {Object} [events] - Events list.
   * @param {Function} [events.SelectEvent.next] - Function to emit selection event.
   * @param {Function} [events.EditEvent.next] - Function to emit edit event.
   * @param {Function} [events.DeleteEvent.next] - Function to emit delete event.
   * @param {String} [rootId="root"] - Id of HTML element where we want to draw.
   * @param {Object} [options={}] - Rendering options.
   * @param {Number} [options.width=1280] - Render svg viewbox width.
   * @param {Number} [options.height=1280] - Render svg viewbox height.
   * @param {Number} [options.minWidth=230] - Minimum width of a component.
   * @param {Number} [options.minHeight=50] - Minimum height of a component.
   * @param {Number} [options.padding=30] - Padding around a component.
   * @param {Number} [options.margin=6] - Component margin thickness.
   * @param {Number[]} [options.lineLengthPerDepth=[5,1]] - Number of components
   * per line at a given depth. Valid values: 1 - Infinity.
   */
  constructor(pluginData, resources = null, events = {
    SelectEvent: null,
    EditEvent: null,
    DeleteEvent: null,
  }, rootId = 'root', options = {}) {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.pluginData = pluginData;
    /**
     * D3 library.
     */
    this.d3 = d3;
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
     * Render svg viewbox width.
     * @type {Number}
     */
    this.width = options.width !== undefined ? options.width : 1280;
    /**
     * Render svg viewbox height.
     * @type {Number}
     */
    this.height = options.height !== undefined ? options.height : 1280;
    /**
     * Minimum width of a component.
     * @type {Number}
     */
    this.minWidth = options.minWidth !== undefined ? options.minWidth : 230;
    /**
     * Minimum height of a component.
     * @type {Number}
     */
    this.minHeight = options.minHeight !== undefined ? options.minHeight : 50;
    /**
     * Padding around components.
     * @type {Number}
     */
    this.padding = options.padding !== undefined ? options.padding : 30;
    /**
     * Component margin thickness.
     * @type {Number}
     */
    this.margin = options.margin !== undefined ? options.margin : 6;
    /**
     * Number of components per line at a given depth. Valid values: 1 - Infinity.
     * @type {Number[]}
     */
    this.lineLengthPerDepth = options.lineLengthPerDepth !== undefined
      ? options.lineLengthPerDepth : [5, 1];
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
      linkCreation: {
        source: null,
        target: null,
        creating: false,
      },
      drag: {
        state: false,
        target: null,
      },
    };

    this.setEvents(events);
  }

  /**
   * Convert screen coordinates into a given svg referential.
   * @param {Number} screenX - Screen x coordinate.
   * @param {Number} screenY - Screen y coordinate.
   * @param {SVGSVGElement} [svg=null] - SVG referential.
   * @return {DOMPoint} - The transformed coordinates.
   */
  screenToSVG(screenX, screenY, svg = null) {
    const localSvg = svg || this.svg.node();
    const pivotPoint = new DOMPoint(screenX, screenY);

    return pivotPoint.matrixTransform(localSvg.getScreenCTM().inverse());
  }

  /**
   * Convert svg coordinates into screen coordinates.
   * @param {Number} svgX - SVG x coordinate.
   * @param {Number} svgY - SVG y coordinate.
   * @param {SVGSVGElement} [svg=null] - SVG referential.
   * @return {DOMPoint} - The transformed coordinates.
   */
  SVGToScreen(svgX, svgY, svg = null) {
    const localSvg = svg || this.svg.node();
    const pivotPoint = new DOMPoint(svgX, svgY);

    return pivotPoint.matrixTransform(localSvg.getScreenCTM());
  }

  /**
   * Set events.
   * @param {Function} [events.SelectEvent.next] - Function to emit selection event.
   * @param {Function} [events.EditEvent.next] - Function to emit edit event.
   * @param {Function} [events.DeleteEvent.next] - Function to emit delete event.
   */
  setEvents(events = {
    SelectEvent: null,
    EditEvent: null,
    DeleteEvent: null,
  }) {
    this.events = {
      SelectEvent: events.SelectEvent || null,
      EditEvent: events.EditEvent || null,
      DeleteEvent: events.DeleteEvent || null,
    };
  }

  /**
   * Compute a coefficient representing how tall a component will be based on its children's layout.
   * @param {Node} item - The component to check.
   * @return {Number} - The coefficient.
   * @private
   */
  __getVerticalCoefficient(item) {
    // TODO: replace by: if (item.children?.length > 0) {
    if (item.children && item.children.length > 0) {
      const childHeights = Math.ceil(
        item.children
          // TODO: replace by: .filter((child) => child.data?.definition?.isContainer)
          .filter((child) => child
              && child.data
              && child.data.definition
              && child.data.definition.isContainer)
          .reduce(
            (acc, child) => acc + this.__getVerticalCoefficient(child),
            0,
          ),
      );
      const localChildValue = item.children
        // TODO: replace by: .filter((child) => !child.data?.definition?.isContainer)
        .filter((child) => !(child
              && child.data
              && child.data.definition
              && child.data.definition.isContainer))
        .reduce((acc, child) => acc + child.value, 0);

      return localChildValue / this.getLineLengthForDepth(item.depth)
          + childHeights
      // TODO: replace by: + (item.data?.definition?.isContainer ? 1 : 0);
          + ((item.data
              && item.data.definition
              && item.data.definition.isContainer)
            ? 1 : 0);
    }

    return item.value / this.getLineLengthForDepth(item.depth)
        // TODO: replace by: + (item.data?.definition?.isContainer ? 1 : 0);
        + ((item.data
            && item.data.definition
            && item.data.definition.isContainer)
          ? 1 : 0);
  }

  /**
   * Get the maximum line length for a given depth.
   * @param {Number} [depth] - The depth to check.
   * @return {Number} - The maximum length at that depth.
   */
  getLineLengthForDepth(depth) {
    return this.lineLengthPerDepth[Math.min(depth, this.lineLengthPerDepth.length - 1)];
  }

  /**
   * Apply the disabled style to all elements matching the selector.
   * @param {String} [selector='.component'] - CSS selector string.
   */
  setDisabledStyle(selector = '.component') {
    const localSelector = `#${this.rootId} ${selector}`;

    d3.selectAll(localSelector)
      .classed('disabled', true);
  }

  /**
   * Remove the disabled style from previously disabled components.
   */
  unsetAllDisabledStyles() {
    d3.selectAll(`#${this.rootId} .disabled`)
      .classed('disabled', false);
  }

  /**
   * Handles dragging a component across the screen and return the element it will be dropped on.
   * @param {Element} draggedElement - The DOM element being dragged.
   * @param {DragEvent} event - The emitted drag event.
   * @return {Element} - The element to drop the dragged element onto.
   */
  dragHandler(draggedElement, event) {
    this.hideActionMenu();

    const dropTarget = document
      .elementsFromPoint(event.sourceEvent.x, event.sourceEvent.y)
      .find((element) => event.subject.data.id !== element.dataset.parentId && (
        element.classList.contains('container-background')
        || element.classList.contains('container')
      ));

    const target = d3.select(`#${event.subject.data.id}`).attr('cursor', 'grabbing');

    d3.select('#root-components')
      .append(() => target.node());

    const rootSVGPoint = this.screenToSVG(
      event.sourceEvent.clientX,
      event.sourceEvent.clientY,
      this.svg.select('.container').node(),
    );

    d3.select(draggedElement)
      .attr(
        'transform',
        event.subject.transform = `translate(${rootSVGPoint.x},${rootSVGPoint.y})`,
      );

    if (event.subject.data.definition) {
      const forbiddenTypes = event.subject.data.definition.parentTypes
        .map((type) => `.component:not(#${event.subject.data.id}):not(.${type})`)
        .join(',');

      this.setDisabledStyle(forbiddenTypes);
    }

    this.drawLinks();

    return dropTarget;
  }

  /**
   * Create and return d3 drag behaviour.
   * @return {Function} - D3 drag behaviour.
   */
  setupDragBehavior() {
    let dropTarget = null;
    let itemWasDragged = false;
    const dragHandler = this.dragHandler.bind(this);

    return d3.drag()
      .subject((event) => {
        const target = document.elementFromPoint(event.sourceEvent.x, event.sourceEvent.y);
        const targetData = d3.select(target);

        return targetData.datum();
      })
      .on('drag', function dragged(event) {
        dropTarget = dragHandler(this, event);
        itemWasDragged = true;
      })
      .on('end', (event) => {
        if (itemWasDragged) {
          this.handleDropEvent(event, dropTarget);
        }
      });
  }

  /**
   * Update component hierarchy and re-render.
   * @param {DragEvent} event - D3's drag event.
   * @param {Element} dropTarget - The element on which the dragged component was dropped.
   */
  handleDropEvent(event, dropTarget) {
    const origParent = this.pluginData.getComponentById(event.subject.parent.data.id)
        || this.shadowRoot;
    const origIndex = origParent.children.findIndex((child) => child.id === event.subject.data.id);
    const target = dropTarget ? d3.select(dropTarget) : null;

    if (target) {
      const parentId = target.attr('data-parentId');
      const newParent = this.pluginData.getComponentById(parentId);

      if (newParent.definition.childrenTypes.includes(event.subject.data.definition.type)) {
        origParent.children.splice(origIndex, 1);
        event.subject.data.setReferenceAttribute(newParent);
        newParent.children.push(event.subject.data);
      }
    } else {
      origParent.children.splice(origIndex, 1);
      event.subject.data.removeAllReferenceAttributes();
      this.pluginData.components.push(event.subject.data);
    }
    this.draw(this.rootId);
  }

  /**
   * Create a new svg to render the models in, or fetch an existing one.
   */
  createRenderingContext() {
    const contextIsPresent = !d3.select(`#${this.rootId}>svg`).empty();

    if (!contextIsPresent) {
      this.svg = d3.select(`#${this.rootId}`)
        .append('svg')
        .attr('viewBox', [0, 0, this.width, this.height])
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .style('font', '10px sans-serif');
      this.svg.append('g')
        .attr('class', 'container')
        .attr('height', '100%')
        .attr('width', '100%')
        .attr('x', 0)
        .attr('y', 0);
    } else {
      this.svg = d3.select(`#${this.rootId}`)
        .select('svg');
    }
  }

  /**
   * Draws all Components and ComponentLinks in the parentId Element.
   * @param {String} rootId - Id of the container where you want to draw.
   */
  draw(rootId) {
    this.rootId = rootId;
    this.createRenderingContext();

    this.__unselectComponent();

    this.drawComponents();

    this.drawLinks();
    this.initializeActionMenu();

    this.setViewPortAction(d3.select(`#${this.rootId}`));
  }

  /**
   * Handle component click event. Set selected style on it.
   * @param {PointerEvent} event - The click event.
   * @param {Node} data - The clicked component data.
   */
  clickHandler(event, data) {
    event.stopPropagation();
    this.__selectComponent(data.data.id);
  }

  /**
   * Render components in model view.
   */
  drawComponents() {
    this.shadowRoot = { children: this.pluginData.components, id: '__shadowRoot', name: '' };
    const groupedNodes = this.buildTree();
    const clicked = this.clickHandler.bind(this);
    const drag = this.setupDragBehavior();
    const node = this.svg
      .select('.container')
      .selectAll('g')
      .data(groupedNodes, (data) => data)
      .join('g')
      .attr('id', ([data]) => data)
      .selectAll('g')
      .data(([, data]) => data)
      .join('g')
      .attr('id', ({ data }) => data.id)
      .on('click', clicked)
      .call(drag)
      .attr('transform', ({ x0, y0 }) => `translate(${x0},${y0})`);

    node
      .filter(({ data }) => data.id !== '__shadowRoot')
      .attr('class', ({ data }) => `component
        component-${data.definition.model}
        ${data.definition.type}`)
      .html(({ data }) => this.resources.models[data.definition.model])
      .select('svg')
      .attr('id', ({ data }) => `svg-${data.id}`)
      .attr('height', ({ y0, y1 }) => y1 - y0)
      .attr('width', ({ x0, x1 }) => x1 - x0);

    node.select('.component-name')
      .text(({ data }) => data.name);
    node.select('.component-type')
      .text(({ data }) => data.definition.type);
    node.select('.component-icon')
      .html(({ data }) => this.resources.icons[data.definition.icon]);

    node.select('rect')
    // TODO replace by: .filter((d) => d.data?.definition?.isContainer)
      .filter((d) => d.data
          && d.data.definition
          && d.data.definition.isContainer)
      .attr('height', ({ y0, y1 }) => y1 - y0)
      .attr('width', ({ x0, x1 }) => x1 - x0);

    node.select('.component-container')
      .attr('height', ({ y0, y1 }) => Math.max(
        y1 - (y0 + this.minHeight) - this.margin,
        this.minHeight,
      ))
      .attr('width', ({ x0, x1 }) => Math.max(x1 - x0 - 2 * this.margin, this.minWidth))
      .attr('x', () => this.margin)
      .attr('y', () => this.minHeight)
      .filter(({ children }) => children)
      .append(({ data }) => d3.select(`#group-${data.id}`).node());

    node.select('.component-container>rect').attr('data-parentId', ({ data }) => data.id);
  }

  /**
   * Build d3 hierarchy and treemap layout.
   * @return {[String, Node[]][]} - The nodes grouped by parent.
   */
  buildTree() {
    const treemapLayout = d3.treemap()
      .size([this.width, this.height])
      .tile((data) => {
        const lines = this.__buildLines(data);

        this.setupTiles(lines);
        // TODO save/load coordinates
      })
      .round(true);
    const rootNode = d3.hierarchy(this.shadowRoot);

    rootNode
      .count()
      .sort((a, b) => (b.height - a.height)
        || (b.value - a.value)
        || ((b.data && b.data.definition && b.data.definition.isContainer ? 1 : 0)
        - (a.data && a.data.definition && a.data.definition.isContainer ? 1 : 0)));
    /* TODO replace above by: || (b.data.definition?.isContainer || 0)
            - (a.data.definition?.isContainer || 0)); */

    treemapLayout(rootNode);

    return d3.groups(
      rootNode,
      ({ parent }) => (parent
        && parent.data.id !== '__shadowRoot'
        ? `group-${parent.data.id}`
        : 'root-components'),
    ).filter(([data]) => data !== 'root-__shadowRoot');
  }

  /**
   * Get the anchor point on source selection facing target selection.
   * @param {Selection} sourceSelection - The source D3 selection object.
   * @param {Selection} targetSelection - The target D3 selection object.
   * @return {Number[]|null} - Tuple representing x,y coordinates,
   * null if lacking source and/or target. Format required by d3.
   */
  getAnchorPoint(sourceSelection, targetSelection) {
    if (sourceSelection.empty() || targetSelection.empty()) {
      return null;
    }

    const sourceCoords = sourceSelection.node().getBoundingClientRect();
    const targetCoords = targetSelection.node().getBoundingClientRect();
    const anchorPoint = {
      x: sourceCoords.x,
      y: sourceCoords.top + (sourceCoords.height / 2),
    };

    if (targetCoords.right < sourceCoords.left) {
      anchorPoint.x = sourceCoords.left;
    } else {
      anchorPoint.x = sourceCoords.right;
    }

    const { x, y } = this.screenToSVG(anchorPoint.x, anchorPoint.y);

    return [x, y];
  }

  /**
   * Render links in model view.
   */
  drawLinks() {
    const pluginLinks = this.pluginData.getLinks();

    if (!pluginLinks) {
      return;
    }

    const linkGen = d3.link(d3.curveBumpX)
      .source(({ source, target }) => this.getAnchorPoint(
        d3.select(`#${source}`),
        d3.select(`#${target}`),
      ))
      .target(({ source, target }) => this.getAnchorPoint(
        d3.select(`#${target}`),
        d3.select(`#${source}`),
      ));

    const links = this.svg
      .selectAll('.link');

    links.raise();

    links.data(pluginLinks, (data) => data)
      .join('path')
      .filter(({ source, target }) => !d3.select(`#${source}`).empty()
            && !d3.select(`#${target}`).empty())
      .classed('link', true)
      .attr('d', linkGen)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);
  }

  /**
   * Compute the dimension of every component.
   * @param {Array} lines - Rows of components.
   */
  setupTiles(lines) {
    let previousTallestItem = { x1: 0, y1: 0 };

    lines.forEach((line, lineIndex) => {
      let prevItem = {
        x1: 0,
        y0: lineIndex * this.minHeight + this.padding,
      };

      line.items.forEach((item) => {
        item.x0 = prevItem.x1 + this.padding;
        item.y0 = previousTallestItem.y1 + this.padding;

        /*
         item.depth and item.height are set by d3 and represent the position of the node in
         the hierarchy:
         - height: how many layers exist below this node;
         - depth: how deep in the tree the node is
         */
        const horizontalCoefficient = Math.min(item.value, this.getLineLengthForDepth(item.depth));
        const verticalCoefficient = Math.ceil(this.__getVerticalCoefficient(item));

        item.x1 = item.x0 + (horizontalCoefficient * (this.minWidth + 2 * this.margin))
            + (item.height * 2 * this.padding)
            + (horizontalCoefficient - 1)
            * (this.padding + 2 * this.margin);

        item.y1 = item.y0
            + (verticalCoefficient * this.minHeight)
            + (item.height * this.padding)
            + (verticalCoefficient - 1)
            * (this.padding + this.margin);

        prevItem = item;
      });
      if (line.items.length > 0) {
        const maxLineValue = Math.max(...line.items.map((item) => item.value));

        previousTallestItem = line.items.find((item) => item.value === maxLineValue);
      }
    });
  }

  /**
   * Build and fill the layout lines for a Node.
   * @param {Node} data - The Node to build lines for.
   * @return {[{total: number, items: Node[]}]} - A list of lines.
   * @private
   */
  __buildLines({ children, depth }) {
    const lines = [{ total: 0, items: [] }];
    let activeLineIndex = 0;
    let activeLine = lines[activeLineIndex];

    children.forEach((child) => {
      if (activeLine.items.length >= this.getLineLengthForDepth(depth)) {
        lines.push({ total: 0, items: [] });
        activeLineIndex += 1;
      }
      activeLine = lines[activeLineIndex];
      activeLine.total += child.value;
      activeLine.items.push(child);
    });

    return lines;
  }

  /**
   * Set actions on viewport.
   * @param {Object} element - D3 element related to the actions.
   */
  setViewPortAction(element) {
    this.svg.on('click', () => {
      this.__unselectComponent();
      this.cancelLinkCreationInteraction();
    });
    const drawLinks = this.drawLinks.bind(this);

    element.call(d3
      .zoom()
      .on('zoom', function zoomHandler(event) {
        d3.select(this).select('.container').attr('transform', event.transform);
        drawLinks();
      }));
  }

  /**
   * Action to unselect current element.
   * If no element is selected, does nothing.
   * @private
   */
  __unselectComponent() {
    if (this.actions.selection.current) {
      this.d3.select(`#${this.actions.selection.current}`)
        .style('outline', '');
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
    const currentComponent = this.d3.select(`#${id}`);
    const sameElementCliked = this.actions.selection.current === id;

    if (this.actions.linkCreation.creating) {
      if (currentComponent.node().classList.contains('disabled')) {
        return;
      }

      this.actions.linkCreation.target = currentComponent.datum().data;
      this.createLink();
    } else {
      this.__unselectComponent();

      if (sameElementCliked) {
        return;
      }

      currentComponent
        .style('outline', this.actions.selection.style)
        .style('outline-offset', this.actions.selection.offset);
      this.actions.selection.current = id;

      // TODO: replace by: if (this.events?.EditEvent) {
      if (this.events && this.events.EditEvent) {
        this.events.EditEvent.next(currentComponent.datum().data);
      }

      this.displayActionMenu(currentComponent.node().getBoundingClientRect());
    }
  }

  /**
   * Create a link between the previously selected source and destination.
   */
  createLink() {
    const { source, target } = this.actions.linkCreation;
    const activeLinkType = this.pluginData.definitions.links
      .find((definition) => definition.sourceRef === source.definition.type
            && definition.targetRef === target.definition.type);

    const newLink = new ComponentLink({
      source: source.id,
      target: target.id,
      definition: activeLinkType,
    });

    this.actions.linkCreation.source.setLinkAttribute(newLink);

    this.cancelLinkCreationInteraction();

    this.drawLinks();
  }

  /**
   * Initialize the action menu.
   */
  initializeActionMenu() {
    if (!document.querySelector('#action-menu')) {
      const actionMenu = d3.select(`#${this.rootId}`)
        .append('div')
        .attr('id', 'action-menu');

      actionMenu
        .append('button')
        .attr('class', 'link')
        .html(actionIcons.link)
        .on('click', () => {
          this.startLinkCreationInteraction();
        });

      actionMenu
        .append('button')
        .attr('class', 'trash')
        .html(actionIcons.trash)
        .on('click', () => {
          this.pluginData.removeComponentById(this.actions.selection.current);
          this.draw(this.rootId);
        });

      actionMenu
        .style('position', 'fixed')
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
   * Store new link source and apply disabled style to invalid target components.
   */
  startLinkCreationInteraction() {
    if (this.actions.selection.current) {
      const source = this.pluginData.getComponentById(this.actions.selection.current);
      const allowedLinkTargets = source.definition.definedAttributes
        .filter((a) => a.type === 'Link');
      const forbiddenTypes = allowedLinkTargets
        .map((linkTarget) => `.component:not(#${source.id}):not(.${linkTarget.linkRef})`)
        .join(',');

      this.actions.linkCreation.creating = true;
      this.actions.linkCreation.source = source;
      this.setDisabledStyle(forbiddenTypes);
    }
  }

  /**
   * Handle link creation being cancelled.
   */
  cancelLinkCreationInteraction() {
    this.actions.linkCreation.creating = false;
    this.actions.linkCreation.source = null;
    this.actions.linkCreation.target = null;
    this.unsetAllDisabledStyles();
  }

  /**
   * Display and positioning of the action menu.
   * @param {Object} position - Data of the component's position that the target of action menu.
   * @param {position.top} position.top - Viewport top position of the component.
   * @param {position.left} position.left - Viewport left position of the component.
   * @param {position.width} position.width - Width of the component.
   * @param {position.height} position.height - Height of the component.
   */
  displayActionMenu({
    left,
    width,
    bottom,
  }) {
    this.d3.select('#action-menu')
      .style('visibility', 'visible')
      .style('top', `${bottom + 10}px `)
      .style('left', `${left + width / 2}px`);
  }

  /**
   * Hide the action menu.
   */
  hideActionMenu() {
    this.d3.select('#action-menu')
      .style('visibility', 'hidden');
  }
}
export default DefaultDrawer;
