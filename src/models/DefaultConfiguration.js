/**
 * Default plugin configuration.
 */
class DefaultConfiguration {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {object} [props.editor] - Object that contains all properties of editor
   * configuration.
   * @param {object} [props.editor.syntax] - Syntax configuration.
   * @param {string} [props.restrictiveFolder] - Restrictive folder for new component if provided.
   * @param {string} [props.defaultFileName] - Default file name for new components.
   * @param {string} [props.defaultFileExtension] - Default file extension for components.
   * @param {Tag[]} [props.tags] - All plugin tags.
   * @param {boolean} [props.isFolderTypeDiagram] - True if diagram type is folder, otherwise false.
   * @param {object[]} [props.extraResources] - List of extra resources to register. An extra
   * resource is model name that can't be set in Component.
   * @param {string} [props.extraResources.type] - Type of resources can be markers, links and
   * icons. You can set models, but only component can use models.
   * @param {string} [props.extraResources.name] - Name of SVG model to render the resource.
   * @param {object} [props.rootContainer] - Configuration of root container in the scene.
   * @param {number} [props.rootContainer.margin] - Margin inside the root container.
   * @param {number} [props.rootContainer.gap] - Gap between component inside the root container.
   * @param {object} [props.container] - Default configuration of all container in the scene.
   * @param {number} [props.container.margin] - Default margin inside container.
   * @param {number} [props.container.gap] - Default gap between component inside container.
   * @param {object} [props.keysBinding] - Set of keyboard shortcuts for actions performing.
   * @param {object} [props.i18n] - Object that store all translations.
   */
  constructor(props = {
    editor: {
      syntax: null,
    },
    restrictiveFolder: null,
    defaultFileName: null,
    defaultFileExtension: null,
    tags: [],
    isFolderTypeDiagram: true,
    extraResources: [],
    rootContainer: {
      margin: 30,
      gap: 50,
    },
    container: {
      margin: 30,
      gap: 50,
    },
    keysBinding: {},
    i18n: {},
  }) {
    /**
     * Object that contains all properties of editor configuration.
     * @type {object}
     */
    this.editor = {
      syntax: null,
      ...props.editor,
    };
    /**
     * Restrictive folder for new component if provided.
     * @type {string}
     */
    this.restrictiveFolder = props.restrictiveFolder || null;
    /**
     * Default file name for new components.
     * @type {string}
     */
    this.defaultFileName = props.defaultFileName || null;
    /**
     * Default file extension for components.
     * @type {string}
     */
    this.defaultFileExtension = props.defaultFileExtension || null;
    /**
     * All plugin tags.
     * @type {Tag[]}
     * @default []
     */
    this.tags = props.tags || [];
    /**
     * True if diagram type is folder, otherwise false.
     * @type {boolean}
     */
    this.isFolderTypeDiagram = props.isFolderTypeDiagram ?? true;
    /**
     * List of extra resources to register. An extra resource is model name that can't be set in
     * Component.
     * @type {{type: string, name: string}}
     */
    this.extraResources = props.extraResources || [];
    /**
     * Configuration of root container in the scene.
     * @type {{margin: number, gap: number}}
     */
    this.rootContainer = {
      margin: props.rootContainer?.margin || 30,
      gap: props.rootContainer?.gap || 50,
    };
    /**
     * Default configuration of all containers in the scene.
     * @type {{margin: number, gap: number}}
     */
    this.container = {
      margin: props.container?.margin || 30,
      gap: props.container?.gap || 50,
    };

    /**
     * Set of keyboard shortcuts for actions performing.
     * @type {object}
     */
    this.keysBinding = {
      moveSceneUp: ['ArrowUp'],
      moveSceneDown: ['ArrowDown'],
      moveSceneLeft: ['ArrowLeft'],
      moveSceneRight: ['ArrowRight'],
      moveComponentUp: [],
      moveComponentDown: [],
      moveComponentLeft: [],
      moveComponentRight: [],
      zoomIn: ['+'],
      zoomOut: ['-'],
      deleteObject: ['Delete'],
      editComponent: [',', '?'],
      selection: ['Shift'],
      selectAll: ['A'],
      deselectAll: ['D'],
      ...props.keysBinding,
    };

    this.i18n = props.i18n || {};
  }
}

export default DefaultConfiguration;
