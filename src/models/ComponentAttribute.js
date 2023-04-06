/**
 * Class to add Attribute in Components
 */
class ComponentAttribute {
  /**
   * Default constructor.
   * @param {object} [props] - Object that contains all properties to set.
   * @param {string} [props.name] - The name of the attribute.
   * @param {(string | boolean | number | Array | ComponentAttribute[])} [props.value] - The
   * value of the attribute.
   * @param {string} [props.type] - The real type of the attribute.
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
   * Check if the attribute has an error.
   * @returns {boolean} - true if an error occurs otherwise false.
   */
  hasError() {
    if (this.definition === null) {
      if (this.value === null) {
        return true;
      }

      if (this.type.toLowerCase() === 'array') {
        return !Array.isArray(this.value);
      }

      // eslint-disable-next-line valid-typeof
      return typeof this.value !== this.type.toLowerCase();
    }

    if (this.value === null || this.value === undefined) {
      return false;
    }

    return this.__typeOfValueValidation()
      || this.__ruleValueValidation()
      || this.__ruleMinAndMaxValidation()
      || this.__ruleRegexValidation();
  }

  /**
   * Check if the attribute type matches one of the JavaScript types.
   * @returns {boolean} - true if the type is not good otherwise false.
   * @private
   */
  __typeOfValueValidation() {
    const type = this.type.toLowerCase();

    if (type === 'array') {
      if (this.definition.type === 'Link') {
        return !Array.isArray(this.value) || this.value.some((link) => typeof link !== 'string');
      }

      return !Array.isArray(this.value);
    }

    // eslint-disable-next-line valid-typeof
    return typeof this.value !== type;
  }

  /**
   * Check if values rule include this attribute value.
   * @returns {boolean} - true if values rule doesn't include this attribute value otherwise false.
   * @private
   */
  __ruleValueValidation() {
    return this.definition.rules.values
      && !this.definition.rules.values.includes(this.value);
  }

  /**
   * Check if the value or its length follows min and max rules.
   * @returns {boolean} - true if the value is smaller than the "min" rule
   * or bigger than the "max" rule otherwise false.
   * @private
   */
  __ruleMinAndMaxValidation() {
    const value = typeof this.value === 'number' ? this.value : this.value.length;

    if (this.definition.rules.min !== null && value < this.definition.rules.min) {
      return true;
    }

    return this.definition.rules.max !== null && value > this.definition.rules.max;
  }

  /**
   * Check if the value matches the regex rule.
   * @returns {boolean} - true if attribute's value doesn't match the regex rule otherwise false.
   * @private
   */
  __ruleRegexValidation() {
    if (this.definition.rules.regex !== null) {
      const regex = new RegExp(this.definition.rules.regex);

      return !regex.test(this.value);
    }

    return false;
  }
}
export default ComponentAttribute;
