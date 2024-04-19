class Action {
  constructor(pluginData, viewport, layout) {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.pluginData = pluginData;

    this.viewport = viewport;
    this.layout = layout;
  }

  execute(event) {
    return false; // not have to redraw
  }

  finalize(event) {
    return false; // not have to redraw
  }

  applySceneTransform() {
    const { x, y, zoom } = this.pluginData.scene;
    const translate = `translate(${x} ${y})`;
    const scale = `scale(${zoom})`;

    this.viewport.selectAll('.scene > g').attr('transform', `${translate} ${scale}`);
  }

  getSourcesId(event) {
    if (this.pluginData.scene.selection.length === 0) {
      return [event.subject.datum().data.id];
    }
    if (this.pluginData.scene.selection.includes(event.subject.datum().data.id)) {
      return this.pluginData.scene.selection;
    }

    return [event.subject.datum().data.id];
  }

  getSourcePosition(sourceId) {
    const sourceModel = this.viewport.select(`.${sourceId} .model`);

    return {
      x: parseFloat(sourceModel.attr('x')),
      y: parseFloat(sourceModel.attr('y')),
    };
  }

  getTargetsId(event) {
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
      } = this.viewport.select(`.${element.data.id} rect.background`)
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

    return targetsByDepth.flat().reverse();
  }

  getTargetId(event) {
    const sourceId = event.subject.datum().data.id;
    const {
      clientX: x,
      clientY: y,
    } = event.sourceEvent;
    const targetsByDepth = [];

    this.viewport.selectAll(`g.component:not(.${sourceId})`).each((element) => {
      // Can't take x, y, width and height from #element.data.id because, width is growing with
      // component moving.
      const {
        x: eX,
        y: eY,
        width,
        height,
      } = this.viewport.select(`.${element.data.id} rect.background`)
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

    return targetsByDepth.flat().reverse()[0];
  }

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
