/**
 * Represents an interface action.
 */
class Action {
  /**
   * Default constructor.
   * @param {DefaultData} pluginData - Plugin data storage.
   * @param {object} viewport - D3 selection of the view port.
   * @param {DefaultLayout} layout - Layout to organise components.
   */
  constructor(pluginData, viewport, layout) {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.pluginData = pluginData;
    /**
     * D3 selection of the view port.
     * @type {object}
     */
    this.viewport = viewport;
    /**
     * Layout to organise components.
     * @type {DefaultLayout}
     */
    this.layout = layout;
  }

  /**
   * Executes the action.
   * @param {object} event - The event triggering the action.
   * @returns {boolean} Indicates whether the scene needs to be redrawn.
   */
  // eslint-disable-next-line no-unused-vars
  execute(event) {
    return false;
  }

  /**
   * Finalizes the action.
   * @param {object} event - The event triggering the action.
   * @returns {boolean} Indicates whether the scene needs to be redrawn.
   */
  // eslint-disable-next-line no-unused-vars
  finalize(event) {
    return false;
  }

  /**
   * Applies the scene transformation based on the plugin data.
   */
  applySceneTransform() {
    const { x, y, zoom } = this.pluginData.scene;
    const translate = `translate(${x} ${y})`;
    const scale = `scale(${zoom})`;

    this.viewport.selectAll('.scene > g').attr('transform', `${translate} ${scale}`);
  }

  /**
   * Gets the source IDs from the event.
   * @param {object} event - The event containing the source information.
   * @returns {string[]} The array of source IDs.
   */
  getSourcesId(event) {
    if (this.pluginData.scene.selection.includes(event.subject.datum().data.id)) {
      return this.pluginData.scene.selection;
    }

    return [event.subject.datum().data.id];
  }

  /**
   * Gets the position of the source.
   * @param {string} sourceId - The ID of the source.
   * @returns {object} The position of the source.
   */
  getSourcePosition(sourceId) {
    const sourceModel = this.viewport.select(`.${sourceId} .model`);

    return {
      x: parseFloat(sourceModel.attr('x')),
      y: parseFloat(sourceModel.attr('y')),
    };
  }

  /**
   * Gets the targets by depth from the event.
   * @param {object} event - The event containing the target information.
   * @returns {string[][]} An array of target IDs grouped by depth.
   */
  getTargetsByDepth(event) {
    const sourceId = event.subject.datum().data.id;
    const {
      clientX: x,
      clientY: y,
    } = event.sourceEvent;
    const targetsByDepth = [];

    this.viewport.selectAll(`g.component.container:not(.${sourceId})`).each((element) => {
      // Can't take x, y, width and height from #element.data.id because, width is growing with
      // component moving.
      const {
        x: eX,
        y: eY,
        width,
        height,
      } = this.viewport.select(`.${element.data.id} .background`)
        .node()
        .getBoundingClientRect();

      if (!(x >= eX && x <= eX + width && y >= eY && y <= eY + height)) {
        return;
      }

      const depth = parseInt(
        this.viewport.select(`.${element.data.id}`).attr('depth'),
        10,
      ) - 1;

      while (targetsByDepth.length <= depth) {
        targetsByDepth.push([]);
      }

      targetsByDepth[depth].push(element.data.id);
    });

    return targetsByDepth;
  }

  /**
   * Gets the target IDs from the event. Ids are ordered by depth, from the deepest to the
   * shallowest.
   * @param {object} event - The event containing the target information.
   * @returns {string[]} An array of target IDs.
   */
  getTargetsId(event) {
    const targetsByDepth = this.getTargetsByDepth(event);

    return targetsByDepth.flat().reverse();
  }

  /**
   * Gets the primary target ID from the event.
   * @param {object} event - The event containing the target information.
   * @returns {string} The primary target ID.
   */
  getTargetId(event) {
    return this.getTargetsId(event)[0];
  }

  /**
   * Gets the transformation between two selectors.
   * @param {string} selector1 - The first selector.
   * @param {string} selector2 - The second selector.
   * @returns {object} The transformation between the two selectors.
   */
  getTransform(selector1, selector2) {
    const {
      x: sourceX,
      y: sourceY,
    } = this.viewport.select(selector1).node().getBoundingClientRect();
    const {
      x: targetX,
      y: targetY,
    } = this.viewport.select(selector2).node().getBoundingClientRect();

    return {
      dx: sourceX - targetX,
      dy: sourceY - targetY,
    };
  }
}

export default Action;
