import * as d3 from 'd3';
import nunjucks from 'nunjucks';
import ComponentDrawOption from '../models/ComponentDrawOption';
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
   * @param {Number} [options.actionMenuButtonSize] - The size of each action menu button.
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
     * The size of each action menu button.
     * @type {Number}
     */
    this.actionMenuButtonSize = options.actionMenuButtonSize || 24;
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
        offsetX: 0,
        offsetY: 0,
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
    const localSelector = `#${this.rootId} ${selector || '.component'}`;

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
        event.subject.transform = `translate(${rootSVGPoint.x - this.actions.drag.offsetX},
        ${rootSVGPoint.y - this.actions.drag.offsetY})`,
      );

    event.subject.x = rootSVGPoint.x - this.actions.drag.offsetX;
    event.subject.y = rootSVGPoint.y - this.actions.drag.offsetY;
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
      .on('start', (event) => {
        this.actions.drag.offsetX = event.x - event.subject.x0;
        this.actions.drag.offsetY = event.y - event.subject.y0;
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
   * Starting from a given node, recursively mark all parent nodes as needing a resize.
   * @param {Node} node - The node to start from.
   * @private
   */
  __markAsNeedingResize(node) {
    if (node.data.drawOption) {
      node.data.drawOption.needsResizing = true;
    }
    if (node.parent) {
      this.__markAsNeedingResize(node.parent);
    }
  }

  /**
   * Update component hierarchy and re-render.
   * @param {DragEvent} event - D3's drag event.
   * @param {Element} dropTarget - The element on which the dragged component was dropped.
   */
  handleDropEvent(event, dropTarget) {
    const origParent = this.pluginData.getComponentById(event.subject.parent.data.id);
    const target = dropTarget ? d3.select(dropTarget) : null;

    if (target === origParent) {
      const { x, y } = event.subject;
      const width = event.subject.x1 - event.subject.x0;
      const height = event.subject.y1 - event.subject.y0;

      event.subject.data.drawOption = new ComponentDrawOption({
        x, y, width, height,
      });
    } else {
      if (event.subject.parent) {
        this.__markAsNeedingResize(event.subject.parent);
      }
      event.subject.data.drawOption = null;

      if (target) {
        const parentId = target.attr('data-parentId');
        const newParent = this.pluginData.getComponentById(parentId);
        const newParentNode = d3.select(`#${parentId}`).datum();

        if (newParent.definition.childrenTypes.includes(event.subject.data.definition.type)) {
          event.subject.data.setReferenceAttribute(newParent);
          this.__markAsNeedingResize(newParentNode);
        }
      } else {
        event.subject.data.removeAllReferenceAttributes();
      }
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

    this.setViewPortAction(d3.select(`#${this.rootId}`));
  }

  /**
   * Handle component click event. Set selected style on it.
   * @param {PointerEvent} event - The click event.
   */
  clickHandler(event) {
    event.stopPropagation();
    this.__selectComponent(d3.select(event.currentTarget));
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
      .attr('x', ({ x0 }) => x0)
      .attr('y', ({ y0 }) => y0)
      .attr('transform', ({ x0, y0 }) => `translate(${x0},${y0})`);

    node
      .filter(({ data }) => data.id !== '__shadowRoot')
      .attr('class', ({ data }) => `component
        component-${data.definition.model}
        ${data.definition.type}`)
      .html(({ data }) => nunjucks.renderString(
        this.resources.models[data.definition.model],
        data,
      ))
      .select('svg')
      .attr('id', ({ data }) => `svg-${data.id}`)
      .attr('height', ({ y0, y1 }) => y1 - y0)
      .attr('width', ({ x0, x1 }) => x1 - x0);

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
    const rootNode = d3.hierarchy(
      this.shadowRoot,
      ({ id }) => this.pluginData.getChildren(id === '__shadowRoot' ? null : id),
    );

    rootNode
      .count()
      .sort((a, b) => (b.height - a.height)
        || (b.value - a.value)
        || ((b.data && b.data.definition && b.data.definition.isContainer ? 1 : 0)
          - (a.data && a.data.definition && a.data.definition.isContainer ? 1 : 0))
        || ((a.data && a.data.drawOption ? 1 : 0)
          - (b.data && b.data.drawOption ? 1 : 0)));
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
   * Get the most appropriate anchor point for a link towards the given target.
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
    const sourceCenter = this.getSelectionCenter(sourceSelection);
    const targetCenter = this.getSelectionCenter(targetSelection);

    const angle = this.getBearing(
      this.screenToSVG(sourceCenter.x, sourceCenter.y, this.svg.select('.container').node()),
      this.screenToSVG(targetCenter.x, targetCenter.y, this.svg.select('.container').node()),
    );

    const topAnchor = {
      y: sourceCoords.top,
      x: sourceCoords.x + (sourceCoords.width / 2),
    };
    const bottomAnchor = {
      y: sourceCoords.bottom,
      x: sourceCoords.x + (sourceCoords.width / 2),
    };
    const leftAnchor = {
      x: sourceCoords.left,
      y: sourceCoords.top + (sourceCoords.height / 2),
    };
    const rightAnchor = {
      x: sourceCoords.right,
      y: sourceCoords.top + (sourceCoords.height / 2),
    };
    let anchorPoint;

    if (angle < 45 || angle >= 315) {
      anchorPoint = bottomAnchor;
    } else if (angle >= 45 && angle < 135) {
      anchorPoint = rightAnchor;
    } else if (angle >= 135 && angle < 225) {
      anchorPoint = topAnchor;
    } else {
      anchorPoint = leftAnchor;
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

    const links = this.svg
      .selectAll('.link');

    links.data(pluginLinks, (data) => data)
      .join('path')
      .filter(({ source, target }) => !d3.select(`#${source}`).empty()
        && !d3.select(`#${target}`).empty())
      .classed('link', true)
      .attr('d', (link) => {
        const generator = this.getLinkGenerator(link);

        return generator(link);
      })
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .on('click', (event) => this.clickHandler(event));

    links.raise();
  }

  /**
   * Get the coordinates for a given selection's center.
   * @param {Selection} selection - The selection to find the center for.
   */
  getSelectionCenter(selection) {
    const box = selection.node().getBoundingClientRect();

    return {
      x: box.left + (box.width / 2),
      y: box.top + (box.height / 2),
    };
  }

  /**
   * Get the angle (in degrees) between two points.
   * 0 = pointB is directly below.
   * 180 = pointB is directly above.
   * @param {Object} pointA - The point to get the bearing from.
   * @param {Object} pointB - The point to get the bearing to.
   * @return {Number} - The bearing.
   */
  getBearing(pointA, pointB) {
    const normalizedTargetVector = {
      x: (pointB.x - pointA.x)
        / (Math.sqrt((pointB.x - pointA.x) ** 2 + (pointB.y - pointA.y) ** 2)),
      y: (pointB.y - pointA.y)
        / (Math.sqrt((pointB.x - pointA.x) ** 2 + (pointB.y - pointA.y) ** 2)),
    };

    return (
      (Math.atan2(
        normalizedTargetVector.x,
        normalizedTargetVector.y,
      )
      * (180 / Math.PI)) + 360)
      % 360;
  }

  /**
   * Build a new d3 link generator for a ComponentLink
   * @param {ComponentLink} link - The link to build the generator for.
   * @returns {Object} - A d3 link generator.
   */
  getLinkGenerator(link) {
    const source = d3.select(`#${link.source}`);
    const target = d3.select(`#${link.target}`);

    const sourceAnchor = this.getAnchorPoint(source, target);
    const targetAnchor = this.getAnchorPoint(target, source);

    const sourceCenter = this.getSelectionCenter(source);
    const targetCenter = this.getSelectionCenter(target);

    const angle = this.getBearing(
      this.screenToSVG(sourceCenter.x, sourceCenter.y, this.svg.select('.container').node()),
      this.screenToSVG(targetCenter.x, targetCenter.y, this.svg.select('.container').node()),
    );

    let curve;

    if (angle < 45 || angle >= 315 || (angle >= 135 && angle < 225)) {
      curve = d3.curveBumpY;
    } else {
      curve = d3.curveBumpX;
    }

    return d3.link(curve)
      .source(() => sourceAnchor)
      .target(() => targetAnchor);
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
        if (item.data.drawOption) {
          item.x0 = item.data.drawOption.x;
          item.y0 = item.data.drawOption.y;
        } else {
          item.x0 = prevItem.x1 + this.padding;
          item.y0 = previousTallestItem.y1 + this.padding;
          prevItem = item;
        }

        if (!item.data.drawOption || item.data.drawOption.needsResizing) {
          /*
           item.depth and item.height are set by d3 and represent the position of the node in
           the hierarchy:
           - height: how many layers exist below this node;
           - depth: how deep in the tree the node is
           */
          const horizontalCoefficient = Math.min(
            item.value,
            this.getLineLengthForDepth(item.depth),
          );
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

          if (item.data.drawOption) {
            item.data.drawOption.needsResizing = false;
            item.data.drawOption.width = item.x1 - item.x0;
            item.data.drawOption.height = item.y1 - item.y0;
          }
        } else {
          item.x1 = item.x0 + item.data.drawOption.width;
          item.y1 = item.y0 + item.data.drawOption.height;
        }
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
      d3.select(`#${this.rootId} .selected`)
        .classed('selected', false)
        .style('outline', '');
      this.actions.selection.current = null;
      this.hideActionMenu();
    }
  }

  /**
   * Unselects current selected element and selects a new one.
   * @param {Selection} targetSelection - Component or link to select.
   * @private
   */
  __selectComponent(targetSelection) {
    const currentComponent = targetSelection.datum().__class === 'Link'
      ? targetSelection.datum()
      : targetSelection.datum().data;
    const sameElementClicked = this.actions.selection.current === currentComponent;

    if (this.actions.linkCreation.creating) {
      if (targetSelection.node().classList.contains('disabled')) {
        return;
      }

      this.actions.linkCreation.target = currentComponent;
      this.createLink();
    } else {
      this.__unselectComponent();

      if (sameElementClicked) {
        return;
      }

      targetSelection
        .classed('selected', true)
        .style('outline', this.actions.selection.style)
        .style('outline-offset', this.actions.selection.offset);
      this.actions.selection.current = currentComponent;

      // TODO: replace by: if (this.events?.EditEvent) {
      if (this.events && this.events.EditEvent && currentComponent.__class === 'Component') {
        this.events.EditEvent.next(currentComponent);
      }

      this.initializeActionMenu(targetSelection);
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
   * Initialize the action menu for a given target.
   * @param {Selection} targetSelection - D3 selection of the target object.
   */
  initializeActionMenu(targetSelection) {
    const actionMenu = this.svg
      .select('.container')
      .append('svg')
      .attr('id', 'action-menu');

    const actions = this.getMenuActions(targetSelection);

    const zoomTransform = d3.zoomTransform(this.svg.select('.container').node());

    actionMenu
      .append('rect')
      .attr('fill', 'lightgrey')
      .attr('width', this.actionMenuButtonSize * actions.length)
      .attr('height', this.actionMenuButtonSize)
      .attr('rx', 5);

    const { bottom, width, left } = targetSelection.node().getBoundingClientRect();
    const { x, y } = this.screenToSVG(
      (left + (width / 2)) - ((this.actionMenuButtonSize * actions.length) / 2) * zoomTransform.k,
      bottom + 20,
      this.svg.select('.container').node(),
    );

    actionMenu
      .attr('x', x)
      .attr('y', y);

    const buttons = actionMenu
      .selectAll('svg')
      .data(actions)
      .join('svg')
      .attr('id', (data) => data.id)
      .attr('width', this.actionMenuButtonSize)
      .attr('height', this.actionMenuButtonSize)
      .attr('x', (_d, index) => (this.actionMenuButtonSize * index))
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('cursor', 'pointer')
      .on('click', (event, data) => {
        event.stopPropagation();
        const handler = data.handler.bind(this);

        handler(event, data);
      });

    buttons
      .append('rect')
      .classed('bg-button', true)
      .attr('fill', 'lightgrey')
      .attr('rx', 5)
      .style('width', this.actionMenuButtonSize)
      .style('height', this.actionMenuButtonSize);

    buttons
      .on('mouseenter', function onHover() {
        d3.select(this)
          .select('.bg-button')
          .attr('fill', 'grey');
      })
      .on('mouseleave', function onLeave() {
        d3.select(this)
          .select('.bg-button')
          .attr('fill', 'lightgrey');
      });

    buttons
      .append('g')
      .attr('x', 0)
      .attr('y', 0)
      .html((d) => d.icon)
      .select('svg')
      .attr('width', '80%')
      .attr('height', '80%')
      .attr('x', '10%')
      .attr('y', '10%');

    actionMenu.selectAll('button')
      .style('width', '30px')
      .style('height', '30px')
      .style('border', 'none');
  }

  /**
   * Store new link source and apply disabled style to invalid target components.
   */
  startLinkCreationInteraction() {
    if (this.actions.selection.current) {
      const source = this.pluginData.getComponentById(this.actions.selection.current.id);
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
   * Get a list of actions to fill the menu for a given target.
   * @param {Object} targetSelection - The target object.
   * @type {Object}
   * @property {String} id - Id of the action button.
   * @property {String} icon - Icon to display in the action button
   * @property {Function} handler - Function called on action click.
   * @return {MenuActions[]} - The list of menu actions.
   */
  getMenuActions(targetSelection) {
    if (targetSelection.classed('component')) {
      return [
        {
          id: 'create-link',
          icon: actionIcons.link,
          handler() {
            this.startLinkCreationInteraction();
          },
        },
        {
          id: 'remove-component',
          icon: actionIcons.trash,
          handler() {
            this.pluginData.removeComponentById(this.actions.selection.current.id);
            this.draw(this.rootId);
          },
        },
      ];
    }

    return [
      {
        id: 'remove-link',
        icon: actionIcons.trash,
        handler() {
          this.pluginData.removeLink(this.actions.selection.current);
          this.draw(this.rootId);
        },
      },
    ];
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
   * Hide the action menu.
   */
  hideActionMenu() {
    d3.select('#action-menu')
      .remove();
  }
}
export default DefaultDrawer;
