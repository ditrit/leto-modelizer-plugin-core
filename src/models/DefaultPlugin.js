import DefaultData from './DefaultData';
import DefaultDrawer from '../draw/DefaultDrawer';
import DefaultMetadata from '../metadata/DefaultMetadata';
import DefaultParser from '../parser/DefaultParser';
import DefaultRender from '../render/DefaultRender';

/**
 * Default plugin structure.
 */
class DefaultPlugin {
  /**
   * Default constructor.
   * @param {DefaultData} props.pluginData - Plugin data storage.
   * @param {DefaultDrawer} props.pluginDrawer - Plugin drawer.
   * @param {DefaultMetadata} props.pluginMetadata - Plugin metadata.
   * @param {DefaultParser} props.pluginParser - Plugin parser.
   * @param {DefaultRender} props.pluginRenderer - Plugin renderer.
   */
  constructor(props = {
    pluginData: null,
    pluginDrawer: null,
    pluginMetadata: null,
    pluginParser: null,
    pluginRenderer: null,
  }) {
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.data = props.pluginData || new DefaultData();
    /**
     * Plugin drawer.
     * @type {DefaultDrawer}
     * @private
     */
    this.__drawer = props.pluginDrawer || new DefaultDrawer(this.data);
    /**
     * Plugin metadata.
     * @type {DefaultMetadata}
     * @private
     */
    this.__metadata = props.pluginMetadata || new DefaultMetadata(this.data);
    /**
     * Plugin parser.
     * @type {DefaultParser}
     * @private
     */
    this.__parser = props.pluginParser || new DefaultParser(this.data);
    /**
     * Plugin renderer.
     * @type {DefaultRender}
     * @private
     */
    this.__renderer = props.pluginRenderer || new DefaultRender(this.data);
  }

  /**
   * Init method, to call once before all plugin usages.
   * Set events in plugin and initialize metadata.
   * @param {Function} [events.SelectEvent.next] - Function to emit selection event, use by the
   * drawer.
   * @param {Function} [events.EditEvent.next] - Function to emit edit event, use by the drawer.
   * @param {Function} [events.DeleteEvent.next] - Function to emit delete event, use by the drawer.
   */
  init(events) {
    console.log('START', 'init');
    this.__drawer.setEvents(events);
    this.__metadata.parse();
    this.data.initLinkDefinitions();
    console.log('STOP', 'init');
  }

  /**
   * Set resources in plugin.
   * @param {Object} [resources=null] - Object that contains resources.
   */
  initResources(resources) {
    this.__drawer.resources = resources;
  }

  /**
   * Draws all data in the html element defined by the id.
   * @param {String} id - Html id, without '#'.
   */
  draw(id) {
    console.log('START', 'draw');
    this.__drawer.draw(id)
    console.log('STOP', 'draw');
  }

  /**
   * Convert the content of files into plugin data.
   * @param {FileInput[]} [inputs=[]] - File inputs you want to parse.
   */
  parse(inputs) {
    console.log('START', 'parse');
    this.__parser.parse(inputs);
    console.log('START', 'parse');
  }

  /**
   * Indicate if this parser can parse this file.
   * @param {FileInformation} fileInformation - File information.
   * @return {Boolean} - Boolean that indicates if this file can be parsed or not.
   */
  isParsable(fileInformation) {
    return this.__parser.isParsable(fileInformation);
  }

  /**
   * Return all generated files from plugin data.
   * @return {FileInput[]} All generated files.
   */
  render() {
    console.log('START', 'render');
    return this.__renderer.render();
  }
}

export default DefaultPlugin;
