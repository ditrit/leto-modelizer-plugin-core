import FileInformation from './FileInformation';

/**
 * Class that represents a variable in a file of a model.
 * @augments {FileInformation}
 */
class Variable extends FileInformation {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.name] - The name of this Variable.
   * @param {string} [props.type] - The data type of the Variable value.
   * @param {(string | boolean | number | Array)} [props.value] - The value of this Variable.
   * @param {string} [props.category] - The kind of the entire Variable block.
   */
  constructor(props = {
    name: null,
    type: null,
    value: null,
    category: null,
  }) {
    super(props);
    const {
      name,
      type,
      value,
      category,
    } = props;

    /**
     * Use for drawer to get the type of object.
     * @type {string}
     * @private
     */
    this.__class = 'Variable';
    /**
     * The name of this Variable.
     * @type {string}
     */
    this.name = name || null;
    /**
     * The type of this Variable.
     * @type {string}
     */
    this.type = type || null;
    /**
     * The value of this Variable.
     * @type {(string | boolean | number | Array)}
     */
    this.value = value || null;
    /**
     * The variable block type.
     * @type {boolean}
     */
    this.category = category || null;
  }
}

export default Variable;
