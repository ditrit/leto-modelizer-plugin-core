/**
 * Definition of Component's data and constraints
 */
class ComponentDefinition {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.type] - The type of the associated component.
   * @param {string} [props.icon] - The icon's name of this type of component.
   * @param {string} [props.model] - Name of SVG template to render this type of component.
   * @param {string} [props.displayName] - Display name of the component.
   * @param {string} [props.description] - Explanation of the component.
   * @param {string} [props.url] - URL of the documentation of the component.
   * @param {string[]} [props.parentTypes] - The list of types that can be the parent.
   * @param {string[]} [props.childrenTypes] - The list of types that can be the children.
   * @param {ComponentAttributeDefinition[]} [props.definedAttributes] - Defined attributes for
   * this type.
   * @param {boolean} [props.isContainer] - Boolean means if this type can be a parent.
   * instantiated components.
   * @param {string} [props.displayType] - Use the given displayType to override
   * the component's rendering. Allowed values: workflow|null.
   * @param {string} [props.workflowDirection] -  Workflow direction, can be horizontal or vertical.
   * Default value is horizontal.
   * @param {string} [props.linkModel] - Name of SVG template to render the link of this component,
   * only used in case of workflow.
   * @param {number} [props.defaultWidth] - Default width that will be set on creation.
   * @param {number} [props.defaultHeight] - Default height that will be set on creation.
   * @param {number} [props.minWidth] - Minimum width of the component.
   * @param {number} [props.minHeight] - Minimum height of the component.
   * @param {number} [props.reservedWidth] - Width reserved in the component for display, only use
   * for container.
   * @param {number} [props.reservedHeight] - Height reserved in the component for display, only use
   * for container.
   * @param {number} [props.margin] - Margin inside the components zone, only used for container.
   * @param {number} [props.gap] - Gap between component inside the components zone, only used for
   * container.
   */
  constructor(props = {
    type: null,
    icon: null,
    model: null,
    displayName: null,
    description: null,
    url: null,
    parentTypes: [],
    childrenTypes: [],
    definedAttributes: [],
    isContainer: false,
    displayType: null,
    workflowDirection: null,
    linkModel: null,
    defaultWidth: 0,
    defaultHeight: 0,
    minWidth: 0,
    minHeight: 0,
    reservedWidth: 0,
    reservedHeight: 0,
    margin: 10,
    gap: 30,
  }) {
    const {
      type,
      icon,
      model,
      displayName,
      description,
      url,
      parentTypes,
      childrenTypes,
      definedAttributes,
      isContainer,
      displayType,
      workflowDirection,
      linkModel,
      defaultWidth,
      defaultHeight,
      minWidth,
      minHeight,
      reservedWidth,
      reservedHeight,
      margin,
      gap,
    } = props;

    /**
     * The type of the associated component.
     * @type {string}
     */
    this.type = type || null;

    /**
     * The icon's name of this type of component.
     * @type {string}
     */
    this.icon = icon || null;

    /**
     * Name of SVG model to render this type of component.
     * @type {string}
     */
    this.model = model || null;

    /**
     * Display name of the component.
     * @type {string}
     */
    this.displayName = displayName || null;

    /**
     * Explanation of the component.
     * @type {string}
     */
    this.description = description || null;

    /**
     * URL of the documentation of the component.
     * @type {string}
     */
    this.url = url || null;

    /**
     * The list of types that can be the parent.
     * @type {string[]}
     * @default []
     */
    this.parentTypes = parentTypes || [];

    /**
     * The list of types that can be the children.
     * @type {string[]}
     * @default []
     */
    this.childrenTypes = childrenTypes || [];

    /**
     * Defined attributes for this type.
     * @type {ComponentAttributeDefinition[]}
     * @default []
     */
    this.definedAttributes = definedAttributes || [];

    /**
     * Boolean means if this type can be a parent.
     * @type {boolean}
     * @default false
     */
    this.isContainer = isContainer === undefined ? false : isContainer;

    /**
     * Name of a specific display behavior.
     * @type {string}
     */
    this.displayType = displayType || null;

    /**
     * Workflow direction, can be horizontal or vertical.
     * @type {string}
     * @default horizontal
     */
    this.workflowDirection = workflowDirection || 'horizontal';

    /**
     * Name of SVG template to render the link of this component, only used in case of workflow.
     * @type {string|null}
     */
    this.linkModel = linkModel || null;

    /**
     * Default width that will be set on creation.
     * @type {number}
     */
    this.defaultWidth = defaultWidth || 0;

    /**
     * Default height that will be set on creation.
     * @type {number}
     */
    this.defaultHeight = defaultHeight || 0;

    /**
     * Minimum width of the component.
     * @type {number}
     */
    this.minWidth = minWidth || 0;

    /**
     * Minimum height of the component.
     * @type {number}
     */
    this.minHeight = minHeight || 0;

    /**
     * Width reserved in the component for display, only used for container.
     * @type {number}
     */
    this.reservedWidth = reservedWidth || 0;

    /**
     * Height reserved in the component for display, only used for container.
     * @type {number}
     */
    this.reservedHeight = reservedHeight || 0;

    /**
     * Margin inside the components zone, only used for container.
     * @type {number}
     */
    this.margin = margin || 10;

    /**
     * Gap between component inside the components zone, only used for container.
     * @type {number}
     */
    this.gap = gap || 30;
  }
}

export default ComponentDefinition;
