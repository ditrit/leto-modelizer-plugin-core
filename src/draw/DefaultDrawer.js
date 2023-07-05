import * as d3 from 'd3';
import nunjucks from 'nunjucks';
import ComponentDrawOption from '../models/ComponentDrawOption';
import actionIcons from '../assets/actions/actionIcons';
import ComponentLink from '../models/ComponentLink';

/**
 * Class that draws a component in a graphical representation.
 */
class DefaultDrawer {
  /**
   * Default constructor
   * @param {DefaultData} pluginData - Plugin data storage.
   * @param {object} [resources] - Object that contains resources.
   * @param {string} [rootId] - Id of HTML element where we want to draw.
   * @param {object} [options] - Rendering options.
   * @param {number} [options.minWidth] - Minimum width of a component.
   * @param {number} [options.minHeight] - Minimum height of a component.
   * @param {number} [options.padding] - Padding around a component.
   * @param {number} [options.margin] - Component margin thickness.
   * @param {number[]} [options.lineLengthPerDepth] - Number of components
   * per line at a given depth. Valid values: 1 - Infinity.
   * @param {number} [options.actionMenuButtonSize] - The size of each action menu button.
   */
  constructor(pluginData, resources = null, rootId = 'root', options = {}) {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.pluginData = pluginData;
    /**
     * Id of HTML element where we want to draw.
     * @type {string}
     * @default 'root'
     */
    this.rootId = rootId || 'root';
    /**
     * Object that contains resources.
     * @type {object}
     */
    this.resources = resources;
    /**
     * Minimum width of a component.
     * @type {number}
     * @default 230
     */
    this.minWidth = options.minWidth !== undefined ? options.minWidth : 230;
    /**
     * Minimum height of a component.
     * @type {number}
     * @default 50
     */
    this.minHeight = options.minHeight !== undefined ? options.minHeight : 50;
    /**
     * Padding around components.
     * @type {number}
     * @default 30
     */
    this.padding = options.padding !== undefined ? options.padding : 30;
    /**
     * Component margin thickness.
     * @type {number}
     * @default 6
     */
    this.margin = options.margin !== undefined ? options.margin : 6;
    /**
     * Number of components per line at a given depth. Valid values: 1 - Infinity.
     * @type {number[]}
     * @default [5, 1]
     */
    this.lineLengthPerDepth = options.lineLengthPerDepth !== undefined
      ? options.lineLengthPerDepth : [5, 1];
    /**
     * The size of each action menu button.
     * @type {number}
     * @default 24
     */
    this.actionMenuButtonSize = options.actionMenuButtonSize || 24;
    /**
     * Store for actions, used to set specific actions values when making actions.
     * @type {object}
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
      zoom: {
        scale: 1,
        translate: {
          x: 0,
          y: 0,
        },
      },
    };
  }

  /**
   * Convert screen coordinates into a given svg referential.
   * @param {number} screenX - Screen x coordinate.
   * @param {number} screenY - Screen y coordinate.
   * @param {SVGSVGElement} [svg] - SVG referential.
   * @returns {DOMPoint} The transformed coordinates.
   */
  screenToSVG(screenX, screenY, svg = null) {
    const localSvg = svg || this.svg.node();
    const pivotPoint = new DOMPoint(screenX, screenY);

    return pivotPoint.matrixTransform(localSvg.getScreenCTM().inverse());
  }

  /**
   * Convert svg coordinates into screen coordinates.
   * @param {number} svgX - SVG x coordinate.
   * @param {number} svgY - SVG y coordinate.
   * @param {SVGSVGElement} [svg] - SVG referential.
   * @returns {DOMPoint} The transformed coordinates.
   */
  SVGToScreen(svgX, svgY, svg = null) {
    const localSvg = svg || this.svg.node();
    const pivotPoint = new DOMPoint(svgX, svgY);

    return pivotPoint.matrixTransform(localSvg.getScreenCTM());
  }

  /**
   * Compute a coefficient representing how tall a component will be based on its children's layout.
   * @param {Node} item - The component to check.
   * @returns {number} The coefficient.
   * @private
   */
  __getVerticalCoefficient(item) {
    const lineLength = this.getLineLengthForDepth(
      item.depth,
      item.parent?.data?.definition?.childrenPerLine,
    );

    if (item.children?.length > 0) {
      const childHeights = Math.ceil(
        item.children
          .filter((child) => child?.data?.definition?.isContainer)
          .reduce(
            (acc, child) => acc + this.__getVerticalCoefficient(child),
            0,
          ),
      );
      const localChildValue = item.children
        .filter((child) => !(child.data?.definition?.isContainer))
        .reduce((acc, child) => acc + child.value, 0);

      return localChildValue
        / lineLength
        + childHeights
        + (item.data?.definition?.isContainer ? 1 : 0);
    }

    return (lineLength === Infinity ? 1 : item.value
      / lineLength)
      + (item.data?.definition?.isContainer ? 1 : 0);
  }

  /**
   * Get the maximum line length for a given depth.
   * @param {number} depth - The depth to check.
   * @param {boolean} [lineLengthOverride] - Override if parent is tagged as a workflow
   * @returns {number} The maximum length at that depth.
   */
  getLineLengthForDepth(depth, lineLengthOverride = null) {
    return lineLengthOverride
      || this.lineLengthPerDepth[Math.min(depth, this.lineLengthPerDepth.length - 1)];
  }

  /**
   * Apply the disabled style to all elements matching the selector.
   * @param {string} [selector] - CSS selector string.
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
   * @returns {Element} The element to drop the dragged element onto.
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
        .map((type) => `:not(.${type})`)
        .join('');

      this.setDisabledStyle(`.component:not(#${event.subject.data.id})${forbiddenTypes}`);
    }

    this.drawLinks();

    return dropTarget;
  }

  /**
   * Create and return d3 drag behaviour.
   * @returns {Function} D3 drag behaviour.
   */
  setupDragBehavior() {
    let dropTarget = null;
    let itemWasDragged = false;
    const dragHandler = this.dragHandler.bind(this);

    return d3.drag()
      .subject((event) => {
        const target = document
          .elementsFromPoint(event.sourceEvent.x, event.sourceEvent.y)
          .find((element) => element.classList.contains('component-hitbox'));
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
    if (node?.data.drawOption) {
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

    if (target === origParent
      || (origParent?.id === target?.datum().data?.id
        && !origParent?.definition?.preventChildrenMovement)) {
      const { x, y } = event;

      event.subject.data.drawOption.x = x - this.actions.drag.offsetX;
      event.subject.data.drawOption.y = y - this.actions.drag.offsetY;

      this.pluginData.emitEvent({
        type: 'Drawer',
        action: 'move',
        status: 'success',
        components: [event.subject.data.id],
      });
    } else {
      if (event.subject.parent) {
        this.__markAsNeedingResize(event.subject.parent);
      }
      event.subject.data.drawOption = null;

      if (target) {
        this.changeParent(target, event);
      } else {
        event.subject.data.removeAllReferenceAttributes();

        this.pluginData.emitEvent({
          type: 'Drawer',
          action: 'update',
          status: 'success',
          components: [event.subject.data.id],
        });
      }
    }

    this.draw(this.rootId);
  }

  /**
   * Change the event subject's parent to the target component.
   * @param {Selection} target - Where the dragged element was dropped.
   * @param {DragEvent} event - D3's drag event.
   */
  changeParent(target, event) {
    const parentId = target.attr('data-parentId');
    const newParent = this.pluginData.getComponentById(parentId);
    const newParentNode = d3.select(`#${parentId}`).datum();
    const isValid = newParent.definition.childrenTypes.includes(event.subject.data.definition.type);

    if (isValid) {
      event.subject.data.setReferenceAttribute(newParent);
      this.__markAsNeedingResize(newParentNode);

      if (newParent?.definition?.displayType === 'workflow') {
        const newInboundComponent = this.findInsertionPosition(newParentNode, event);

        if (newInboundComponent) {
          this.pluginData
            .insertComponentAfter(
              event.subject.data.id,
              newInboundComponent.data?.id,
            );
        } else if (newParentNode.children?.length > 0) {
          this.pluginData
            .insertComponentBefore(
              event.subject.data.id,
              newParentNode.children[0].data?.id,
            );
        }
      }
    }

    this.pluginData.emitEvent({
      type: 'Drawer',
      action: isValid ? 'update' : 'move',
      status: 'success',
      components: [event.subject.data.id],
    });
  }

  /**
   * Find after which component the dragged component should be placed in a container.
   * @param {Node} parentNode - The destination container.
   * @param {DragEvent} event - The drag event.
   * @returns {Component} - The component that will be directly before the dropped component.
   */
  findInsertionPosition(parentNode, event) {
    const xDelta = parentNode.x0 - event.subject.parent.x0;
    const yDelta = parentNode.y0 - event.subject.parent.y0;
    const adjustedEventX = event.x - xDelta;
    const adjustedEventY = event.y - yDelta;

    if (!parentNode.children) {
      return null;
    }

    const sameLineComponents = parentNode.children
      .filter((component) => component.data?.id !== event.subject?.data?.id)
      .filter((component) => component.y0 <= adjustedEventY
        && component.y1 >= adjustedEventY);

    if (sameLineComponents.length > 0) {
      const bracketingComponents = sameLineComponents.reduce((targetInfo, component) => {
        const distance = adjustedEventX - component.x1;

        if (distance > 0 && distance < targetInfo.distanceLeft) {
          targetInfo.distanceLeft = distance;
          targetInfo.componentLeft = component;
        } else if (distance <= 0 && Math.abs(distance) < targetInfo.distanceRight) {
          targetInfo.distanceRight = Math.abs(distance);
          targetInfo.componentRight = component;
        }

        return targetInfo;
      }, {
        distanceLeft: Infinity,
        distanceRight: Infinity,
        componentLeft: null,
        componentRight: null,
      });

      this.__fillMissingBracket(parentNode, bracketingComponents, event.subject);

      return this.__isInverted(
        parentNode,
        bracketingComponents.componentLeft,
        bracketingComponents.componentRight,
      )
        ? bracketingComponents.componentRight
        : bracketingComponents.componentLeft;
    }
    const { component: returnComponent } = parentNode.children
      .reduce((targetInfo, component) => {
        const distance = adjustedEventY - component.y1;

        if (distance > 0 && distance <= targetInfo.distance) {
          targetInfo = { distance, component };
        }

        return targetInfo;
      }, { distance: Infinity, component: null });

    return returnComponent;
  }

  /**
   * Fill left bracket if missing due to vertical layout.
   * @param {Node} parentNode - The parent node
   * @param {object} bracketingComponents - the components we want to drop the subject between.
   * @param {Node} subject - The component being dropped.
   * @private
   */
  __fillMissingBracket(parentNode, bracketingComponents, subject) {
    if (parentNode.children?.length > 1
      && !bracketingComponents.componentLeft
      && bracketingComponents.componentRight) {
      const subjectIndex = parentNode.children
        .findIndex((component) => component.data?.id === subject?.data?.id);
      const rightIndex = parentNode.children
        .findIndex(
          (component) => component.data?.id === bracketingComponents.componentRight.data?.id,
        );
      const newLeftIndex = subjectIndex === rightIndex - 1 ? rightIndex - 2 : rightIndex - 1;

      if (newLeftIndex >= 0) {
        bracketingComponents.componentLeft = parentNode.children[newLeftIndex];
      }
    }
  }

  /**
   * Check if two components are being rendered right to left.
   * @param {Node} parentNode - The parent component
   * @param {Node} componentLeft - The left hand component
   * @param {Node} componentRight - the right hand component
   * @returns {boolean} - true if the right hand component has a lower index than the left hand one
   * @private
   */
  __isInverted(
    parentNode,
    componentLeft,
    componentRight,
  ) {
    const leftIndex = parentNode.children
      .findIndex(
        (component) => component.data.id === componentLeft?.data?.id,
      );
    const rightIndex = parentNode.children
      .findIndex(
        (component) => component.data.id === componentRight?.data?.id,
      );

    return !!((leftIndex === -1 && rightIndex === (parentNode.children.length - 1))
      || (leftIndex >= 0 && rightIndex >= 0 && leftIndex > rightIndex));
  }

  /**
   * Create a new svg to render the models in, or fetch an existing one.
   */
  createRenderingContext() {
    const contextIsPresent = !d3.select(`#${this.rootId}>svg`).empty();

    if (!contextIsPresent) {
      this.svg = d3.select(`#${this.rootId}`)
        .append('svg')
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .style('font', '10px sans-serif')
        .attr('height', '100%')
        .attr('width', '100%');
      this.svg.append('g')
        .attr('class', 'container');
      this.svg.append('defs');
      this.__initializeArrowMarker();
    } else {
      this.svg = d3.select(`#${this.rootId}`)
        .select('svg');
    }
  }

  /**
   * Draws all Components and ComponentLinks in the parentId Element.
   * @param {string} rootId - Id of the container where you want to draw.
   * @param {boolean} readOnly - Make the draw read-only.
   */
  draw(rootId, readOnly) {
    const id = this.pluginData.emitEvent({
      type: 'Drawer',
      action: 'write',
      status: 'running',
      data: {
        rootId,
      },
    });

    this.rootId = rootId;
    this.createRenderingContext();

    this.__unselectComponent();

    this.drawComponents(readOnly);

    this.drawLinks(readOnly);

    this.setViewPortAction(readOnly);

    d3.select('body')
      .on('keyup', (event) => {
        const currentSelection = this.actions.selection.current;

        if (event.key === 'Delete' && currentSelection) {
          if (currentSelection.__class === 'Component') {
            this.removeComponentHandler();
          } else if (currentSelection.__class === 'Link') {
            this.removeLinkHandler();
          }
        }
      });

    if (readOnly) {
      const {
        width,
        height,
        x,
        y,
      } = document.querySelector(`#${this.rootId} svg`).getBBox();

      d3.select(`#${this.rootId} svg`).attr('viewBox', `${x} ${y} ${width} ${height}`);
    }

    this.pluginData.emitEvent({ id, status: 'success' });
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
   * @param {boolean} readOnly - Draw read-only components.
   */
  drawComponents(readOnly) {
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
      .on('click', readOnly ? null : clicked)
      .call(readOnly ? () => {} : drag)
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
        {
          ...data,
          hasError: data.hasError(),
          getAttribute: (name) => data.attributes.find((attribute) => attribute.name === name),
        },
      ))
      .select('svg')
      .attr('id', ({ data }) => `svg-${data.id}`)
      .attr('height', (component) => {
        const { manuallyResized, height } = component.data.drawOption;

        return manuallyResized ? height : this.getComponentHeight(component);
      })
      .attr('width', (component) => {
        const { manuallyResized, width } = component.data.drawOption;

        return manuallyResized ? width : this.getComponentWidth(component);
      });

    node.select('.component-icon')
      .html(({ data }) => this.resources.icons[data.definition.icon]);

    node.select('rect')
      .filter((d) => d.data?.definition?.isContainer)
      .attr('height', (component) => {
        const { manuallyResized, height } = component.data.drawOption;

        return manuallyResized ? height : this.getComponentHeight(component);
      })
      .attr('width', (component) => {
        const { manuallyResized, width } = component.data.drawOption;

        return manuallyResized ? width : this.getComponentWidth(component);
      });

    node.select('.component-container')
      .attr('height', (component) => {
        const { manuallyResized, height } = component.data.drawOption;

        return (manuallyResized ? height : this.getComponentHeight(component))
          - this.minHeight - this.margin;
      })
      .attr('width', (component) => {
        const { manuallyResized, width } = component.data.drawOption;

        return (manuallyResized ? width : this.getComponentWidth(component)) - 2 * this.margin;
      })
      .attr('x', () => this.margin)
      .filter(({ children }) => children)
      .append(({ data }) => d3.select(`#group-${data.id}`).node());

    node.select('.component-container>rect').attr('data-parentId', ({ data }) => data.id);
  }

  /**
   * Initialize component height and width then store them in its drawOptions.
   * @param {Node} component - The component to initialize the values for.
   */
  initializeComponentDrawOptions(component) {
    /*
      component.depth and component.height are set by d3 and represent the position of the node in
      the hierarchy:
      - height: how many layers exist below this node
      - depth: how deep in the tree the node is
    */
    const horizontalCoefficient = Math.min(
      component.value,
      this.getLineLengthForDepth(component.depth, component.data.definition?.childrenPerLine),
    );
    const verticalCoefficient = Math.ceil(this.__getVerticalCoefficient(component));

    const width = (horizontalCoefficient * (this.minWidth + 2 * this.margin))
      + (component.height * 2 * this.padding)
      + (horizontalCoefficient - 1)
      * (this.padding + 2 * this.margin);

    const height = (verticalCoefficient * this.minHeight)
      + (component.height * this.padding)
      + (verticalCoefficient - 1)
      * (this.padding + this.margin);

    if (!component.data.drawOption || component.parent?.data?.definition?.preventChildrenMovement) {
      component.data.drawOption = new ComponentDrawOption({
        needsPositioning: true,
        width,
        height,
      });
    } else if (!component.data.drawOption.manuallyResized) {
      component.data.drawOption.width = width;
      component.data.drawOption.height = height;
    }
  }

  /**
   * Build d3 hierarchy and treemap layout.
   * @returns {Array} The nodes grouped by parent.
   */
  buildTree() {
    const treemapLayout = d3.treemap()
      .size([this.width, this.height])
      .tile((data) => {
        const newComponents = data
          .children
          .filter((child) => !child.data.drawOption
            || data.data?.definition?.preventChildrenMovement);
        const existingComponents = data
          .children
          .filter((child) => child.data.drawOption
            && !(data.data?.definition?.preventChildrenMovement));

        newComponents.forEach((component) => this.initializeComponentDrawOptions(component));

        const lines = this.__buildLines(existingComponents.concat(newComponents), data.depth);

        this.setupTiles(lines.map((line) => {
          line.items = line.items.filter((item) => item);

          return line;
        }), data.data?.definition?.displayType === 'workflow');
        // TODO save/load coordinates
      })
      .round(true);
    const rootNode = d3.hierarchy(
      this.shadowRoot,
      ({ id }) => this.pluginData.getChildren(id === '__shadowRoot' ? null : id),
    );

    rootNode
      .count();

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
   * @returns {number[] | null} - Tuple representing x,y coordinates,
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
   * Initialize arrow marker for links.
   * @private
   */
  __initializeArrowMarker() {
    const definitions = this.pluginData.getUsedLinkDefinitions();
    const arrows = this.svg.select('defs').selectAll('arrow')
      .data(
        definitions,
        (data) => `${data.attributeRef}-${data.sourceRef}-${data.targetRef}`,
      )
      .join('marker')
      .attr('class', 'arrow');

    arrows
      .attr('id', (data) => `${data.attributeRef}-${data.sourceRef}-${data.targetRef}-arrow`)
      .attr('refX', (data) => data.marker.refX)
      .attr('refY', (data) => data.marker.refY)
      .attr('markerWidth', (data) => data.marker.width)
      .attr('markerHeight', (data) => data.marker.height)
      .attr('orient', (data) => data.marker.orient)
      .append('path')
      .attr('d', (data) => data.marker.path)
      .attr('fill', (data) => data.color);
  }

  /**
   * Render links in model view.
   * @param {boolean} readOnly - Draw read-only links.
   */
  drawLinks(readOnly) {
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
      .attr('id', ({ definition, source, target }) => (
        `link-${definition.sourceRef}-${definition.attributeRef}-${source}-${target}`
      ))
      .attr('fill', 'none')
      .attr('stroke', (link) => link.definition.color)
      .attr('stroke-width', (link) => link.definition.width * this.actions.zoom.scale)
      .attr('stroke-dasharray', (link) => (
        !link.definition.dashStyle
          ? 'none'
          : link.definition.dashStyle.map((value) => value * this.actions.zoom.scale)
      ))
      .attr('marker-start', (data) => {
        const { attributeRef, sourceRef, targetRef } = data.definition;

        return data.definition.type === 'Reverse'
          ? `url(#${attributeRef}-${sourceRef}-${targetRef}-arrow)`
          : 'none';
      })
      .attr('marker-end', (data) => {
        const { attributeRef, sourceRef, targetRef } = data.definition;

        return data.definition.type !== 'Reverse'
          ? `url(#${attributeRef}-${sourceRef}-${targetRef}-arrow)`
          : 'none';
      })
      .attr('cursor', readOnly ? 'default' : 'pointer')
      .on('click', (event) => (readOnly ? null : this.clickHandler(event)));

    links.raise();
  }

  /**
   * Get the coordinates for a given selection's center.
   * @param {Selection} selection - The selection to find the center for.
   * @returns {object} Position of selection.
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
   * @param {object} pointA - The point to get the bearing from.
   * @param {object} pointB - The point to get the bearing to.
   * @returns {number} The bearing.
   */
  getBearing(pointA, pointB) {
    const distanceXBA = pointB.x - pointA.x;
    const distanceYBA = pointB.y - pointA.y;
    const x = distanceXBA / (Math.sqrt(distanceXBA ** 2 + distanceYBA ** 2));
    const y = distanceYBA / (Math.sqrt(distanceXBA ** 2 + distanceYBA ** 2));

    return ((Math.atan2(x, y) * (180 / Math.PI)) + 360) % 360;
  }

  /**
   * Build a new d3 link generator for a ComponentLink
   * @param {ComponentLink} link - The link to build the generator for.
   * @returns {object} A d3 link generator.
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
   * Compute the component's height then store it in its drawOptions.
   * @param {Node} component - The component to get the height for.
   * @returns {number} The computed height.
   */
  getComponentHeight(component) {
    if (component.id === '__shadowRoot') {
      return 0;
    }

    const containerSpacing = this.minHeight + this.padding + this.margin;
    const childHeights = component.children
      ? component.children.map(({ y1 }) => y1 + containerSpacing)
      : [0];

    component.data.drawOption.height = (Math.max(
      this.minHeight + (component.data.definition.isContainer * containerSpacing),
      ...childHeights,
    ));

    return component.data.drawOption.height;
  }

  /**
   * Compute the component's width then store it in its drawOptions.
   * @param {Node} component - The component to get the width for.
   * @returns {number} The computed width.
   */
  getComponentWidth(component) {
    if (component.id === '__shadowRoot') {
      return 0;
    }

    const childWidths = component.children ? component.children.map(({ x1 }) => x1) : [0];

    component.data.drawOption.width = Math.max(this.minWidth, ...childWidths)
      + (!!(component.children) * (this.padding + this.margin));

    return component.data.drawOption.width;
  }

  /**
   * Compute the dimension of every component.
   * @param {Array} lines - Rows of components.
   * @param {boolean} [invertEven] - Layout even line components right to left.
   */
  setupTiles(lines, invertEven = false) {
    let previousTallestItem = { x1: 0, y1: 0 };

    lines
      .forEach((line) => {
        line.items = line.items
          .map((item) => {
            if (!item.data.drawOption) {
              item.data.drawOption = new ComponentDrawOption({
                needsPositioning: true,
                needsResizing: true,
              });
            }

            return item;
          })
          .map((item) => {
            if (item.data.drawOption.needsResizing) {
              this.initializeComponentDrawOptions(item);
              item.data.drawOption.needsResizing = false;
            }

            return item;
          })
          .sort((itemA, itemB) => {
            if (itemA.data.drawOption.needsPositioning && !itemB.data.drawOption.needsPositioning) {
              return 1;
            }

            if (!itemA.data.drawOption.needsPositioning
              && !itemB.data.drawOption.needsPositioning) {
              return itemA.data.drawOption.x - itemB.data.drawOption.x;
            }

            return 0;
          });
        /*          .reduceRight((acc, item) => {
            acc[invertEven && lineIndex % 2 ? 'push' : 'unshift'](item);

            return acc;
          }, []) */
      });
    const rightClamp = Math.max(...lines.map(
      (line) => (line.items.reduce((acc, item) => acc + item.data.drawOption.width, 0)
        + (line.items.length + 1) * this.padding),
    ));

    lines
      .forEach((line, lineIndex) => {
        let prevItem = {
          x1: 0,
          x0: rightClamp,
          y0: line.band + this.padding,
        };

        line.items.forEach((item) => {
          if (item.data.drawOption.needsPositioning) {
            item.data.drawOption.x = invertEven && lineIndex % 2
              ? prevItem.x0 - item.data.drawOption.width - this.padding
              : prevItem.x1 + this.padding;
            item.data.drawOption.y = previousTallestItem.y1 + this.padding;
            item.data.drawOption.needsPositioning = false;
          }

          item.x0 = item.data.drawOption.x;
          item.y0 = item.data.drawOption.y;
          prevItem = item;

          item.x1 = item.x0 + item.data.drawOption.width;
          item.y1 = item.y0 + item.data.drawOption.height;
        });

        if (line.items.length > 0) {
          const maxLineValue = Math.max(...line.items.map((item) => item.value));

          previousTallestItem = line.items.find((item) => item.value === maxLineValue);
        }
      });
  }

  /**
   * Build and fill the layout lines for a Node.
   * @param {Node[]} children - The Node's children to build lines with.
   * @param {number} depth - The Node's depth.
   * @returns {Array} A list of lines.
   * @private
   */
  __buildLines(children, depth) {
    let lines = [];
    let activeLineIndex = 0;
    let activeLine = lines[activeLineIndex];

    children.forEach((child) => {
      lines = lines.sort((la, lb) => la.band - lb.band);

      if (child.data.drawOption && !child.data.drawOption.needsPositioning) {
        activeLineIndex = lines.findIndex(
          (line) => line.band === Math.floor(child.data.drawOption.y / 100) * 100,
        );

        if (activeLineIndex === -1) {
          lines.push({
            total: 0,
            band: Math.floor(child.data.drawOption.y / 100) * 100,
            items: [],
          });
          activeLineIndex = lines.length - 1;
        }
      } else {
        activeLineIndex = 0;

        while (activeLineIndex < lines.length
        && lines[activeLineIndex].items.length >= this.getLineLengthForDepth(
          depth,
          child.parent?.data?.definition?.childrenPerLine,
        )) {
          activeLineIndex += 1;
        }

        if (activeLineIndex === lines.length) {
          lines.push({
            total: 0,
            band: activeLineIndex > 0 ? lines[activeLineIndex - 1].band + 100 : 0,
            items: [],
          });
        }
      }

      activeLine = lines[activeLineIndex];
      activeLine.total += child.value;
      activeLine.items.push(child);
    });

    return lines.sort((la, lb) => la.band - lb.band);
  }

  /**
   * Set actions on viewport.
   * @param {boolean} readOnly - Disable viewport action.
   */
  setViewPortAction(readOnly) {
    this.svg.on('click', () => {
      this.__unselectComponent();
      this.cancelLinkCreationInteraction();
    });

    if (readOnly) {
      return;
    }

    const drawLinks = this.drawLinks.bind(this);

    this.svg.call(d3
      .zoom()
      .on('zoom', (event) => {
        this.svg.select('.container').attr('transform', event.transform);
        this.actions.zoom.scale = event.transform.k;
        this.actions.zoom.translate.x = event.transform.x;
        this.actions.zoom.translate.y = event.transform.y;

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
      const selectedComponent = d3.select(`#${this.rootId} .selected`);

      if (selectedComponent.empty()) {
        this.actions.selection.current = null;

        return;
      }

      if (selectedComponent.classed('component')) {
        selectedComponent
          .classed('selected', false)
          .select('.template')
          .style('outline', '');
      } else {
        selectedComponent
          .classed('selected', false)
          .style('outline', '');
      }

      this.actions.selection.current = null;
      this.hideActionMenu();
      this.hideResizer();
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
        this.pluginData.emitEvent({
          type: 'Drawer',
          action: 'select',
          status: 'success',
          components: [currentComponent.id],
          data: {
            isSelected: false,
          },
        });

        return;
      }

      targetSelection
        .classed('selected', true);

      if (targetSelection.classed('component')) {
        targetSelection
          .select('.template')
          .style('outline', this.actions.selection.style)
          .style('outline-offset', this.actions.selection.offset);
      } else {
        targetSelection
          .style('outline', this.actions.selection.style)
          .style('outline-offset', this.actions.selection.offset);
      }

      this.actions.selection.current = currentComponent;

      if (this.events?.SelectEvent && currentComponent.__class === 'Component') {
        this.events.SelectEvent.next(currentComponent);
      }

      this.initializeActionMenu(targetSelection);

      if (targetSelection.datum().data && targetSelection.datum()?.data.definition.isContainer) {
        this.initializeResizer(targetSelection);
      }

      this.pluginData.emitEvent({
        type: 'Drawer',
        action: 'select',
        status: 'success',
        components: [currentComponent.id],
        data: {
          isSelected: true,
        },
      });
    }
  }

  /**
   * Create a link between the previously selected source and destination.
   * @param {string} componentId - Component id.
   */
  createLink(componentId) {
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

    this.pluginData.emitEvent({
      type: 'Drawer',
      action: 'add',
      status: 'success',
      components: [componentId],
      links: [newLink],
    });

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

    const linkableList = targetSelection.datum().data?.getDefinedAttributesByType('Link');

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
      .attr('x', (_data, index) => (this.actionMenuButtonSize * index))
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('cursor', (d) => ((d.id === 'create-linkable-component' || d.id === 'create-link')
        && linkableList.length === 0 ? 'not-allowed' : 'pointer'))
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
          .attr('fill', (data) => (
            (data.id === 'create-linkable-component' || data.id === 'create-link')
            && linkableList.length === 0 ? 'lightgrey' : 'grey'
          ));
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
      .attr('opacity', (data) => (
        (data.id === 'create-linkable-component' || data.id === 'create-link')
        && linkableList.length === 0 ? 0.2 : 1
      ))
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
   * Initialize resizer button when container component is selected.
   * @param {Selection} targetSelection - D3 selection of the target object.
   */
  initializeResizer(targetSelection) {
    const {
      top, left, width, height,
    } = targetSelection.node().getBoundingClientRect();
    const { x: x1, y: y1 } = this.screenToSVG(
      left + width,
      top + height,
      this.svg.select('.container').node(),
    );

    const hitSize = 10;

    const resizer = this.svg.select('.container')
      .append('g')
      .attr('id', 'resizer')
      .attr('fill', '#B5B5B5');

    resizer.append('circle')
      .classed('resize-hit', true)
      .attr('cursor', 'nwse-resize')
      .attr('cx', x1)
      .attr('cy', y1)
      .attr('r', hitSize)
      .call(d3.drag()
        .on('drag', (event) => {
          this.hideActionMenu();

          const component = d3.select(`#svg-${this.actions.selection.current.id}`);
          const componentContainer = component.select('.component-container');
          const componentW = parseInt(component.attr('width'), 10);
          const componentH = parseInt(component.attr('height'), 10);
          const containerW = parseInt(componentContainer.attr('width'), 10);
          const containerH = parseInt(componentContainer.attr('height'), 10);

          const hit = d3.select('.resize-hit');
          const hitX = parseInt(hit.attr('cx'), 10);
          const hitY = parseInt(hit.attr('cy'), 10);

          hit.attr('cx', hitX + event.dx);
          hit.attr('cy', hitY + event.dy);

          component
            .attr('width', componentW + event.dx)
            .attr('height', componentH + event.dy);

          component
            .select('.component-hitbox')
            .attr('width', componentW + event.dx)
            .attr('height', componentH + event.dy);

          component
            .select('.component-container')
            .attr('width', containerW + event.dx)
            .attr('height', containerH + event.dy);
        })
        .on('end', () => {
          const component = this.actions.selection.current;
          const componentSvg = d3.select(`#svg-${component.id}`);
          const componentW = parseInt(componentSvg.attr('width'), 10);
          const componentH = parseInt(componentSvg.attr('height'), 10);

          component.drawOption.width = componentW;
          component.drawOption.height = componentH;
          component.drawOption.manuallyResized = true;

          this.draw(this.rootId);

          this.pluginData.emitEvent({
            type: 'Drawer',
            action: 'resize',
            status: 'success',
            components: [component.id],
          });
        }));
  }

  /**
   * Initialize the linkable components creation menu.
   * @param {ComponentDefinition[]} definitions - List of component definitions.
   */
  initializeCreateLinkableComponentMenu(definitions) {
    d3.select('#linkable-menu')?.remove();

    let maxTextWidth = 0;
    const buttonPadding = 5;
    const iconSize = 20;
    const actionMenu = document.querySelector('#action-menu');
    const menu = this.svg.select('.container')
      .append('svg')
      .attr('id', 'linkable-menu');

    menu
      .append('rect')
      .attr('rx', 5)
      .attr('fill', 'lightgrey')
      .attr('height', '100%')
      .attr('width', '100%');

    const buttons = menu
      .selectAll('.linkable-button')
      .data(definitions)
      .join('svg')
      .classed('linkable-button', true);

    buttons.attr('class', (data) => `linkable-button ${data.type}`);

    buttons
      .attr('width', '100%')
      .attr('rx', 5)
      .attr('width', '100%')
      .attr('height', 30)
      .attr('y', (_data, index) => (index * 30));

    buttons
      .append('rect')
      .attr('rx', 5)
      .attr('fill', 'lightgrey')
      .attr('height', '100%')
      .attr('width', '100%');

    buttons
      .append('svg')
      .html((data) => this.resources.icons[data.icon])
      .attr('x', buttonPadding)
      .attr('y', buttonPadding)
      .attr('width', iconSize)
      .attr('height', iconSize)
      // eslint-disable-next-line prefer-arrow-callback
      .attr('viewBox', function setViewbox() {
        const icon = d3.select(this).select('svg');
        const width = icon.attr('width').replace('px', '');
        const height = icon.attr('height').replace('px', '');

        return `0 0 ${width} ${height}`;
      })
      .attr('background-color', 'white');

    buttons
      .append('text')
      .attr('x', (buttonPadding * 2) + iconSize)
      .attr('y', 18)
      .text((data) => data.type);

    // eslint-disable-next-line prefer-arrow-callback
    buttons.selectAll('text').each(function getTextWidth() {
      const { width } = this.getBBox();

      if (width > maxTextWidth) {
        maxTextWidth = width;
      }
    });

    menu
      .attr('width', maxTextWidth + iconSize + (buttonPadding * 3))
      .attr('height', (definitions.length * 30))
      // eslint-disable-next-line prefer-arrow-callback
      .attr('x', function xPos() {
        return parseInt(actionMenu.getAttribute('x'), 10)
          + (actionMenu.getBBox().width / 2)
          - (parseInt(this.getAttribute('width'), 10) / 2);
      })
      .attr('y', (parseInt(actionMenu.getAttribute('y'), 10)
        + (actionMenu.getBBox().height) + 10));

    buttons
      .on('mouseenter', function onHover() {
        d3.select(this)
          .select('rect')
          .attr('fill', 'grey')
          .attr('cursor', 'pointer');
      })
      .on('mouseleave', function onLeave() {
        d3.select(this)
          .select('rect')
          .attr('fill', 'lightgrey')
          .attr('cursor', 'default');
      })
      .on('click', (event, data) => {
        this.actions.linkCreation.source = this.actions.selection.current;

        const componentId = this.pluginData.addComponent(data);
        const component = this.pluginData.getComponentById(componentId);

        component.path = this.actions.linkCreation.source.path;

        this.draw(this.rootId);
        this.actions.linkCreation.target = d3.select(`#${componentId}`).datum().data;
        this.createLink(componentId);
      });
  }

  /**
   * Initialize the link creation menu.
   */
  startLinkCreationInteraction() {
    if (this.actions.selection.current) {
      const source = this.pluginData.getComponentById(this.actions.selection.current.id);
      const allowedLinkTargets = source.definition.definedAttributes
        .filter((a) => a.type === 'Link');
      const forbiddenTypes = allowedLinkTargets
        .map((linkTarget) => `:not(.${linkTarget.linkRef})`)
        .join('');

      this.actions.linkCreation.creating = true;
      this.actions.linkCreation.source = source;

      this.setDisabledStyle(`.component:not(#${source.id})${forbiddenTypes}`);
    }
  }

  /**
   * Handler for component removal.
   * Remove component, emit an event accordingly then draw again.
   */
  removeComponentHandler() {
    this.pluginData.removeComponentById(this.actions.selection.current.id);

    this.pluginData.emitEvent({
      type: 'Drawer',
      action: 'delete',
      status: 'success',
      components: [this.actions.selection.current.id],
    });

    this.draw(this.rootId);
  }

  /**
   * Handler for link removal.
   * Remove link, emit an event accordingly then draw again.
   */
  removeLinkHandler() {
    this.pluginData.removeLink(this.actions.selection.current);

    this.pluginData.emitEvent({
      type: 'Drawer',
      action: 'delete',
      status: 'success',
      components: [],
    });

    this.draw(this.rootId);
  }

  /**
   * Get a list of actions to fill the menu for a given target.
   * @param {object} targetSelection - The target object.
   * @type {object}
   * @property {string} id - Id of the action button.
   * @property {string} icon - Icon to display in the action button
   * @property {Function} handler - Function called on action click.
   * @returns {Array} The list of menu actions.
   */
  getMenuActions(targetSelection) {
    if (targetSelection.classed('component')) {
      return [
        {
          id: 'create-linkable-component',
          icon: actionIcons.add,
          handler() {
            const data = targetSelection.datum().data?.getDefinedAttributesByType('Link')
              .map((link) => link.linkRef);
            const definitions = this.pluginData.definitions.components.filter((definition) => (
              data.includes(definition.type)
            ));

            if (definitions.length > 0) {
              this.initializeCreateLinkableComponentMenu(definitions);
            }
          },
        },
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
          handler: this.removeComponentHandler.bind(this),
        },
      ];
    }

    return [
      {
        id: 'remove-link',
        icon: actionIcons.trash,
        handler: this.removeLinkHandler.bind(this),
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
    d3.select('#action-menu').remove();
    d3.select('#linkable-menu').remove();
  }

  /**
   * Hide the resizer.
   */
  hideResizer() {
    d3.select('#resizer').remove();
  }
}
export default DefaultDrawer;
