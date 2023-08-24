import ELK from 'elkjs';
import DefaultLayout from './DefaultLayout';

/**
 * READ THIS TO UNDERSTAND HOW ELK IS USED TO GENERATE A LAYOUT
 * @description
 * ELK (Eclipse Layout Kernel) is an opensource Java library for automatic layout management.
 * Here, we use elkjs, which is a javascript-transpiled version of it.
 *
 * We must provide ELK with the information of a graph (as in graph theory),
 * with nodes, edges, and the size of the nodes we want to represent.
 * A node will always have a rectangular representation in ELK.
 *
 * Then we call ELK with this data alongside layout parameters, and it yields a layout that
 * can then be used to move our components. ELK has an extensive set of parameters to get
 * exactly what we want. Read the manual to tune it.
 * @see {ElkLayout.elkParams}
 * @see https://eclipse.dev/elk/reference/options.html
 * @description
 * ELK supports hierarchy (ie. nodes inside nodes inside nodes ..) but we only call ELK with
 * a single level of hierarchy (ie. no parent/child) within this code because ELK cannot guess
 * what the size of a component will be at render-time when it has children.
 *
 * Therefore, we made the choice to call ELK multiple times. We start at the deepest level, trigger
 * an ELK layout, write it to the model (ie. actual components).
 * Then we can compute the size of parents at this level and call ELK at the level above.
 * We do this at each depth, starting from the deepest.
 *
 * {DefaultData} has a flat data structure for its components. Parents and children are
 * stored at the same level, and the parent-child relation is stored in attributes.
 *
 * To separate the differents levels of hierarchy in the graph, we need to build a tree.
 * In this file, we call components the units coming from the Leto plugin, and nodes their
 * reference in the tree (with additional information to match ELK format later on).
 * A component always has exactly one matching node.
 * Therefore {ElkLayout.getNodes} takes the components (flat structure) as an argument and
 * return the nodes (tree structure).
 * @see {ElkLayout.getNodes}
 * @description
 *
 * We only ever call ELK at a single level of hierarchy, so we cannot have cross-depth/level links.
 * We represent a link between two nodes from different depth in the tree by a link  between their
 * respective ancestors (that we get with {ElkLayout.getAncestorByDepth} at a given level.
 */

/**
 * A component data for automatic layout.
 * Used within {@link ElkLayout}.
 *
 * It has tree-related fields : parent, children, depth,
 * in addition to the fields from {@link Component} in {@link raw}.
 * @typedef {object} NodeData
 * @property {NodeData} [parent] - The node's parent.
 * @property {Component} [raw] - The underlying component.
 * @property {NodeData[]} children - This node's children.
 * @property {number} depth - Distance from the root (root's depth is 0).
 */

/**
 * An ELK node.
 * (external)
 * @typedef {object} ElkNode
 * @property {string} id - Id.
 * @property {ElkNode[]} [children] - Children.
 * @property {ElkPort[]} [ports] - Ports.
 * @property {ElkExtendedEdge[]} [edges] - Edges.
 * @see https://eclipse.dev/elk/documentation/tooldevelopers/graphdatastructure/jsonformat.html
 * @example
 *
 * // from Typescript
 * export interface ElkNode extends ElkShape {
 *     id: string
 *     children?: ElkNode[]
 *     ports?: ElkPort[]
 *     edges?: ElkExtendedEdge[]
 * }
 */

/**
 * Various tools to arrange the graph view (semi-)automatically.
 *
 * Uses among other things Eclipse Layout Kernel (aka. ELK).
 *
 * ELK's documentation is available at:
 * {@link https://eclipse.dev/elk/}
 *
 * What we use here elkjs, which is a transpiled version
 * from Java to Javascript :
 * {@link https://github.com/kieler/elkjs}
 * @augments DefaultLayout
 */
class ElkLayout extends DefaultLayout {
  /**
   * ELK import.
   * @type {ELK}
   * @private
   * @constant
   */
  static elk = new ELK();

  /**
   * Automatically arrange components.
   * @param {string} [containerId] - The container within which we need to organize the children,
   * and if not specified, all components will be reorganized.
   * @returns {Promise<void>} Promise with nothing on success otherwise an error.
   */
  async arrangeComponentsPosition(containerId) {
    const components = containerId
      ? this.pluginData.getChildren(containerId)
      : this.pluginData.components;
    const links = this.pluginData.getLinks();

    const layout = await this.generateAllElkLayouts(components, links);

    this.writeLayout(layout);
  }

  /**
   * Generate automatic layout for a given graph.
   * @param {Component[]} components - The components to be automatically arranged.
   * @param {ComponentLink[]} links - Links between the given components.
   * @returns {Promise<ElkNode[]>} A layout for the graph, see {@link writeLayout}.
   * @private
   */
  async generateAllElkLayouts(components, links) {
    // Get tree nodes from components (each node represents a single component and its relations).
    const nodes = this.getNodes(components);

    // TODO : render to screen between each hierarchical render in order to get the proper sizes.
    // or compute the final sizes/length ahead of time
    // (ie. without actually re-rendering w/ D3/nunjuncks).

    // For each parent, from the deepest nodes up to the root, get a layout for its children.
    return Promise.all(
      this.getParentsByDepth(nodes)
        .map(
          (node) => this.generateELKLayout(node, nodes, links),
        ),
    );
  }

  /**
   * Write a generated layout to the corresponding graph.
   * @param {ElkNode[]} layout - previously generated layout, see {@link generateAllElkLayouts}.
   * @private
   */
  writeLayout(layout) {
    layout.forEach((elkNode) => this.writeSingleDepthLayout(elkNode));
  }

  /**
   * Build a {@link NodeData} map from the components.
   * @param {Component[]} components - Input components.
   * @returns {Map<string, NodeData>} A map of nodes.
   * @private
   */
  getNodes(components) {
    // Constructing our data objects from the given components.
    /** @type {Map<string,NodeData>} */
    const nodes = new Map(components.map((component) => [component.id, {
      raw: component,
      children: [],
      parent: null,
      depth: null,
    }]));

    // Defines the root.
    /** @type {NodeData} */
    const root = {
      raw: null,
      children: [],
      parent: null,
      depth: 0,
    };

    // Register children inside the parents.
    nodes.forEach((node) => {
      node.parent = nodes.get(node.raw.getContainerId()) || root;
      node.parent.children.push(node);
    });

    // Computes depth for each node.
    nodes.forEach((node) => {
      node.depth = this.getNodeDepth(node);
    });

    return nodes;
  }

  /**
   * Return all unique parents (ie. nodes that have at least a child) sorted by decreasing depth.
   * @param {Map<string,NodeData>} nodes - Some nodes.
   * @returns {NodeData[]} All unique parents.
   * @private
   */
  getParentsByDepth(nodes) {
    /** @type {NodeData[]} */
    const allParents = Array.from(nodes.values())
      .filter((node) => node.parent)
      .map((node) => node.parent);

    /** @type {(NodeData)[]} */
    const uniqueParents = Array.from(new Set(allParents));

    // Sorted by decreasing depth.
    return uniqueParents.sort((node1, node2) => node2.depth - node1.depth);
  }

  /**
   * Compute the layout for the children of a single node.
   * @param {NodeData} parentNode - The node.
   * @param {Map<string,NodeData>} nodes - All nodes in the graph.
   * @param {ComponentLink[]} links - All links in the graph.
   * @returns {Promise<ElkNode>} A layout for the children of {@link parentNode}.
   * @private
   */
  async generateELKLayout(parentNode, nodes, links) {
    const layoutOptions = this.pluginData.configuration.elkParams;

    // We prepare the input in the format expected by ELK.
    const graph = {
      id: parentNode.raw ? parentNode.raw.id : 'root',
      layoutOptions,
      children: [],
      edges: [],
    };

    graph.children = parentNode.children
    // Convert to the format expected by ELK.
      .map((node) => ({
        id: node.raw.id,
        width: node.raw.drawOption.width,
        height: node.raw.drawOption.height,
        x: node.raw.drawOption.x,
        y: node.raw.drawOption.y,
        layoutOptions,
      }));

    // We get the links that have source and target in the children of `node`.
    const localLinks = this.getLinksForChildren(nodes, links, parentNode);

    // Convert the edges to the format expected by ELK.
    graph.edges = localLinks.map(({ source, target }) => ({
      id: `${source}__${target}`,
      sources: [source],
      targets: [target],
    }));

    // Finally calling ELK.
    return ElkLayout.elk.layout(graph);
  }

  /**
   * Write a generated layout at a single level of hierarchy to the graph.
   * @param {ElkNode} elkNode - Previously generated layout with a single level of hierarchy.
   * @private
   */
  writeSingleDepthLayout(elkNode) {
    const nodes = new Map(elkNode.children
      .map((node) => [node.id, {
        x: node.x,
        y: node.y,
      }]));

    this.pluginData.components
      .filter(({ id }) => nodes.has(id))
      .forEach((component) => {
        const { x, y } = nodes.get(component.id);

        component.drawOption.x = x;
        component.drawOption.y = y;
      });
  }

  /**
   * Compute a node's depth (ie. distance to the root).
   * @param {NodeData} node - A node.
   * @returns {number} Depth.
   * @private
   */
  getNodeDepth(node) {
    let depth = 0;
    let currentNode = node;

    while (currentNode.parent) {
      depth += 1;
      currentNode = currentNode.parent;
    }

    return depth;
  }

  /**
   * Keep only the links that are contained within {@link nodes} children.
   * @param {Map<string,NodeData>} nodes - All the nodes.
   * @param {ComponentLink[]} allLinks - All the links.
   * @param {NodeData} parentNode - Node whose we want the inner links.
   * @returns {{source:string,target:string}} Inner links represented as pairs of nodes ids.
   * @private
   */
  getLinksForChildren(nodes, allLinks, parentNode) {
    const childrenIds = new Set(parentNode.children
      .map((node) => node.raw?.id));

    const currentDepth = parentNode.depth + 1;

    return allLinks
    // Ignore links that are unrelated to given container
      .filter(({ source, target }) => nodes.has(source) && nodes.has(target))
      .map((link) => {
        // We operate only at a given depth.
        // Therefore we climb in the hierarchy if needed.
        // (Read the text at the beginning of this file to understand.)
        const source = this.getAncestorByDepth(nodes.get(link.source), currentDepth);
        const target = this.getAncestorByDepth(nodes.get(link.target), currentDepth);

        return { source, target };
      })
      // Source and target must be different and non-falsy.
      // They can be undefined if ancestors of the same depth have
      // not been found in the previous block.
      .filter(({ source, target }) => source !== target && source && target)
    // Keep only nodes we are here interested in.
      .filter(({ source, target }) => childrenIds.has(source.raw.id)
          && childrenIds.has(target.raw.id))
    // Format conversion.
      .map(({ source, target }) => ({
        source: source.raw.id,
        target: target.raw.id,
      }));
  }

  /**
   * Get the ancestor of a node with given depth.
   * If it makes no sense (asked depth < node's depth), returns null.
   * @param {NodeData} from - Node from which we want an ancestor.
   * @param {number} depth - Desired depth.
   * @returns {NodeData} `from` 's ancestor or null.
   * @private
   */
  getAncestorByDepth(from, depth) {
    let node = from;

    if (node.depth < depth) {
      return null;
    }

    while (node.depth > depth) {
      node = node.parent;
    }

    return node;
  }

  /**
   * Reposition a component where there is room for it.
   * @param {string} componentId - Id of a component to be repositioned.
   */
  repositionComponent(componentId) {
    const component = this.pluginData.getComponentById(componentId);
    const { x, y } = this.getFreeCoordinatesForComponent(component);

    component.drawOption.x = x;
    component.drawOption.y = y;
  }

  /**
   * Get coordinates where there is free space for the given component.
   * This function has no side effect (ie. does not actually move the component).
   * @param {Component} componentToBePlaced - A component.
   * @returns {{x: number, y: number}} Coordinates for the component.
   * @private
   */
  getFreeCoordinatesForComponent(componentToBePlaced) {
    // Rectangles to be avoided ; Those represent occupied space.
    const rectangles = [];

    // Generate rectangles from components.
    rectangles.push(...this.getComponentsRectangles(componentToBePlaced));

    // Generate rectangles the links.
    rectangles.push(...this.getLinksRectangles(componentToBePlaced));

    // Get free space for out component, colliding with no rectangle.
    return this.getNonCollidingSpace(componentToBePlaced, rectangles);
  }
  /**
   * A rectangle.
   * @typedef {object} Rectangle
   * @property {number} x - X coordinate of the top-left corner.
   * @property {number} y - Y coordinate of the top-left corner.
   * @property {number} width - Rectangle's width.
   * @property {number} height - Rectangle's height.
   */

  /**
   * Get a free space a component, given the rectangles that may collide.
   * @param {Component} componentToBePlaced - A component.
   * @param {Rectangle[]} rectangles - Rectangles that may collide.
   * @returns {{x: number, y: number}} Coordinates for the component.
   * @private
   */
  getNonCollidingSpace(componentToBePlaced, rectangles) {
    const {
      startingX,
      startingY,
      maxX,
      maxY,
    } = this.getSearchBoundaries(componentToBePlaced);

    const {
      width: componentWidth,
      height: componentHeight,
    } = componentToBePlaced.drawOption;

    const { precision } = this.pluginData.configuration.singleComponentParams;

    for (let x = startingX; x < maxX; x += precision) {
      for (let y = startingY; y < maxY; y += precision) {
        const targetRectangle = {
          x,
          y,
          width: componentWidth,
          height: componentHeight,
        };

        if (!this.collidesWithRectangles(targetRectangle, rectangles)) {
          return { x, y };
        }
      }
    }

    // We should never arrive here if the algorithms works as intended.
    // Default values are provided to avoid a crash.
    return { x: 0, y: 0 };
  }

  /**
   * Return rectangles enclosing each link at the surface (shallowest depth).
   * @param {Component} componentToIgnore - A component which links we must ignore.
   * @returns {Rectangle[]} An array of rectangles, enclosing the links.
   * @private
   */
  getLinksRectangles(componentToIgnore) {
    return this.pluginData.getLinks()
      // We get the shallowest ancestors.
      // Following this, source and target are not Ids anymore but actual component objects.
      .map(({ source, target }) => (
        {
          source: this.getShallowestAncestor(source),
          target: this.getShallowestAncestor(target),
        }
      ))
      // Ignore self-links and links including the component that is to be placed.
      .filter(({ source, target }) => source !== target
        && source !== componentToIgnore
        && target !== componentToIgnore)
      // Computing the center of source/target components rectangles.
      .map(({
        source,
        target,
      }) => ({
        source: {
          x: source.drawOption.x + source.drawOption.width / 2,
          y: source.drawOption.y + source.drawOption.height / 2,
        },
        target: {
          x: target.drawOption.x + target.drawOption.width / 2,
          y: target.drawOption.y + target.drawOption.height / 2,
        },
      }))
      // Finally building the rectangle associated to each link.
      // (We are not adding the margins here.)
      .map(({
        source,
        target,
      }) => {
        const x = Math.min(source.x, target.x);
        const y = Math.min(source.y, target.y);

        const width = Math.max(source.x, target.x) - x;
        const height = Math.max(source.y, target.y) - y;

        return {
          x,
          y,
          width,
          height,
        };
      });
  }

  /**
   * Return rectangles enclosing each component at the surface (shallowest depth).
   * @param {Component} componentToIgnore - A component that we must ignore.
   * @returns {Rectangle[]} An array of rectangles, enclosing the links.
   * @private
   */
  getComponentsRectangles(componentToIgnore) {
    const { margin } = this.pluginData.configuration.singleComponentParams;

    return this.pluginData.components
      // Ignore the component to be placed.
      .filter((e) => e !== componentToIgnore)
      // First level of depth (ie. not inside a container).
      .filter((e) => e.getContainerId() === null)
      .map((e) => e.drawOption)
      // Adding the margin.
      .map((e) => ({
        x: e.x - margin / 2,
        y: e.y - margin / 2,
        width: e.width + margin,
        height: e.height + margin,
      }));
  }

  /**
   * Compute the search boundaries, ie. the space within which we should search for a free rectangle
   * in order to avoid putting it too far away from other already-positioned components.
   * @param {Component} componentToBePlaced - A component.
   * @returns {{startingY: number, maxY: number, startingX: number, maxX: number}} Coordinates
   * and size of the search boundaries.
   * @private
   */
  getSearchBoundaries(componentToBePlaced) {
    // Starting coordinates for our search.
    let startingX = +Infinity;
    let startingY = +Infinity;

    // Maximum coordinates.
    let maxX = -Infinity;
    let maxY = -Infinity;

    this.pluginData.components.forEach((component) => {
      if (component === componentToBePlaced) {
        return;
      }

      // We want to get the most upper-left coordinates.
      startingX = Math.min(startingX, component.drawOption.x);
      startingY = Math.min(startingY, component.drawOption.y);

      // We want to get the most bottom-right coordinates.
      maxX = Math.max(maxX, component.drawOption.x
        + component.drawOption.width
        - componentToBePlaced.drawOption.width);
      maxY = Math.max(maxY, component.drawOption.y
        + component.drawOption.height
        - componentToBePlaced.drawOption.height);
    });

    // If the screen rectangle is full, put the component on the top right.
    // (We just give extra space so that the search algorithm will eventually
    // find this space which must be free).
    maxX += this.pluginData.configuration.singleComponentParams.precision
      + this.pluginData.configuration.singleComponentParams.margin
      + componentToBePlaced.drawOption.width;

    return {
      startingX,
      startingY,
      maxX,
      maxY,
    };
  }

  /**
   * Get the shallowest ancestor of a component.
   * @param {string} componentId - A component's id.
   * @returns {Component} Shallowest ancestor of the given component.
   * @private
   */
  getShallowestAncestor(componentId) {
    let component = this.pluginData.getComponentById(componentId);
    let containerId = component.getContainerId();

    while (containerId !== null) {
      component = this.pluginData.getComponentById(containerId);
      containerId = component.getContainerId();
    }

    return component;
  }

  /**
   * Check collision between a target rectangle and a given array of rectangles.
   * @param {Rectangle} targetRectangle - The target rectangle.
   * @param {Rectangle[]} rectangles - A set of rectangles.
   * @returns {boolean} True if the target rectangle collides with a given
   * rectangle, false otherwise.
   * @private
   */
  collidesWithRectangles(targetRectangle, rectangles) {
    const {
      x, y, width, height,
    } = targetRectangle;

    return !!rectangles.find((rect) => {
      const collidesHorizontally = (x <= rect.x && rect.x <= x + width)
          || (x <= rect.x + rect.width && rect.x + rect.width <= x + width)
          || (rect.x <= x && x <= rect.x + rect.width)
          || (rect.x <= x + width && x + width <= rect.x + rect.width);

      const collidesVertically = (y <= rect.y && rect.y <= y + height)
          || (y <= rect.y + rect.height && rect.y + rect.height <= y + height)
          || (rect.y <= y && y <= rect.y + rect.height)
          || (rect.y <= y + height && y + height <= rect.y + rect.height);

      return collidesVertically && collidesHorizontally;
    });
  }
}

export default ElkLayout;
