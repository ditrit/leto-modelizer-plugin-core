import DefaultLayout from './DefaultLayout';

class CustomLayout extends DefaultLayout {
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
      const isResizing = component.drawOption.width !== node.width || component.drawOption.height !== node.height;

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
  }

  getNodes() {
    const root = {
      id: 'root',
      parent: null,
      children: [],
      depth: 0,
      type: 'default',
      isContainer: true,
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

  createNode(component) {
    return {
      id: component.id,
      parent: component.getContainerId() || 'root',
      type: component.definition.displayType || 'default',
      direction: component.definition.workflowDirection,
      children: [],
      depth: this.pluginData.getComponentDepth(component.id) + 1,
      isContainer: component.definition.isContainer,
      width: component.definition.width,
      height: component.definition.height,
      minWidth: component.definition.minWidth,
      minHeight: component.definition.minHeight,
      margin: component.definition.containerMargin,
      x: component.drawOption.x,
      y: component.drawOption.y,
    };
  }

  generateLayout(nodes, node, keepPosition) {
    node.children.forEach((child) => {
      this.generateLayout(nodes, child);
    });

    if (node.isContainer && node.type === 'default') {
      this.generateDefaultLayout(nodes, node, keepPosition);
    } else if (node.isContainer) {
      this.generateWorkflowLayout(nodes, node);
    }
  }

  generateDefaultLayout(nodes, container, keepPosition) {
    this.text = 0;
    const nodesAlreadyPlaced = [];
    const nodesToPlace = [];
    let maxX = 0;
    let maxY = 0;

    container.children.forEach((node) => {
      if (node.x && node.y && keepPosition) {
        nodesAlreadyPlaced.push(node);
        maxX = node.x + node.width > maxX ? node.x + node.width : maxX;
        maxY = node.y + node.height > maxY ? node.y + node.height : maxY;
      } else {
        nodesToPlace.push(node);
      }
    });

    let index = 0;
    let indexPoints = 0;
    let node;
    let points = this.getPoints(index);

    while (nodesToPlace.length > 0) {
      if (!node) {
        [node] = nodesToPlace;
      }

      if (this.canBePlace(nodesAlreadyPlaced, node, points[indexPoints])) {
        node.x = points[indexPoints].x;
        node.y = points[indexPoints].y;

        maxX = node.x + node.width > maxX ? node.x + node.width : maxX;
        maxY = node.y + node.height > maxY ? node.y + node.height : maxY;

        nodesAlreadyPlaced.push(node);
        nodesToPlace.shift();
        node = null;
      }

      indexPoints += 1;

      if (indexPoints >= points.length) {
        indexPoints = 0;
        index += 1;
        points = this.getPoints(index);
      }
    }

    const { padding } = this.pluginData.container;

    container.width = maxX + padding;
    container.height = maxY + padding;
    container.width = Math.max(maxX + padding + container.margin * 2, container.minWidth);
    container.height = maxY + padding * 2 + container.margin * 2 + container.minHeight;
  }

  canBePlace(existingNodes, node, position) {
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

  getPoints(i) {
    const padding = 10;
    const gap = 50;

    if (i === 0) {
      return [{ x: padding, y: padding }];
    }
    const maxX = padding + gap * i;
    const maxY = padding + gap * i;
    const points = [];

    let y = padding;
    let x = padding;

    while (x <= maxX) {
      points.push({
        x,
        y: maxY,
      });
      x += gap;

      if (x === maxX && maxY === y) {
        break;
      }

      points.push({
        x: maxX,
        y,
      });
      y += gap;
    }

    return points;
  }

  generateWorkflowLayout(nodes, container) {
    if (container.direction === 'vertical') {
      this.generateVerticalWorkflowLayout(nodes, container);
    } else {
      this.generateHorizontalWorkflowLayout(nodes, container);
    }
  }

  generateHorizontalWorkflowLayout(nodes, container) {
    const { padding, gap } = this.pluginData.container;
    let x = padding;
    let maxY = 0;

    container.children.forEach((child) => {
      child.x = x;
      child.y = padding; // innerPadding of container
      x = child.x + child.width + gap;

      if (child.height > maxY) {
        maxY = child.height;
      }
    });

    container.width = Math.max(x - gap + padding + container.margin * 2, container.minWidth);
    container.height = maxY + padding * 2 + container.margin * 2 + container.minHeight;
  }

  generateVerticalWorkflowLayout(nodes, container) {
    const { padding, gap } = this.pluginData.container;
    let y = padding;
    let maxX = 0;

    container.children.forEach((child) => {
      child.x = padding; // innerPadding of container
      child.y = y;
      y = child.y + child.height + gap;

      if (child.width > maxX) {
        maxX = child.width;
      }
    });

    container.width = Math.max(maxX + padding * 2 + container.margin * 2, container.minWidth);
    container.height = y - gap + padding + container.margin * 2 + container.minHeight;
  }

  resize(id) {
    const container = this.pluginData.getComponentById(id);

    if (!container.definition.isContainer) {
      return;
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

    const { padding } = this.pluginData.container;
    const { minWidth, minHeight, margin } = container.definition;
    const newWidth = Math.max(maxX + padding * 2 + margin * 2, minWidth);
    const newHeight = maxY + padding + margin * 2 + minHeight;

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
  }
}

export default CustomLayout;
