import ParserLog from './ParserLog';

/**
 * Class to add Attribute in Components.
 */
class ComponentAttribute {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.name] - The name of the attribute.
   * @param {(string | boolean | number | Array | ComponentAttribute[])} [props.value] - The
   * value of the attribute.
   * @param {string} [props.type] - The real type of the attribute, valid types are
   * String/Boolean/Number/Array/Object.
   * @param {ComponentAttributeDefinition} [props.definition] - The definition of the
   * attribute.
   */
  constructor(props = {
    name: null,
    value: null,
    type: null,
    definition: null,
  }) {
    const {
      name,
      value,
      type,
      definition,
    } = props;

    /**
     * The name of the attribute.
     * @type {string}
     */
    this.name = name || null;
    /**
     * The value of the attribute.
     * @type {(string | boolean | number | Array | ComponentAttribute[])}
     */
    this.value = value ?? null;
    /**
     * The type of the attribute, real type of the attribute, to check if it matches with the
     * ComponentAttributeDefinition.
     * @type {string}
     */
    this.type = type || null;
    /**
     * The definition of the attribute.
     * @type {ComponentAttributeDefinition}
     */
    this.definition = definition || null;
  }

  /**
   * Check if the attribute is a variable.
   * @returns {boolean} - true if the attribute is a variable otherwise false.
   */
  get isVariable() {
    return false;
  }

  /**
   * Get all errors of the attribute.
   * @param {ParserLog[]} [errors] - Errors to set, can be null.
   * @param {boolean} [recurse] - If true, get sub-attributes errors recursively.
   * @param {string} [id] - Component id.
   * @returns {ParserLog[]} All attributes error.
   */
  getErrors(errors = [], recurse = false, id = null) {
    this.validateDefinitionType(errors, id);
    this.validateType(errors, id);
    this.validateRequired(errors, id);
    this.validateRuleMinMax(errors, id);
    this.validateRuleValues(errors, id);
    this.validateRuleRegex(errors, id);

    if (recurse && this.definition?.type === 'Object' && Array.isArray(this.value)) {
      this.value.forEach((attribute) => attribute.getErrors(errors, true, id));
    }

    return errors;
  }

  /**
   * Set if definition type is according to type.
   * @param {ParserLog[]} [errors] - Errors to set, can be null.
   * @param {string} [id] - Component id.
   * @returns {ParserLog[]} All attributes error.
   */
  validateDefinitionType(errors = [], id = null) {
    if (this.definition === null) {
      return errors;
    }

    if (this.definition.type === 'Link' && this.type !== 'Array') {
      errors.push(new ParserLog({
        componentId: id,
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.invalidLinkType',
        attribute: this.name,
      }));

      return errors;
    }

    if (this.definition.type === 'Reference' && this.type !== 'String') {
      errors.push(new ParserLog({
        componentId: id,
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.invalidReferenceType',
        attribute: this.name,
      }));

      return errors;
    }

    if (this.definition.type !== 'Reference'
      && this.definition.type !== 'Link'
      && this.definition.type !== this.type) {
      errors.push(new ParserLog({
        componentId: id,
        severity: ParserLog.SEVERITY_ERROR,
        message: `parser.error.not${this.definition.type}`,
        attribute: this.name,
      }));
    }

    return errors;
  }

  /**
   * Set if type is according to type of value.
   * @param {ParserLog[]} [errors] - Errors to set, can be null.
   * @param {string} [id] - Component id.
   * @returns {ParserLog[]} All attributes error.
   */
  validateType(errors = [], id = null) {
    if (this.value === null) {
      return errors;
    }

    if (this.type === 'Boolean') {
      if (typeof this.value !== 'boolean') {
        errors.push(new ParserLog({
          componentId: id,
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.error.notBoolean',
          attribute: this.name,
        }));
      }

      return errors;
    }

    if (this.type === 'String') {
      if (typeof this.value !== 'string') {
        errors.push(new ParserLog({
          componentId: id,
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.error.notString',
          attribute: this.name,
        }));
      }

      return errors;
    }

    if (this.type === 'Number') {
      if (typeof this.value !== 'number') {
        errors.push(new ParserLog({
          componentId: id,
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.error.notNumber',
          attribute: this.name,
        }));
      }

      return errors;
    }

    if (!Array.isArray(this.value)) { // For Object and Array types
      errors.push(new ParserLog({
        componentId: id,
        severity: ParserLog.SEVERITY_ERROR,
        message: `parser.error.not${this.type}`,
        attribute: this.name,
      }));
    }

    return errors;
  }

  /**
   * Set error if is required and value is null.
   * @param {ParserLog[]} [errors] - Errors to set, can be null.
   * @param {string} [id] - Component id.
   * @returns {ParserLog[]} All attributes error.
   */
  validateRequired(errors = [], id = null) {
    if (this.definition?.required && this.value === null) {
      errors.push(new ParserLog({
        componentId: id,
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.required',
        attribute: this.name,
      }));
    }

    return errors;
  }

  /**
   * Set error if :
   * - Value is a string or array and its length is less than the specify minimum length.
   * - Value is a string or array and its length is greater than the specify maximum length.
   * - Value is a number and its value is less than the specify minimum value.
   * - Value is a number and its value is greater than the specify maximum value.
   * @param {ParserLog[]} [errors] - Errors to set, can be null.
   * @param {string} [id] - Component id.
   * @returns {ParserLog[]} All attributes error.
   */
  validateRuleMinMax(errors = [], id = null) {
    if (this.type === 'Boolean' || this.type === 'Object' || !this.definition?.rules) {
      return errors;
    }

    const value = typeof this.value === 'number' ? this.value : this.value?.length || 0;

    if (this.definition.rules.min !== null
      && value < this.definition.rules.min) {
      errors.push(new ParserLog({
        componentId: id,
        severity: ParserLog.SEVERITY_ERROR,
        message: `parser.error.min${this.definition.type}`,
        attribute: this.name,
        extraData: this.definition.rules.min,
      }));
    }

    if (this.definition.rules.max !== null
      && value > this.definition.rules.max) {
      errors.push(new ParserLog({
        componentId: id,
        severity: ParserLog.SEVERITY_ERROR,
        message: `parser.error.max${this.definition.type}`,
        attribute: this.name,
        extraData: this.definition.rules.max,
      }));
    }

    return errors;
  }

  /**
   * Set error if value or all elements of value array is not included in the specify values.
   * @param {ParserLog[]} [errors] - Errors to set, can be null.
   * @param {string} [id] - Component id.
   * @returns {ParserLog[]} All attributes error.
   */
  validateRuleValues(errors = [], id = null) {
    if (!this.definition || this.definition.rules.values.length === 0) {
      return errors;
    }

    const isArray = Array.isArray(this.value);

    if ((isArray && this.value.some((value) => !this.definition.rules.values.includes(value)))
     || (!isArray && !this.definition.rules.values.includes(this.value))) {
      errors.push(new ParserLog({
        componentId: id,
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.invalidValue',
        attribute: this.name,
        extraData: this.definition.rules.values.join(', '),
      }));
    }

    return errors;
  }

  /**
   * Set error if value is not null and not match the specify regex.
   * @param {ParserLog[]} [errors] - Errors to set, can be null.
   * @param {string} [id] - Component id.
   * @returns {ParserLog[]} All attributes error.
   */
  validateRuleRegex(errors = [], id = null) {
    if (!this.definition?.rules.regex || this.value === null) {
      return errors;
    }

    const regex = new RegExp(this.definition.rules.regex);

    if (!regex.test(this.value)) {
      errors.push(new ParserLog({
        componentId: id,
        severity: ParserLog.SEVERITY_ERROR,
        message: this.definition.rules.regexMessage || 'parser.error.regex',
        attribute: this.name,
      }));
    }

    return errors;
  }
}
export default ComponentAttribute;
