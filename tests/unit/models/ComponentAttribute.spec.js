import ComponentAttribute from 'src/models/ComponentAttribute';

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

  describe('Test getters', () => {
    describe('Test getter: isVariable', () => {
      it('should return false', () => {
        expect(new ComponentAttribute().isVariable).toBeFalsy();
      });
    });
  });

  describe('Test methods', () => {
    describe('Test method: checkByType', () => {
      it('Check if definition is null', () => {
        const componentAttribute = new ComponentAttribute({
          name: 'name',
          value: 'value',
          type: 'String',
          definition: null,
        });

        expect(componentAttribute.hasError()).toBeFalsy();
      });

      it('Check if value is null', () => {
        const componentAttribute = new ComponentAttribute({
          name: 'name',
          value: null,
          type: 'String',
          definition: null,
        });

        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if type is array', () => {
        const componentAttribute = new ComponentAttribute({
          name: 'name',
          value: ['value'],
          type: 'Array',
          definition: null,
        });

        expect(componentAttribute.hasError()).toBeFalsy();
      });

      it('Check if type is not array', () => {
        const componentAttribute = new ComponentAttribute({
          name: 'name',
          value: 'string',
          type: 'Array',
          definition: null,
        });

        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value type is not equal to type', () => {
        const componentAttribute = new ComponentAttribute({
          name: 'name',
          value: 'string',
          type: 'Number',
          definition: null,
        });

        expect(componentAttribute.hasError()).toBeTruthy();
      });
    });

    describe('Test method: getReferenceValue', () => {
      it('should return the component attribute value', () => {
        const componentAttribute = new ComponentAttribute({
          value: 'value',
        });

        expect(componentAttribute.getReferenceValue()).toEqual('value');
      });
    });

    describe('Test method: setReferenceValue', () => {
      it('should set the new reference value', () => {
        const componentAttribute = new ComponentAttribute({
          value: 'value',
        });

        expect(componentAttribute.value).toEqual('value');

        componentAttribute.setReferenceValue('newValue');

        expect(componentAttribute.value).toEqual('newValue');
      });
    });

    describe('Test method: replaceLink', () => {
      it('should update the component attribute value', () => {
        const componentAttribute = new ComponentAttribute({
          name: 'name',
          value: ['oldId'],
          type: 'Array',
          definition: {
            type: 'Link',
            rules: {
              values: null,
              min: 1,
              max: 5,
            },
          },
        });

        componentAttribute.replaceLink('oldId', 'newId');

        expect(componentAttribute.value).toEqual(['newId']);
      });

      it('should do nothing if id to replace is not found', () => {
        const componentAttribute = new ComponentAttribute({
          name: 'name',
          value: ['oldId'],
          type: 'Array',
          definition: {
            type: 'Link',
            rules: {
              values: null,
              min: 1,
              max: 5,
            },
          },
        });

        componentAttribute.replaceLink('wrongId', 'newId');

        expect(componentAttribute.value).toEqual(['oldId']);
      });
    });

    describe('Test method: getLinkValue', () => {
      it('should return the component attribute link value', () => {
        const componentAttribute = new ComponentAttribute({
          value: ['value'],
        });

        expect(componentAttribute.getLinkValue()).toEqual(['value']);
      });
    });

    describe('Test method: addLink', () => {
      it('should push the id inside the value array', () => {
        const componentAttribute = new ComponentAttribute({
          value: ['value'],
        });

        expect(componentAttribute.value).toEqual(['value']);

        componentAttribute.addLink('newValue');

        expect(componentAttribute.value).toEqual(['value', 'newValue']);
      });

      it('should do nothing if id already exists inside the value array', () => {
        const componentAttribute = new ComponentAttribute({
          value: ['value'],
        });

        expect(componentAttribute.value).toEqual(['value']);

        componentAttribute.addLink('value');

        expect(componentAttribute.value).toEqual(['value']);
      });
    });

    describe('Test type: String', () => {
      const componentAttribute = new ComponentAttribute({
        name: 'name',
        value: 'string',
        type: 'String',
        definition: {
          type: 'String',
          rules: {
            values: null,
            min: 1,
            max: 10,
            regex: /^[a-z]+$/,
          },
        },
      });

      it('Check if respect all conditions', () => {
        expect(componentAttribute.hasError()).toBeFalsy();
      });

      it('Check if type is not string', () => {
        componentAttribute.value = 1;
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is smaller than min', () => {
        componentAttribute.value = '';
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is bigger than max', () => {
        componentAttribute.value = '12345678910';
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is not in values', () => {
        componentAttribute.value = 'string';
        componentAttribute.definition.rules.values = ['value'];
        expect(componentAttribute.hasError()).toBeTruthy();

        componentAttribute.definition.rules.values = null;
      });

      it('Check if value is in values', () => {
        componentAttribute.value = 'strong';
        componentAttribute.definition.rules.values = ['strong'];
        expect(componentAttribute.hasError()).toBeFalsy();

        componentAttribute.definition.rules.values = null;
      });

      it('Check if value doesn\'t match with regex', () => {
        componentAttribute.value = 'S7R1N6';
        expect(componentAttribute.hasError()).toBeTruthy();
      });
    });

    describe('Test type: Number', () => {
      const componentAttribute = new ComponentAttribute({
        name: 'name',
        value: 5,
        type: 'Number',
        definition: {
          type: 'Number',
          rules: {
            values: null,
            min: 1,
            max: 10,
          },
        },
      });

      it('Check if respect all conditions', () => {
        expect(componentAttribute.hasError()).toBeFalsy();
      });

      it('Check if type is not number', () => {
        componentAttribute.value = 'string';
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is smaller than min', () => {
        componentAttribute.value = 0;
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is bigger than max', () => {
        componentAttribute.value = 11;
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is not in values', () => {
        componentAttribute.value = 5;
        componentAttribute.definition.rules.values = [1, 2, 3];
        expect(componentAttribute.hasError()).toBeTruthy();

        componentAttribute.definition.rules.values = null;
      });

      it('Check if value is in values', () => {
        componentAttribute.value = 5;
        componentAttribute.definition.rules.values = [1, 2, 3, 5];
        expect(componentAttribute.hasError()).toBeFalsy();

        componentAttribute.definition.rules.values = null;
      });
    });

    describe('Test type: Boolean', () => {
      const componentAttribute = new ComponentAttribute({
        name: 'name',
        value: true,
        type: 'Boolean',
        definition: {
          type: 'Boolean',
          rules: {
            values: null,
          },
        },
      });

      it('Check if respect all conditions', () => {
        expect(componentAttribute.hasError()).toBeFalsy();
      });

      it('Check if type is not boolean', () => {
        componentAttribute.value = 'string';
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is not in values', () => {
        componentAttribute.value = true;
        componentAttribute.definition.rules.values = [false];
        expect(componentAttribute.hasError()).toBeTruthy();

        componentAttribute.definition.rules.values = null;
      });

      it('Check if value is in values', () => {
        componentAttribute.value = true;
        componentAttribute.definition.rules.values = [true];
        expect(componentAttribute.hasError()).toBeFalsy();

        componentAttribute.definition.rules.values = null;
      });
    });

    describe('Test type: Object', () => {
      const componentAttribute = new ComponentAttribute({
        name: 'name',
        value: {},
        type: 'Object',
        definition: {
          type: 'Object',
          rules: {
            values: null,
          },
        },
      });

      it('Check if respect all conditions', () => {
        expect(componentAttribute.hasError()).toBeFalsy();
      });

      it('Check if type is not object', () => {
        componentAttribute.value = 'string';
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is not in values', () => {
        componentAttribute.value = {};
        componentAttribute.definition.rules.values = [{ test: 'test' }];
        expect(componentAttribute.hasError()).toBeTruthy();

        componentAttribute.definition.rules.values = null;
      });

      it('Check if value is in values', () => {
        const object = {};

        componentAttribute.value = object;
        componentAttribute.definition.rules.values = [object];
        expect(componentAttribute.hasError()).toBeFalsy();

        componentAttribute.definition.rules.values = null;
      });
    });

    describe('Test type: Array', () => {
      const componentAttribute = new ComponentAttribute({
        name: 'name',
        value: [1, 2, 3],
        type: 'Array',
        definition: {
          type: 'Array',
          rules: {
            values: null,
            min: 2,
            max: 5,
          },
        },
      });

      it('Check if respect all conditions', () => {
        expect(componentAttribute.hasError()).toBeFalsy();
      });

      it('Check if type is not array', () => {
        componentAttribute.value = 'string';
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is smaller than min', () => {
        componentAttribute.value = [1];
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is bigger than max', () => {
        componentAttribute.value = [1, 2, 3, 4, 5, 6];
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is not in values', () => {
        componentAttribute.value = ['test'];
        componentAttribute.definition.rules.values = [1, 2, 3];
        expect(componentAttribute.hasError()).toBeTruthy();

        componentAttribute.definition.rules.values = null;
      });

      it('Check if value is in values', () => {
        const array = [1, 2, 3];

        componentAttribute.value = array;
        componentAttribute.definition.rules.values = array;
        expect(componentAttribute.hasError()).toBeFalsy();

        componentAttribute.definition.rules.values = null;
      });
    });

    describe('Test type: Reference', () => {
      const componentAttribute = new ComponentAttribute({
        name: 'name',
        value: 'test',
        type: 'String',
        definition: {
          type: 'Reference',
          rules: {
            values: null,
          },
        },
      });

      it('Check if respect all conditions', () => {
        expect(componentAttribute.hasError()).toBeFalsy();
      });

      it('Check if type is not string', () => {
        componentAttribute.value = 5;
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is not in values', () => {
        componentAttribute.value = 'test';
        componentAttribute.definition.rules.values = ['test2'];
        expect(componentAttribute.hasError()).toBeTruthy();

        componentAttribute.definition.rules.values = null;
      });

      it('Check if value is in values', () => {
        componentAttribute.value = 'test';
        componentAttribute.definition.rules.values = ['test'];
        expect(componentAttribute.hasError()).toBeFalsy();

        componentAttribute.definition.rules.values = null;
      });
    });

    describe('Test type: Link', () => {
      const componentAttribute = new ComponentAttribute({
        name: 'name',
        value: ['link'],
        type: 'Array',
        definition: {
          type: 'Link',
          rules: {
            values: null,
            min: 1,
            max: 5,
          },
        },
      });

      it('Check if respect all conditions', () => {
        expect(componentAttribute.hasError()).toBeFalsy();
      });

      it('Check if type is not array', () => {
        componentAttribute.value = 'string';
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is smaller than min', () => {
        componentAttribute.value = [];
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is bigger than max', () => {
        componentAttribute.value = ['link1', 'link2', 'link3', 'link4', 'link5', 'link6'];
        expect(componentAttribute.hasError()).toBeTruthy();
      });

      it('Check if value is not in values', () => {
        componentAttribute.value = ['link1'];
        componentAttribute.definition.rules.values = ['link2', 'link3'];
        expect(componentAttribute.hasError()).toBeTruthy();

        componentAttribute.definition.rules.values = null;
      });

      it('Check if value is in values', () => {
        const links = ['link2'];

        componentAttribute.value = links;
        componentAttribute.definition.rules.values = ['link1', ...links, 'link3'];
        expect(componentAttribute.hasError()).toBeFalsy();

        componentAttribute.definition.rules.values = null;
      });
    });
  });
});
