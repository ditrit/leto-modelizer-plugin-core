import ComponentDefinition from 'src/models/ComponentDefinition';

describe('Test class: ComponentDefinition', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const componentDefinition = new ComponentDefinition();

      expect(componentDefinition.type).toBeNull();
      expect(componentDefinition.icon).toBeNull();
      expect(componentDefinition.model).toBeNull();
      expect(componentDefinition.parentTypes).toEqual([]);
      expect(componentDefinition.definedAttributes).toEqual([]);
      expect(componentDefinition.isContainer).toBeFalsy();
    });

    it('Check passing undefined variables to constructor', () => {
      const componentDefinition = new ComponentDefinition({});

      expect(componentDefinition.type).toBeNull();
      expect(componentDefinition.icon).toBeNull();
      expect(componentDefinition.model).toBeNull();
      expect(componentDefinition.parentTypes).toEqual([]);
      expect(componentDefinition.definedAttributes).toEqual([]);
      expect(componentDefinition.isContainer).toBeFalsy();
    });

    it('Check passing variable to constructor', () => {
      const componentDefinition = new ComponentDefinition({
        type: 'type',
        icon: 'icon',
        model: 'model ',
        parentTypes: ['type'],
        definedAttributes: ['attribute'],
        isContainer: true,
      });

      expect(componentDefinition.type).toEqual('type');
      expect(componentDefinition.icon).toEqual('icon');
      expect(componentDefinition.model).toEqual('model ');
      expect(componentDefinition.parentTypes.length).toEqual(1);
      expect(componentDefinition.parentTypes[0]).toEqual('type');
      expect(componentDefinition.definedAttributes.length).toEqual(1);
      expect(componentDefinition.definedAttributes[0]).toEqual('attribute');
      expect(componentDefinition.isContainer).toBeTruthy();
    });
  });
});
