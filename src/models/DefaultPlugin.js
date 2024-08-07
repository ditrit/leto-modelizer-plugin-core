import DefaultData from './DefaultData';
import DefaultDrawer from '../draw/DefaultDrawer';
import DefaultMetadata from '../metadata/DefaultMetadata';
import DefaultParser from '../parser/DefaultParser';
import DefaultRender from '../render/DefaultRender';
import DefaultConfiguration from './DefaultConfiguration';

/**
 * Default plugin structure.
 */
class DefaultPlugin {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {object} [props.event] - Event manager.
   * @param {Function} [props.event.next] - Function to emit event.
   * @param {DefaultConfiguration} [props.configuration] - Plugin configuration.
   * @param {DefaultData} [props.pluginData] - Plugin data storage.
   * @param {DefaultDrawer} [props.pluginDrawer] - Plugin drawer.
   * @param {DefaultMetadata} [props.pluginMetadata] - Plugin metadata.
   * @param {DefaultParser} [props.pluginParser] - Plugin parser.
   * @param {DefaultRender} [props.pluginRenderer] - Plugin renderer.
   */
  constructor(props = {
    event: null,
    configuration: null,
    pluginData: null,
    pluginDrawer: null,
    pluginMetadata: null,
    pluginParser: null,
    pluginRenderer: null,
  }) {
    /**
     * Plugin configuration.
     * @type {DefaultConfiguration}
     */
    this.configuration = props.configuration || new DefaultConfiguration();
    /**
     * Plugin data storage.
     * @type {DefaultData}
     */
    this.data = props.pluginData || new DefaultData(this.configuration, {}, props.event);
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
   */
  init() {
    const id = this.data.emitEvent({
      type: 'Plugin',
      action: 'init',
      status: 'running',
    });

    this.__metadata.parse(id);
    this.data.initLinkDefinitions(id);

    this.data.emitEvent({ id, status: 'success' });
  }

  /**
   * Set resources in plugin.
   * @param {object} [resources] - Object that contains resources.
   */
  initResources(resources) {
    this.data.resources = resources;
  }

  /**
   * Init drawing context of plugin.
   * @param {string} id - Html id of div that will be the drawing container.
   * @param {boolean} readOnly - If false, indicate if user can make action or modify the scene.
   */
  initDrawer(id, readOnly) {
    this.__drawer.init(id, readOnly);
  }

  /**
   * Draws all data in the html element defined by the id.
   */
  draw() {
    this.__drawer.draw();
  }

  /**
   * Convert the content of files into plugin data.
   * Configuration file is used for setting up the components' configuration.
   * @param {FileInformation} diagram - Diagram file information.
   * @param {FileInput} file - Configuration file of components.
   * @param {FileInput[]} [inputs] - File inputs you want to parse.
   */
  parse(diagram, file, inputs = []) {
    const id = this.data.emitEvent({
      type: 'Parser',
      action: 'read',
      status: 'running',
      files: inputs.map(({ path }) => path).concat(file?.path),
      data: {
        global: true,
      },
    });

    this.__parser.parse(diagram, inputs, id);
    this.__parser.parseConfiguration(diagram, file, id);

    this.data.emitEvent({ id, status: 'success' });
  }

  /**
   * Indicate if this parser can parse this file.
   * @param {FileInformation} fileInformation - File information.
   * @returns {boolean} - Boolean that indicates if this file can be parsed or not.
   */
  isParsable(fileInformation) {
    return this.__parser.isParsable(fileInformation);
  }

  /**
   * Get models from all project files.
   * @param {FileInformation[]} [files] - Projects files.
   * @returns {string[]} List of folder and file paths that represent a model.
   */
  getModels(files = []) {
    return this.__parser.getModels(
      files.filter((file) => this.isParsable(file)),
    );
  }

  /**
   * Return all generated files from plugin data.
   * Configuration file is used for saving the components' configuration.
   * @param {FileInformation} diagram - Diagram file information.
   * @param {FileInput} configurationFile - Configuration file of components.
   * @param {FileInput[]} files - File inputs you want to render.
   * @returns {FileInput[]} All generated files including the configuration file.
   */
  render(diagram, configurationFile, files = []) {
    const id = this.data.emitEvent({
      type: 'Render',
      action: 'write',
      status: 'running',
      files: files.map(({ path }) => path).concat(configurationFile.path),
      data: {
        global: true,
      },
    });

    this.__renderer.renderConfiguration(diagram, configurationFile, id);

    const renderFiles = this.__renderer.render(files, id).concat(configurationFile);

    this.data.emitEvent({ id, status: 'success' });

    return renderFiles;
  }

  /**
   * Reorganize nodes layout algorithmically.
   * This method does not refresh the view.
   * You have to await it and trigger a redraw.
   * @param {string} id - The container within which we need to organize the children,
   * and if null specified, all components will be reorganized.
   * @param {boolean} keepPosition - If true, rearrange only components without a specified
   * position; otherwise, rearrange all components.
   */
  arrangeComponentsPosition(id, keepPosition) {
    this.__drawer.arrangeComponentsPosition(id, keepPosition);
  }

  /**
   * Resize the container to its minimum size.
   * @param {string} id - Container id.
   */
  resize(id) {
    this.__drawer.resize(id);
  }

  /**
   * Export viewport as svg.
   * @param {string} id - Viewport id.
   * @returns {string} Svg content.
   */
  exportSvg(id) {
    this.__drawer.init(id, true);
    this.draw();

    const svg = this.__drawer.exportSvg(id);

    this.__drawer.init(id, false);
    this.draw();

    return svg;
  }

  /**
   * Get the coordinates to use for component draw options.
   * @param {string} rootId - Html id, without '#'.
   * @param {ComponentDrawOption} drawOption - The options used to draw this Component.
   * @param {number} drawOption.x - Position X.
   * @param {number} drawOption.y - Position Y.
   * @returns {object} The coordinates for new component.
   */
  getComponentPosition(rootId, { x, y }) {
    const { scale, translate } = this.__drawer.actions.zoom;
    const { left, top } = document.querySelector(`#${rootId}`).getBoundingClientRect();

    return {
      x: ((x - left) - translate.x) / scale,
      y: ((y - top) - translate.y) / scale,
    };
  }

  /**
   * Create new component with draw option if passed as param.
   * @param {string} parentId - Id of parent container, null for root.
   * @param {ComponentDefinition} definition - Component definition.
   * @param {string} path - Component path.
   * @param {object} event - Event that contain mouse position.
   * @returns {string} Component id.
   */
  addComponent(
    parentId,
    definition,
    path,
    event,
  ) {
    const id = this.data.addComponent(
      definition,
      path,
    );
    const component = this.data.getComponentById(id);

    if (parentId) {
      const container = this.data.getComponentById(parentId);

      component.setReferenceAttribute(container);
    }

    if (event) {
      this.__drawer.dropComponent(component, event);
    }

    return id;
  }
}

export default DefaultPlugin;
