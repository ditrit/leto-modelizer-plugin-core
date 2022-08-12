import ComponentAttributeDefinition from 'src/models/ComponentAttributeDefinition';

describe('Test class: ComponentAttributeDefinition', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const definedAttribute = new ComponentAttributeDefinition();

      expect(definedAttribute.name).toBeNull();
      expect(definedAttribute.type).toBeNull();
      expect(definedAttribute.linkTypes).toEqual([]);
      expect(definedAttribute.required).toEqual(false);
      expect(definedAttribute.rules.values).toBeNull();
      expect(definedAttribute.rules.min).toBeNull();
      expect(definedAttribute.rules.max).toBeNull();
      expect(definedAttribute.rules.regex).toBeNull();
    });

    it('Check passing undefined variables to constructor', () => {
      const definedAttribute = new ComponentAttributeDefinition({});

      expect(definedAttribute.name).toBeNull();
      expect(definedAttribute.type).toBeNull();
      expect(definedAttribute.linkTypes).toEqual([]);
      expect(definedAttribute.required).toEqual(false);
      expect(definedAttribute.rules.values).toBeNull();
      expect(definedAttribute.rules.min).toBeNull();
      expect(definedAttribute.rules.max).toBeNull();
      expect(definedAttribute.rules.regex).toBeNull();
    });

    it('Check passing empty rules to constructor', () => {
      const definedAttribute = new ComponentAttributeDefinition({ rules: {} });

      expect(definedAttribute.name).toBeNull();
      expect(definedAttribute.type).toBeNull();
      expect(definedAttribute.linkTypes).toEqual([]);
      expect(definedAttribute.required).toEqual(false);
      expect(definedAttribute.rules.values).toBeNull();
      expect(definedAttribute.rules.min).toBeNull();
      expect(definedAttribute.rules.max).toBeNull();
      expect(definedAttribute.rules.regex).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const definedAttribute = new ComponentAttributeDefinition({
        name: 'name',
        type: 'type',
        linkTypes: ['linkTypes'],
        required: true,
        rules: {
          values: ['value'],
          min: 1,
          max: 2,
          regex: '/regex/',
        },
      });

      expect(definedAttribute.name).toEqual('name');
      expect(definedAttribute.type).toEqual('type');
      expect(definedAttribute.linkTypes.length).toEqual(1);
      expect(definedAttribute.linkTypes[0]).toEqual('linkTypes');
      expect(definedAttribute.required).toEqual(true);
      expect(definedAttribute.rules.values).toEqual(['value']);
      expect(definedAttribute.rules.min).toEqual(1);
      expect(definedAttribute.rules.max).toEqual(2);
      expect(definedAttribute.rules.regex).toEqual('/regex/');
    });
  });
});
