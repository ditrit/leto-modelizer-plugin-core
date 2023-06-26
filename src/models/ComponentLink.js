import FileInformation from './FileInformation';

/**
 * Class that links Components together.
 * @augments {FileInformation}
 */
class ComponentLink extends FileInformation {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.source] - Id of component can be the source in a link.
   * @param {string} [props.target] - Id of component can be the target of the link.
   * @param {ComponentLinkDefinition} [props.definition] - The definition of the link.
   */
  constructor(props = {
    source: null,
    target: null,
    definition: null,
  }) {
    super();
    const {
      source,
      target,
      definition,
    } = props;

    /**
     * Use for drawer to get the type of object.
     * @type {string}
     * @private
     */
    this.__class = 'Link';
    /**
     * Where the link is created.
     * @type {object}
     */
    this.source = source || null;
    /**
     * Target of the link.
     * @type {object}
     */
    this.target = target || null;
    /**
     * The definition of the link.
     * @type {ComponentLinkDefinition}
     */
    this.definition = definition || null;
  }
}

export default ComponentLink;
