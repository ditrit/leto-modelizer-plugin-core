import DefaultDrawer from './DefaultDrawer';

// TODO : redraw minimap when necessary
// TODO : feature: highlight user's view
// TODO : feature: teleport on click

/**
 * Class that draws a component in a graphical representation in a way suited for a mini map.
 *
 * It works by using a stripped-down version of DefaultDrawer with a single reduced model
 * template for all components. The difference in shape is managed inside the template.
 *
 * To define custom shapes, edit the template.
 * @see {this.resources}
 */
class MiniMapDrawer extends DefaultDrawer {
  /**
   * Mini map drawer constructor.
   * @param {DefaultData} pluginData - Plugin data storage.
   * @param {object} [resources] - Object that contains resources.
   * @param {string} [viewPortID] - ID of HTML element where we want to draw.
   * @param {number} [margin] - Margin inside this mini map.
   */
  constructor(
    pluginData,
    resources = null,
    viewPortID = 'mini-map-view-port',
    margin = 50,
  ) {
    super(pluginData, resources, viewPortID);
    this.__margin = margin;
  }

  // TODO: after super.draw() refacto, copy proper doc here
  /**
   * Draw.
   * @public
   */
  draw() {
    super.draw();

    // Smallest rectangle in which the object fits.
    const e = this.root.node().getBBox();

    // Make the content vit mini map view.
    this.root.attr('viewBox', `${e.x - this.__margin}`
        + ` ${e.y - this.__margin}`
        + ` ${e.width + 2 * this.__margin}`
        + ` ${e.height + 2 * this.__margin}`);
  }

  // TODO: after super.draw() refacto, copy proper doc here
  /**
   * Returns SVG model for given model identifier.
   * @param {string} model - A model identifier.
   * @returns {string} - SVG template source for the model.
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  __getModel(model) {
    // This is a constant.
    // Difference between components is managed inside the resource template.
    return this.resources.models.universal;
  }
}

export default MiniMapDrawer;
