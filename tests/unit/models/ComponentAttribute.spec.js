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
      expect(componentAttribute.definition).not.toBeNull();
    });
  });
});
