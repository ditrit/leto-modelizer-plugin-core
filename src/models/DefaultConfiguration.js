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
   * @param {object} [props.elkParams] - Parameters for the layout algorithm.
   * @see Parameters for ELK: {@link https://eclipse.dev/elk/reference/options.html}
   * @param {object} [props.singleComponentParams] - Parameters for the algorithm that
   * places a single component.
   * @param {number} [props.singleComponentParams.margin] - Minimal distance between
   * components & links.
   * @param {number} [props.singleComponentParams.precision] - Space interval between coordinates
   * that will be tested. Performance decreases proportionally to the square of this parameter.
   * @param {boolean} [props.isFolderTypeDiagram] - True if diagram type is folder, otherwise false.
   */
  constructor(props = {
    editor: {
      syntax: null,
    },
    restrictiveFolder: null,
    defaultFileName: null,
    defaultFileExtension: null,
    tags: [],
    elkParams: null,
    singleComponentParams: null,
    isFolderTypeDiagram: true,
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
     * Parameters for the ELK automatic layout system.
     * @see https://eclipse.dev/elk/reference/options.html
     * @type {object}
     */
    this.elkParams = {
      'elk.algorithm': 'elk.layered',
      'spacing.baseValue': '50',
      separateConnectedComponents: 'true',
      'elk.layered.cycleBreaking.strategy': 'INTERACTIVE',
      'elk.layered.layering.strategy': 'INTERACTIVE',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
      'elk.layered.interactiveReferencePoint': 'TOP_LEFT',
      'elk.debugMode': 'true',
      'elk.direction': 'UNDEFINED',
      ...props.elkParams,
    };
    /**
     * Parameters for the algorithm that places a single new component.
     * @type {object}
     */
    this.singleComponentParams = {
      precision: 10,
      margin: 20,
      ...props.singleComponentParams,
    };
    /**
     * True if diagram type is folder, otherise false.
     * @type {boolean}
     */
    this.isFolderTypeDiagram = props.isFolderTypeDiagram ?? true;
  }
}

export default DefaultConfiguration;
