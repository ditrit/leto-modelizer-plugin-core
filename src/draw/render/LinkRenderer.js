import * as d3 from 'd3';
import { renderString } from 'nunjucks';

/**
 * Class to render link.
 */
class LinkRenderer {
  /**
   * Default constructor.
   * @param {DefaultData} pluginData - Plugin data storage.
   * @param {object} viewport - D3 selection of the view port.
   */
  constructor(pluginData, viewport) {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.pluginData = pluginData || null;

    /**
     * D3 selection of the view port.
     * @type {Selection}
     */
    this.viewport = viewport || null;
  }

  /**
   * Render nodes for each link.
   */
  render() {
    const scenePosition = this.viewport.select('.scene').node().getBoundingClientRect();

    this.viewport.select('.scene .links').selectAll('.link')
      .data(() => this.pluginData.getLinks())
      .join('g')
      .attr('class', (link) => `${link.source}_to_${link.target} link`)
      .attr('from', (link) => link.source)
      .attr('to', (link) => link.target)
      .html((link) => {
        let sourceAnchor;
        let targetAnchor;

        if (link.isTemporary) {
          sourceAnchor = this.viewport
            .select(`.${link.source} .anchors .anchor[name="${link.anchorName}"]`)
            .node()
            .getBoundingClientRect();
          sourceAnchor = {
            name: link.anchorName,
            x: sourceAnchor.x + sourceAnchor.width / 2,
            y: sourceAnchor.y + sourceAnchor.height / 2,
            width: sourceAnchor.width,
          };
          targetAnchor = {
            x: link.endX,
            y: link.endY,
          };
        } else {
          sourceAnchor = this.getClosestAnchor(link.source, link.target);
          targetAnchor = this.getClosestAnchor(link.target, link.source);
        }

        return renderString(
          this.pluginData.resources.links[link.definition.model] || '',
          {
            d: this.getLinkPoints(scenePosition, sourceAnchor, targetAnchor),
          },
        );
      });
  }

  /**
   * Get path definition of a link.
   * @param {object} scene - BoundingClientRect of the scene.
   * @param {object} sourceAnchor - BoundingClientRect of the source anchor.
   * @param {object} targetAnchor - BoundingClientRect of the target anchor.
   * @returns {string} Path definition.
   */
  getLinkPoints(scene, sourceAnchor, targetAnchor) {
    const endPosition1 = this.getReducedPointPositionOnSegment(
      sourceAnchor.x,
      sourceAnchor.y,
      targetAnchor.x,
      targetAnchor.y,
      10,
    );
    const endPosition2 = this.getReducedPointPositionOnSegment(
      sourceAnchor.x,
      sourceAnchor.y,
      targetAnchor.x,
      targetAnchor.y,
      5,
    );
    const startX = (sourceAnchor.x - scene.x - this.pluginData.scene.x)
      / this.pluginData.scene.zoom;
    const startY = (sourceAnchor.y - scene.y - this.pluginData.scene.y)
      / this.pluginData.scene.zoom;
    const end1X = (endPosition1.x - scene.x - this.pluginData.scene.x)
      / this.pluginData.scene.zoom;
    const end1Y = (endPosition1.y - scene.y - this.pluginData.scene.y)
      / this.pluginData.scene.zoom;
    const end2X = (endPosition2.x - scene.x - this.pluginData.scene.x)
      / this.pluginData.scene.zoom;
    const end2Y = (endPosition2.y - scene.y - this.pluginData.scene.y)
      / this.pluginData.scene.zoom;
    const drawCurve = d3.line().curve(d3.curveBasis);

    return drawCurve([
      [startX, startY],
      [startX + (end1X - startX) * 0.2, startY + (end1Y - startY) * 0.8],
      [end1X, end1Y],
      [end2X, end2Y],
    ]);
  }

  /**
   * Get the closest anchor of a source component to a target component.
   * @param {string} sourceId - Source component id.
   * @param {string} targetId - Target component id.
   * @returns {object} - Object that contains name, position and width of the source anchor.
   */
  getClosestAnchor(sourceId, targetId) {
    const targetPosition = this.viewport.select(`.${targetId} .background`)
      .node().getBoundingClientRect();
    const targetX = targetPosition.x + targetPosition.width / 2;
    const targetY = targetPosition.y + targetPosition.height / 2;

    let minDistance = null;
    let closestAnchor = null;

    this.viewport.selectAll(`.${sourceId}.anchors .anchor`).each((_, index, data) => {
      const anchorElement = data[index];
      const anchorName = anchorElement.attributes.name.value;
      const anchorPosition = anchorElement.getBoundingClientRect();
      const deltaX = targetX - anchorPosition.x;
      const deltaY = targetY - anchorPosition.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (closestAnchor === null || distance < minDistance) {
        minDistance = distance;
        closestAnchor = {
          name: anchorName,
          x: anchorPosition.x + anchorPosition.width / 2,
          y: anchorPosition.y + anchorPosition.height / 2,
          width: anchorPosition.width,
        };
      }
    });

    return closestAnchor;
  }

  /**
   * Computes a new point on the line segment defined by (xa, ya) and (xb, yb) that is reduced by a
   * specified distance from the end point (xb, yb).
   * @param {number} xa - The x-coordinate of the start point of the segment.
   * @param {number} ya - The y-coordinate of the start point of the segment.
   * @param {number} xb - The x-coordinate of the end point of the segment.
   * @param {number} yb - The y-coordinate of the end point of the segment.
   * @param {number} reduction - The distance by which to reduce the segment from the end point
   * (xb, yb).
   * @returns {object} An object containing the x and y coordinates of the new point on the segment.
   */
  getReducedPointPositionOnSegment(xa, ya, xb, yb, reduction) {
    if (xa === xb && ya === yb) {
      return { x: 0, y: 0 };
    }

    const dx = xb - xa;
    const dy = yb - ya;

    const abLength = Math.sqrt(dx * dx + dy * dy);
    const abPrimeLength = abLength - reduction;
    const reductionFactor = abPrimeLength / abLength;

    return {
      x: xa + dx * reductionFactor,
      y: ya + dy * reductionFactor,
    };
  }
}

export default LinkRenderer;
