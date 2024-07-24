import ComponentAttribute from 'src/models/ComponentAttribute';
import ComponentAttributeDefinition from 'src/models/ComponentAttributeDefinition';
import ParserLog from 'src/models/ParserLog';

describe('Test class: ComponentAttribute', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const componentAttribute = new ComponentAttribute();

      expect(componentAttribute.name).toBeNull();
      expect(componentAttribute.value).toBeNull();
      expect(componentAttribute.type).toBeNull();
      expect(componentAttribute.definition).toBeNull();
    });

    it('Check passing undefined variables to constructor', () => {
      const componentAttribute = new ComponentAttribute({});

      expect(componentAttribute.name).toBeNull();
      expect(componentAttribute.value).toBeNull();
      expect(componentAttribute.type).toBeNull();
      expect(componentAttribute.definition).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const componentAttribute = new ComponentAttribute({
        name: 'name',
        value: 'value',
        type: 'type',
        definition: {},
      });

      expect(componentAttribute.name).toEqual('name');
      expect(componentAttribute.value).toEqual('value');
      expect(componentAttribute.type).toEqual('type');
      expect(componentAttribute.definition).toBeDefined();
    });
  });

  describe('Test getter: isVariable', () => {
    it('should return false', () => {
      expect(new ComponentAttribute().isVariable).toBeFalsy();
    });
  });

  describe('Test method: getErrors', () => {
    it('should not set error on valid sub-attribute', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          type: 'Object',
        }),
        name: 'parent',
        type: 'Object',
        value: [
          new ComponentAttribute({
            definition: new ComponentAttributeDefinition({
              type: 'Number',
            }),
            name: 'child',
            type: 'Number',
            value: 10,
          }),
        ],
      });
      const errors = [];

      attribute.getErrors(errors, true);
      expect(errors).toEqual([]);
    });

    it('should not error without recurse and invalid sub-attribute', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          type: 'Object',
        }),
        name: 'parent',
        type: 'Object',
        value: [
          new ComponentAttribute({
            definition: new ComponentAttributeDefinition({
              type: 'Number',
            }),
            name: 'child',
            type: 'Number',
            value: 'test',
          }),
        ],
      });
      const errors = [];

      attribute.getErrors(errors, false);
      expect(errors).toEqual([]);
    });

    it('should set error with recurse and invalid sub-attribute', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          type: 'Object',
        }),
        name: 'parent',
        type: 'Object',
        value: [
          new ComponentAttribute({
            definition: new ComponentAttributeDefinition({
              type: 'Number',
            }),
            name: 'child',
            type: 'Number',
            value: 'test',
          }),
        ],
      });
      const errors = [];

      attribute.getErrors(errors, true);
      expect(errors).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.default.error.notNumber',
        attribute: 'child',
      })]);
    });
  });

  describe('Test method: validateType', () => {
    it('should not set error without value and definition', () => {
      const attribute = new ComponentAttribute();
      const errors = [];

      attribute.validateDefinitionType(errors);
      expect(errors).toEqual([]);
    });

    it('should not set error on valid definition type and type', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          type: 'Link',
        }),
        type: 'Array',
      });
      const errors = [];

      attribute.validateDefinitionType(errors);
      expect(errors).toEqual([]);

      attribute.definition.type = 'Reference';
      attribute.type = 'String';
      attribute.validateDefinitionType(errors);
      expect(errors).toEqual([]);

      attribute.definition.type = 'Number';
      attribute.type = 'Number';
      attribute.validateDefinitionType(errors);
      expect(errors).toEqual([]);
    });

    it('should set error on invalid link type', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          type: 'Link',
        }),
        name: 'test',
        type: 'Number',
      });
      const errors = [];

      attribute.validateDefinitionType(errors);
      expect(errors).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.default.error.invalidLinkType',
        attribute: 'test',
      })]);
    });

    it('should set error on invalid Reference type', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          type: 'Reference',
        }),
        name: 'test',
        type: 'Number',
      });
      const errors = [];

      attribute.validateDefinitionType(errors);
      expect(errors).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.default.error.invalidReferenceType',
        attribute: 'test',
      })]);
    });

    it('should set error on invalid type', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          type: 'String',
        }),
        name: 'test',
        type: 'Number',
      });
      const errors = [];

      attribute.validateDefinitionType(errors);
      expect(errors).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.default.error.invalidType',
        attribute: 'test',
      })]);
    });
  });

  describe('Test method: validateType', () => {
    it('should not set error without value', () => {
      const attribute = new ComponentAttribute({
        value: null,
      });
      const errors = [];

      attribute.validateType(errors);
      expect(errors).toEqual([]);
    });

    it('should not set error on valid type', () => {
      const attribute = new ComponentAttribute({
        name: 'test',
        type: 'Boolean',
        value: true,
      });
      const errors = [];

      attribute.validateType(errors);
      expect(errors).toEqual([]);

      attribute.type = 'String';
      attribute.value = 'text';
      attribute.validateType(errors);
      expect(errors).toEqual([]);

      attribute.type = 'Number';
      attribute.value = 2;
      attribute.validateType(errors);
      expect(errors).toEqual([]);

      attribute.type = 'Object';
      attribute.value = [];
      attribute.validateType(errors);
      expect(errors).toEqual([]);

      attribute.type = 'Array';
      attribute.value = [];
      attribute.validateType(errors);
      expect(errors).toEqual([]);
    });

    it('should set error on invalid Boolean type', () => {
      const attribute = new ComponentAttribute({
        type: 'Boolean',
        name: 'test',
        value: 'value',
      });
      const errors = [];

      attribute.validateType(errors);
      expect(errors).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.default.error.notBoolean',
        attribute: 'test',
      })]);
    });

    it('should set error on invalid String type', () => {
      const attribute = new ComponentAttribute({
        type: 'String',
        name: 'test',
        value: true,
      });
      const errors = [];

      attribute.validateType(errors);
      expect(errors).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.default.error.notString',
        attribute: 'test',
      })]);
    });

    it('should set error on invalid Number type', () => {
      const attribute = new ComponentAttribute({
        type: 'Number',
        name: 'test',
        value: 'value',
      });
      const errors = [];

      attribute.validateType(errors);
      expect(errors).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.default.error.notNumber',
        attribute: 'test',
      })]);
    });

    it('should set error on invalid Object type', () => {
      const attribute = new ComponentAttribute({
        type: 'Object',
        name: 'test',
        value: 'value',
      });
      const errors = [];

      attribute.validateType(errors);
      expect(errors).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.default.error.notObject',
        attribute: 'test',
      })]);
    });

    it('should set error on invalid Array type', () => {
      const attribute = new ComponentAttribute({
        type: 'Array',
        name: 'test',
        value: 'value',
      });
      const errors = [];

      attribute.validateType(errors);
      expect(errors).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.default.error.notArray',
        attribute: 'test',
      })]);
    });
  });

  describe('Test method: validateRequired', () => {
    it('should not set error with not required attribute', () => {
      const attribute = new ComponentAttribute({
        value: null,
      });
      const errors = [];

      attribute.validateRequired(errors);
      expect(errors).toEqual([]);

      attribute.definition = new ComponentAttributeDefinition({
        required: false,
      });
      attribute.validateRequired(errors);
      expect(errors).toEqual([]);
    });

    it('should not set error with not null value', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          required: true,
        }),
        value: 'test',
      });
      const errors = [];

      attribute.validateRequired(errors);
      expect(errors).toEqual([]);
    });

    it('should set error with null value', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          required: true,
        }),
        name: 'test',
        value: null,
      });
      const errors = [];

      attribute.validateRequired(errors);
      expect(errors).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.default.error.required',
        attribute: 'test',
      })]);
    });
  });

  describe('Test method: validateRuleMinMax', () => {
    it('should not set error with boolean type', () => {
      const attribute = new ComponentAttribute({
        type: 'Boolean',
      });
      const errors = [];

      attribute.validateRuleMinMax(errors);
      expect(errors).toEqual([]);
    });

    it('should not set error with object type', () => {
      const attribute = new ComponentAttribute({
        type: 'Object',
      });
      const errors = [];

      attribute.validateRuleMinMax(errors);
      expect(errors).toEqual([]);
    });

    it('should not set error without min/max rules', () => {
      const attribute = new ComponentAttribute({
        value: 1,
      });
      const errors = [];

      attribute.validateRuleMinMax(errors);
      expect(errors).toEqual([]);

      attribute.definition = new ComponentAttributeDefinition();
      attribute.validateRuleMinMax(errors);
      expect(errors).toEqual([]);
    });

    it('should set error on invalid number value', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          rules: {
            min: 2,
            max: 0,
          },
          type: 'Number',
        }),
        name: 'test',
        value: 1,
      });
      const errors = [];

      attribute.validateRuleMinMax(errors);
      expect(errors).toEqual([
        new ParserLog({
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.default.error.minNumber',
          attribute: 'test',
        }),
        new ParserLog({
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.default.error.maxNumber',
          attribute: 'test',
        }),
      ]);
    });

    it('should set error on invalid array value', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          rules: {
            min: 2,
            max: 0,
          },
          type: 'Array',
        }),
        name: 'test',
        value: ['test'],
      });
      const errors = [];

      attribute.validateRuleMinMax(errors);
      expect(errors).toEqual([
        new ParserLog({
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.default.error.minArray',
          attribute: 'test',
        }),
        new ParserLog({
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.default.error.maxArray',
          attribute: 'test',
        }),
      ]);
    });

    it('should set error on invalid string value', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          rules: {
            min: 2,
            max: 0,
          },
          type: 'String',
        }),
        name: 'test',
        value: 'a',
      });
      const errors = [];

      attribute.validateRuleMinMax(errors);
      expect(errors).toEqual([
        new ParserLog({
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.default.error.minString',
          attribute: 'test',
        }),
        new ParserLog({
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.default.error.maxString',
          attribute: 'test',
        }),
      ]);
    });

    it('should not set error on valid value', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          rules: {
            min: 2,
            max: 5,
          },
          type: 'String',
        }),
        name: 'test',
        value: 'aa',
      });
      const errors = [];

      attribute.validateRuleMinMax(errors);
      expect(errors).toEqual([]);

      attribute.value = 'aaaaa';
      attribute.validateRuleMinMax(errors);
      expect(errors).toEqual([]);

      attribute.definition.type = 'Array';
      attribute.value = ['a', 'a'];
      attribute.validateRuleMinMax(errors);
      expect(errors).toEqual([]);

      attribute.value = ['a', 'a', 'a', 'a', 'a'];
      attribute.validateRuleMinMax(errors);
      expect(errors).toEqual([]);

      attribute.definition.type = 'Number';
      attribute.value = 2;
      attribute.validateRuleMinMax(errors);
      expect(errors).toEqual([]);

      attribute.value = 5;
      attribute.validateRuleMinMax(errors);
      expect(errors).toEqual([]);
    });
  });

  describe('Test method: validateRuleValues', () => {
    it('should not set error without values rules', () => {
      const attribute = new ComponentAttribute();
      const errors = [];

      attribute.validateRuleValues(errors);
      expect(errors).toEqual([]);

      attribute.definition = new ComponentAttributeDefinition();
      attribute.validateRuleValues(errors);
      expect(errors).toEqual([]);
    });

    it('should not set error when value is valid', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          rules: {
            values: ['a', 'b'],
          },
        }),
        value: 'a',
      });
      const errors = [];

      attribute.validateRuleValues(errors);
      expect(errors).toEqual([]);

      attribute.value = ['a'];
      attribute.validateRuleValues(errors);
      expect(errors).toEqual([]);

      attribute.value = ['b', 'a'];
      attribute.validateRuleValues(errors);
      expect(errors).toEqual([]);
    });

    it('should set error when value is invalid', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          rules: {
            values: ['a', 'b'],
          },
        }),
        name: 'test',
        value: 'c',
      });
      let errors = [];

      attribute.validateRuleValues(errors);
      expect(errors).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.default.error.invalidValue',
        attribute: 'test',
      })]);

      errors = [];
      attribute.value = ['c'];
      attribute.validateRuleValues(errors);
      expect(errors).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.default.error.invalidValue',
        attribute: 'test',
      })]);

      errors = [];
      attribute.value = ['b', 'a', 'c'];
      attribute.validateRuleValues(errors);
      expect(errors).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.default.error.invalidValue',
        attribute: 'test',
      })]);
    });
  });

  describe('Test method: validateRuleRegex', () => {
    it('should not set error without regex rules', () => {
      const attribute = new ComponentAttribute();
      const errors = [];

      attribute.validateRuleRegex(errors);
      expect(errors).toEqual([]);

      attribute.definition = new ComponentAttributeDefinition();
      attribute.validateRuleRegex(errors);
      expect(errors).toEqual([]);
    });

    it('should not set error when value is null', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          rules: {
            regex: /[a-z]*/,
          },
        }),
      });
      const errors = [];

      attribute.validateRuleRegex(errors);
      expect(errors).toEqual([]);
    });

    it('should not set error when regex is valid', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          rules: {
            regex: /^[a-z]+$/,
          },
        }),
        value: 'a',
      });
      const errors = [];

      attribute.validateRuleRegex(errors);
      expect(errors).toEqual([]);
    });

    it('should set error when regex is invalid', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          rules: {
            regex: /^[a-z]+$/,
          },
        }),
        name: 'test',
        value: '1',
      });
      const errors = [];

      attribute.validateRuleRegex(errors);
      expect(errors).toEqual([new ParserLog({
        attribute: 'test',
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.default.error.regex',
      })]);
    });

    it('should set error with specific message when regex is invalid', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          rules: {
            regex: /^[a-z]+$/,
            regexMessage: 'error',
          },
        }),
        name: 'test',
        value: '1',
      });
      const errors = [];

      attribute.validateRuleRegex(errors);
      expect(errors).toEqual([new ParserLog({
        attribute: 'test',
        severity: ParserLog.SEVERITY_ERROR,
        message: 'error',
      })]);
    });
  });
});
