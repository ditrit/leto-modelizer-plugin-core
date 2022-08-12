import ComponentDefinition from 'src/models/ComponentDefinition';

describe('Test class: ComponentDefinition', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const componentDefinition = new ComponentDefinition();

      expect(componentDefinition.type).toBeNull();
      expect(componentDefinition.icon).toBeNull();
      expect(componentDefinition.svgTemplate).toBeNull();
      expect(componentDefinition.parentTypes).toEqual([]);
      expect(componentDefinition.definedAttributes).toEqual([]);
      expect(componentDefinition.isContainer).toEqual(true);
    });

    it('Check passing variable to constructor', () => {
      const componentDefinition = new ComponentDefinition(
        'type',
        'icon',
        'svgTemplate',
        ['type'],
        ['attribute'],
        false,
      );

      expect(componentDefinition.type).toEqual('type');
      expect(componentDefinition.icon).toEqual('icon');
      expect(componentDefinition.svgTemplate).toEqual('svgTemplate');
      expect(componentDefinition.parentTypes.length).toEqual(1);
      expect(componentDefinition.parentTypes[0]).toEqual('type');
      expect(componentDefinition.definedAttributes.length).toEqual(1);
      expect(componentDefinition.definedAttributes[0]).toEqual('attribute');
      expect(componentDefinition.isContainer).toEqual(false);
    });
  });
});
