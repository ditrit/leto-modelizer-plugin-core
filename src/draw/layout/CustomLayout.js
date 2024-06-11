import DefaultLayout from './DefaultLayout';

/**
 * Custom implementation of DefaultLayout.
 */
class CustomLayout extends DefaultLayout {
  /**
   * Generate layout of a container.
   * Will update all component drawOption with new position and size.
   * @param {string} id - Container id, null for root container.
   * @param {boolean} keepPosition - If true, rearrange only components without a specified
   * position; otherwise, rearrange all components.
   * @returns {boolean} Return true on successful generation.
   */
  generateComponentsLayout(id, keepPosition) {
    const nodes = this.getNodes();
    const graph = nodes.get(id || 'root');
    const movingIds = [];
    const resizingIds = [];

    this.generateLayout(nodes, graph, keepPosition);

    nodes.forEach((node) => {
      if (node.id === 'root') {
        return;
      }
      if (id !== null && id !== node.parent.id && id !== node.id) {
        return;
      }

      const component = this.pluginData.getComponentById(node.id);

      const isMoving = component.drawOption.x !== node.x || component.drawOption.y !== node.y;
      const isResizing = component.drawOption.width !== node.width
        || component.drawOption.height !== node.height;

      component.drawOption.x = node.x;
      component.drawOption.y = node.y;
      component.drawOption.width = node.width;
      component.drawOption.height = node.height;

      if (isMoving) {
        movingIds.push(component.id);
      } else if (isResizing) {
        resizingIds.push(component.id);
      }
    });

    if (movingIds.length > 0) {
      this.pluginData.emitEvent({
        components: movingIds,
        type: 'Drawer',
        action: 'move',
        status: 'success',
      });
    }

    if (resizingIds.length > 0) {
      this.pluginData.emitEvent({
        components: resizingIds,
        type: 'Drawer',
        action: 'resize',
        status: 'success',
      });
    }

    return true;
  }

  /**
   * Initializes all nodes of a layout.
   * @returns {Map<string, object>} Initialized nodes.
   */
  getNodes() {
    const root = {
      id: 'root',
      parent: null,
      children: [],
      depth: 0,
      type: 'default',
      isContainer: true,
      margin: this.pluginData.configuration.rootContainer.margin,
      gap: this.pluginData.configuration.rootContainer.gap,
    };
    const nodes = new Map(
      this.pluginData.components.map((component) => [component.id, this.createNode(component)]),
    );

    nodes.set('root', root);

    nodes.forEach((node) => {
      if (node.parent) {
        const parent = nodes.get(node.parent);

        node.parent = parent;
        parent.children.push(node);
      }
    });

    return nodes;
  }

  /**
   * Convert component to a node with needed properties.
   * @param {Component} component - Component.
   * @returns {object} Node of component.
   */
  createNode(component) {
    return {
      id: component.id,
      parent: component.getContainerId() || 'root',
      type: component.definition.displayType || 'default',
      direction: component.definition.workflowDirection,
      children: [],
      depth: this.pluginData.getComponentDepth(component.id) + 1,
      isContainer: component.definition.isContainer,
      width: component.definition.defaultWidth,
      height: component.definition.defaultHeight,
      minWidth: component.definition.minWidth,
      minHeight: component.definition.minHeight,
      reservedWidth: component.definition.reservedWidth,
      reservedHeight: component.definition.reservedHeight,
      margin: component.definition.margin,
      gap: component.definition.gap,
      x: component.drawOption.x,
      y: component.drawOption.y,
    };
  }

  /**
   * Recursive method to generate layout of a container. Generate layout of container children.
   * @param {Map<string, object>} nodes - Layout nodes.
   * @param {object} node - Node to generate layout.
   * @param {boolean} keepPosition - If true, rearrange only components without a specified
   * position; otherwise, rearrange all components.
   */
  generateLayout(nodes, node, keepPosition) {
    node.children.forEach((child) => {
      this.generateLayout(nodes, child, keepPosition);
    });

    if (node.isContainer && node.type === 'default') {
      this.generateDefaultLayout(node, keepPosition);
    } else if (node.isContainer) {
      this.generateWorkflowLayout(nodes, node);
    }
  }

  /**
   * Generate layout of default container.
   * @param {object} container - Container.
   * @param {boolean} keepPosition - If true, rearrange only components without a specified
   * position; otherwise, rearrange all components.
   */
  generateDefaultLayout(container, keepPosition) {
    this.text = 0;
    const nodesAlreadyPlaced = [];
    const nodesToPlace = [];
    const {
      margin,
      gap,
      minWidth,
      minHeight,
      reservedWidth,
      reservedHeight,
    } = container;
    let maxX = 0;
    let maxY = 0;

    container.children.forEach((node) => {
      if (node.x && node.y && keepPosition) {
        nodesAlreadyPlaced.push(node);
        maxX = Math.max(node.x + node.width, maxX);
        maxY = Math.max(node.y + node.height, maxY);
      } else {
        nodesToPlace.push(node);
      }
    });

    let index = 0;
    let indexPoints = 0;
    let node;
    let points = this.getPoints(index, margin, gap);

    while (nodesToPlace.length > 0) {
      if (!node) {
        [node] = nodesToPlace;
      }

      if (points.length === 0) {
        indexPoints = 0;
        index += 1;
        points = this.getPoints(index, margin, gap);
      }

      if (points.length > 0 && this.canBePlaced(nodesAlreadyPlaced, node, points[indexPoints])) {
        node.x = points[indexPoints].x;
        node.y = points[indexPoints].y;

        maxX = Math.max(node.x + node.width, maxX);
        maxY = Math.max(node.y + node.height, maxY);

        nodesAlreadyPlaced.push(node);
        nodesToPlace.shift();
        node = null;
      }

      indexPoints += 1;

      if (indexPoints >= points.length) {
        indexPoints = 0;
        index += 1;
        points = this.getPoints(index, margin, gap);
      }
    }

    container.width = Math.max(maxX + margin + reservedWidth, minWidth);
    container.height = Math.max(maxY + margin + reservedHeight, minHeight);
  }

  /**
   * Indicate if node can be placed at position. Check if node not overriding existing node at
   * position.
   * @param {object[]} existingNodes - Existing nodes to check position overriding.
   * @param {object} node - Node to check.
   * @param {object} position - x, y position to check
   * @returns {boolean} True if node can be placed at given position, otherwise false.
   */
  canBePlaced(existingNodes, node, position) {
    return existingNodes.every(({
      x,
      y,
      width,
      height,
    }) => {
      const isLeftOf = position.x + node.width < x;
      const isRightOf = position.x > x + width;
      const isAbove = position.y + node.height < y;
      const isBelow = position.y > y + height;

      return (isLeftOf || isRightOf || isAbove || isBelow);
    });
  }

  /**
   * Generates a list of points forming a path along the edges of a square grid of a given size.
   * Only give points on right and bottom edge.
   * @param {number} i - The number of segments to create (determines the square size). Square are
   * always a multiple of margin. If i = 0, return default position.
   * @param {number} margin - The margin from the origin (0,0) to start the grid.
   * @param {number} gap - The distance between consecutive points.
   * @returns {object[]} An array of points along the edges of the square grid.
   */
  getPoints(i, margin, gap) {
    if (i === 0) {
      return [{ x: margin, y: margin }];
    }
    const maxX = margin + gap * i;
    const maxY = margin + gap * i;
    const points = [];

    let y = margin;
    let x = margin;

    while (x <= maxX) {
      if (x === maxX && maxY === y) {
        break;
      }

      points.push({
        x,
        y: maxY,
      });
      x += gap;

      points.push({
        x: maxX,
        y,
      });
      y += gap;
    }

    points.push({
      x: maxX,
      y: maxY,
    });

    return points;
  }

  /**
   * Generate layout of workflow container.
   * @param {Map<string, object>} nodes - Layout nodes.
   * @param {object} container - Container.
   */
  generateWorkflowLayout(nodes, container) {
    if (container.direction === 'vertical') {
      this.generateVerticalWorkflowLayout(nodes, container);
    } else {
      this.generateHorizontalWorkflowLayout(nodes, container);
    }
  }

  /**
   * Generate layout of horizontal workflow container.
   * @param {Map<string, object>} nodes - Layout nodes.
   * @param {object} container - Container.
   */
  generateHorizontalWorkflowLayout(nodes, container) {
    const {
      margin,
      gap,
      minWidth,
      minHeight,
      reservedWidth,
      reservedHeight,
    } = container;
    let x = margin;
    let maxY = 0;

    container.children.forEach((child) => {
      child.x = x;
      child.y = margin; // innerPadding of container
      x = child.x + child.width + gap;

      if (child.height > maxY) {
        maxY = child.height;
      }
    });

    container.width = Math.max(x - gap + margin + reservedWidth, minWidth);
    container.height = Math.max(maxY + margin * 2 + reservedHeight, minHeight);
  }

  /**
   * Generate layout of vertical workflow container.
   * @param {Map<string, object>} nodes - Layout nodes.
   * @param {object} container - Container.
   */
  generateVerticalWorkflowLayout(nodes, container) {
    const {
      margin,
      gap,
      minWidth,
      minHeight,
      reservedWidth,
      reservedHeight,
    } = container;
    let y = margin;
    let maxX = 0;

    container.children.forEach((child) => {
      child.x = margin; // innerPadding of container
      child.y = y;
      y = child.y + child.height + gap;

      if (child.width > maxX) {
        maxX = child.width;
      }
    });

    container.width = Math.max(maxX + margin * 2 + reservedWidth, minWidth);
    container.height = Math.max(y - gap + margin + reservedHeight, minHeight);
  }

  /**
   * Resize component to its minimum size.
   * @param {string} id - Id of component to resize.
   * @returns {boolean} Return true on successful resizing.
   */
  resize(id) {
    const container = this.pluginData.getComponentById(id);

    if (!container.definition.isContainer) {
      return false;
    }

    let maxX = 0;
    let maxY = 0;

    this.pluginData.getChildren(id).forEach((component) => {
      const x = component.drawOption.x + component.drawOption.width;
      const y = component.drawOption.y + component.drawOption.height;

      if (x > maxX) {
        maxX = x;
      }

      if (y > maxY) {
        maxY = y;
      }
    });

    const {
      minWidth,
      minHeight,
      reservedWidth,
      reservedHeight,
      margin,
    } = container.definition;
    const newWidth = Math.max(maxX + margin * 2 + reservedWidth, minWidth);
    const newHeight = Math.max(maxY + margin * 2 + reservedHeight, minHeight);

    if (newWidth !== container.drawOption.width || newHeight !== container.drawOption.height) {
      container.drawOption.width = newWidth;
      container.drawOption.height = newHeight;

      this.pluginData.emitEvent({
        components: [id],
        type: 'Drawer',
        action: 'resize',
        status: 'success',
      });
    }

    return true;
  }
}

export default CustomLayout;
