import LetoAttribute from 'src/models/LetoAttribute';

describe('Test class: LetoAttribute', () => {

  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const letoAttribute = new LetoAttribute();

      expect(letoAttribute.name).toBeNull();
      expect(letoAttribute.value).toBeNull();
      expect(letoAttribute.resourceType).toBeNull();
      expect(letoAttribute.representation).toBeNull();
      expect(letoAttribute.required).toBeNull();
      expect(letoAttribute.multiple).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const letoAttribute = new LetoAttribute('name', 'value', 'resourceType', 'representation', 'required', 'multiple');

      expect(letoAttribute.name).toEqual('name');
      expect(letoAttribute.value).toEqual('value');
      expect(letoAttribute.resourceType).toEqual('resourceType');
      expect(letoAttribute.representation).toEqual('representation');
      expect(letoAttribute.required).toEqual('required');
      expect(letoAttribute.multiple).toEqual('multiple');
    });
  });
});