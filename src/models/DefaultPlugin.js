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
   *
   * @param {object} [props={}] - Object that contains all properties to set.
   * @param {object} [props.event=null] - Event manager.
   * @param {Function} [props.event.next] - Function to emit event.
   * @param {DefaultData} props.pluginData - Plugin data storage.
   * @param {DefaultDrawer} props.pluginDrawer - Plugin drawer.
   * @param {DefaultMetadata} props.pluginMetadata - Plugin metadata.
   * @param {DefaultParser} props.pluginParser - Plugin parser.
   * @param {DefaultRender} props.pluginRenderer - Plugin renderer.
   */
  constructor(props = {
    event: null,
    pluginData: null,
    pluginDrawer: null,
    pluginMetadata: null,
    pluginParser: null,
    pluginRenderer: null,
  }) {
    /**
     * Plugin data storage.
     *
     * @type {DefaultData}
     */
    this.data = props.pluginData || new DefaultData({}, props.event);
    /**
     * Plugin drawer.
     *
     * @type {DefaultDrawer}
     * @private
     */
    this.__drawer = props.pluginDrawer || new DefaultDrawer(this.data);
    /**
     * Plugin metadata.
     *
     * @type {DefaultMetadata}
     * @private
     */
    this.__metadata = props.pluginMetadata || new DefaultMetadata(this.data);
    /**
     * Plugin parser.
     *
     * @type {DefaultParser}
     * @private
     */
    this.__parser = props.pluginParser || new DefaultParser(this.data);
    /**
     * Plugin renderer.
     *
     * @type {DefaultRender}
     * @private
     */
    this.__renderer = props.pluginRenderer || new DefaultRender(this.data);
  }

  /**
   * Init method, to call once before all plugin usages.
   */
  init() {
    this.__metadata.parse();
    this.data.initLinkDefinitions();
  }

  /**
   * Set resources in plugin.
   *
   * @param {object} [resources=null] - Object that contains resources.
   */
  initResources(resources) {
    this.__drawer.resources = resources;
  }

  /**
   * Draws all data in the html element defined by the id.
   *
   * @param {string} id - Html id, without '#'.
   */
  draw(id) {
    this.__drawer.draw(id);
  }

  /**
   * Convert the content of files into plugin data.
   * Configuration file is used for setting up the components' configuration.
   *
   * @param {FileInput} file - Configuration file of components.
   * @param {FileInput[]} [inputs=[]] - File inputs you want to parse.
   */
  parse(file, inputs) {
    this.__parser.parse(inputs);
    this.__parser.parseConfiguration(file);
  }

  /**
   * Indicate if this parser can parse this file.
   *
   * @param {FileInformation} fileInformation - File information.
   * @returns {boolean} - Boolean that indicates if this file can be parsed or not.
   */
  isParsable(fileInformation) {
    return this.__parser.isParsable(fileInformation);
  }

  /**
   * Return all generated files from plugin data.
   * Configuration file is used for saving the components' configuration.
   *
   * @param {FileInput} configurationFile - Configuration file of components.
   * @param {FileInput[]} files - File inputs you want to render.
   * @returns {FileInput[]} All generated files including the configuration file.
   */
  render(configurationFile, files) {
    this.__renderer.renderConfiguration(configurationFile);

    return this.__renderer.render(files).concat(configurationFile);
  }
}

export default DefaultPlugin;
