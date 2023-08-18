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
   * @returns {Promise<void>} Promise with nothing on success otherwise an error.
   */
  async arrangeComponentsPosition() {
    const { components } = this.pluginData;
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
}

export default ElkLayout;
