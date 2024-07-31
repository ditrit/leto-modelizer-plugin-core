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
        message: 'parser.error.notNumber',
        attribute: 'child',
      })]);
    });

    it('should not set error without definition', () => {
      const attribute = new ComponentAttribute({
        name: 'parent',
        type: 'String',
        value: 'test',
      });
      const errors = [];

      attribute.getErrors(errors, true);
      expect(errors).toEqual([]);
    });
  });

  describe('Test method: validateType', () => {
    it('should not set error without value and definition', () => {
      const attribute = new ComponentAttribute();

      expect(attribute.validateDefinitionType()).toEqual([]);
    });

    it('should not set error on valid definition type and type', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          type: 'Link',
        }),
        type: 'Array',
      });

      expect(attribute.validateDefinitionType()).toEqual([]);

      attribute.definition.type = 'Reference';
      attribute.type = 'String';
      expect(attribute.validateDefinitionType()).toEqual([]);

      attribute.definition.type = 'Number';
      attribute.type = 'Number';
      expect(attribute.validateDefinitionType()).toEqual([]);
    });

    it('should set error on invalid link type', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          type: 'Link',
        }),
        name: 'test',
        type: 'Number',
      });

      expect(attribute.validateDefinitionType()).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.invalidLinkType',
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

      expect(attribute.validateDefinitionType()).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.invalidReferenceType',
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

      expect(attribute.validateDefinitionType()).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.notString',
        attribute: 'test',
      })]);
    });
  });

  describe('Test method: validateType', () => {
    it('should not set error without value', () => {
      const attribute = new ComponentAttribute({
        value: null,
      });

      expect(attribute.validateType()).toEqual([]);
    });

    it('should not set error on valid type', () => {
      const attribute = new ComponentAttribute({
        name: 'test',
        type: 'Boolean',
        value: true,
      });

      expect(attribute.validateType()).toEqual([]);

      attribute.type = 'String';
      attribute.value = 'text';
      expect(attribute.validateType()).toEqual([]);

      attribute.type = 'Number';
      attribute.value = 2;
      expect(attribute.validateType()).toEqual([]);

      attribute.type = 'Object';
      attribute.value = [];
      expect(attribute.validateType()).toEqual([]);

      attribute.type = 'Array';
      attribute.value = [];
      expect(attribute.validateType()).toEqual([]);
    });

    it('should set error on invalid Boolean type', () => {
      const attribute = new ComponentAttribute({
        type: 'Boolean',
        name: 'test',
        value: 'value',
      });

      expect(attribute.validateType()).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.notBoolean',
        attribute: 'test',
      })]);
    });

    it('should set error on invalid String type', () => {
      const attribute = new ComponentAttribute({
        type: 'String',
        name: 'test',
        value: true,
      });

      expect(attribute.validateType()).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.notString',
        attribute: 'test',
      })]);
    });

    it('should set error on invalid Number type', () => {
      const attribute = new ComponentAttribute({
        type: 'Number',
        name: 'test',
        value: 'value',
      });

      expect(attribute.validateType()).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.notNumber',
        attribute: 'test',
      })]);
    });

    it('should set error on invalid Object type', () => {
      const attribute = new ComponentAttribute({
        type: 'Object',
        name: 'test',
        value: 'value',
      });

      expect(attribute.validateType()).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.notObject',
        attribute: 'test',
      })]);
    });

    it('should set error on invalid Array type', () => {
      const attribute = new ComponentAttribute({
        type: 'Array',
        name: 'test',
        value: 'value',
      });

      expect(attribute.validateType()).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.notArray',
        attribute: 'test',
      })]);
    });
  });

  describe('Test method: validateRequired', () => {
    it('should not set error with not required attribute', () => {
      const attribute = new ComponentAttribute({
        value: null,
      });

      expect(attribute.validateRequired()).toEqual([]);

      attribute.definition = new ComponentAttributeDefinition({
        required: false,
      });
      expect(attribute.validateRequired()).toEqual([]);
    });

    it('should not set error with not null value', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          required: true,
        }),
        value: 'test',
      });

      expect(attribute.validateRequired()).toEqual([]);
    });

    it('should set error with null value', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          required: true,
        }),
        name: 'test',
        value: null,
      });

      expect(attribute.validateRequired()).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.required',
        attribute: 'test',
      })]);
    });
  });

  describe('Test method: validateRuleMinMax', () => {
    it('should not set error without definition', () => {
      const attribute = new ComponentAttribute({
        type: 'String',
      });

      expect(attribute.validateRuleMinMax()).toEqual([]);
    });

    it('should not set error without rules', () => {
      const attribute = new ComponentAttribute({
        type: 'String',
        definition: new ComponentAttributeDefinition(),
      });

      expect(attribute.validateRuleMinMax()).toEqual([]);
    });

    it('should not set error with boolean type', () => {
      const attribute = new ComponentAttribute({
        type: 'Boolean',
      });

      expect(attribute.validateRuleMinMax()).toEqual([]);
    });

    it('should not set error with object type', () => {
      const attribute = new ComponentAttribute({
        type: 'Object',
      });

      expect(attribute.validateRuleMinMax()).toEqual([]);
    });

    it('should not set error without min/max rules', () => {
      const attribute = new ComponentAttribute({
        value: 1,
      });

      expect(attribute.validateRuleMinMax()).toEqual([]);

      attribute.definition = new ComponentAttributeDefinition();
      expect(attribute.validateRuleMinMax()).toEqual([]);
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

      expect(attribute.validateRuleMinMax()).toEqual([
        new ParserLog({
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.error.minNumber',
          attribute: 'test',
          extraData: 2,
        }),
        new ParserLog({
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.error.maxNumber',
          attribute: 'test',
          extraData: 0,
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

      expect(attribute.validateRuleMinMax()).toEqual([
        new ParserLog({
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.error.minArray',
          attribute: 'test',
          extraData: 2,
        }),
        new ParserLog({
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.error.maxArray',
          attribute: 'test',
          extraData: 0,
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

      expect(attribute.validateRuleMinMax()).toEqual([
        new ParserLog({
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.error.minString',
          attribute: 'test',
          extraData: 2,
        }),
        new ParserLog({
          severity: ParserLog.SEVERITY_ERROR,
          message: 'parser.error.maxString',
          attribute: 'test',
          extraData: 0,
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

      expect(attribute.validateRuleMinMax()).toEqual([]);

      attribute.value = 'aaaaa';
      expect(attribute.validateRuleMinMax()).toEqual([]);

      attribute.definition.type = 'Array';
      attribute.value = ['a', 'a'];
      expect(attribute.validateRuleMinMax()).toEqual([]);

      attribute.value = ['a', 'a', 'a', 'a', 'a'];
      expect(attribute.validateRuleMinMax()).toEqual([]);

      attribute.definition.type = 'Number';
      attribute.value = 2;
      expect(attribute.validateRuleMinMax()).toEqual([]);

      attribute.value = 5;
      expect(attribute.validateRuleMinMax()).toEqual([]);
    });
  });

  describe('Test method: validateRuleValues', () => {
    it('should not set error without values rules', () => {
      const attribute = new ComponentAttribute();

      expect(attribute.validateRuleValues()).toEqual([]);

      attribute.definition = new ComponentAttributeDefinition();
      expect(attribute.validateRuleValues()).toEqual([]);
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

      expect(attribute.validateRuleValues()).toEqual([]);

      attribute.value = ['a'];
      expect(attribute.validateRuleValues()).toEqual([]);

      attribute.value = ['b', 'a'];
      expect(attribute.validateRuleValues()).toEqual([]);
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

      expect(attribute.validateRuleValues()).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.invalidValue',
        attribute: 'test',
        extraData: 'a, b',
      })]);

      attribute.value = ['c'];
      expect(attribute.validateRuleValues()).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.invalidValue',
        attribute: 'test',
        extraData: 'a, b',
      })]);

      attribute.value = ['b', 'a', 'c'];
      expect(attribute.validateRuleValues()).toEqual([new ParserLog({
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.invalidValue',
        attribute: 'test',
        extraData: 'a, b',
      })]);
    });
  });

  describe('Test method: validateRuleRegex', () => {
    it('should not set error without regex rules', () => {
      const attribute = new ComponentAttribute();

      expect(attribute.validateRuleRegex()).toEqual([]);

      attribute.definition = new ComponentAttributeDefinition();
      expect(attribute.validateRuleRegex()).toEqual([]);
    });

    it('should not set error when value is null', () => {
      const attribute = new ComponentAttribute({
        definition: new ComponentAttributeDefinition({
          rules: {
            regex: /[a-z]*/,
          },
        }),
      });

      expect(attribute.validateRuleRegex()).toEqual([]);
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

      expect(attribute.validateRuleRegex()).toEqual([]);
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

      expect(attribute.validateRuleRegex()).toEqual([new ParserLog({
        attribute: 'test',
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.regex',
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

      expect(attribute.validateRuleRegex()).toEqual([new ParserLog({
        attribute: 'test',
        severity: ParserLog.SEVERITY_ERROR,
        message: 'error',
      })]);
    });
  });
});
