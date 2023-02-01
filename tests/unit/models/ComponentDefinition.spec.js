import ComponentDefinition from 'src/models/ComponentDefinition';

describe('Test class: ComponentDefinition', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const componentDefinition = new ComponentDefinition();

      expect(componentDefinition.type).toBeNull();
      expect(componentDefinition.icon).toBeNull();
      expect(componentDefinition.model).toBeNull();
      expect(componentDefinition.displayName).toBeNull();
      expect(componentDefinition.description).toBeNull();
      expect(componentDefinition.url).toBeNull();
      expect(componentDefinition.parentTypes).toEqual([]);
      expect(componentDefinition.childrenTypes).toEqual([]);
      expect(componentDefinition.definedAttributes).toEqual([]);
      expect(componentDefinition.isContainer).toBeFalsy();
      expect(componentDefinition.displayType).toBeFalsy();
      expect(componentDefinition.preventChildrenMovement).toBeFalsy();
      expect(componentDefinition.childrenPerLine).toBeFalsy();
    });

    it('Check passing undefined variables to constructor', () => {
      const componentDefinition = new ComponentDefinition({});

      expect(componentDefinition.type).toBeNull();
      expect(componentDefinition.icon).toBeNull();
      expect(componentDefinition.model).toBeNull();
      expect(componentDefinition.displayName).toBeNull();
      expect(componentDefinition.description).toBeNull();
      expect(componentDefinition.url).toBeNull();
      expect(componentDefinition.parentTypes).toEqual([]);
      expect(componentDefinition.childrenTypes).toEqual([]);
      expect(componentDefinition.definedAttributes).toEqual([]);
      expect(componentDefinition.isContainer).toBeFalsy();
      expect(componentDefinition.displayType).toBeFalsy();
      expect(componentDefinition.preventChildrenMovement).toBeFalsy();
      expect(componentDefinition.childrenPerLine).toBeFalsy();
    });

    it('Check passing variable to constructor', () => {
      const componentDefinition = new ComponentDefinition({
        type: 'type',
        icon: 'icon',
        model: 'model',
        displayName: 'displayName',
        description: 'description',
        url: 'url',
        parentTypes: ['type'],
        childrenTypes: ['childrenType'],
        definedAttributes: ['attribute'],
        isContainer: true,
        displayType: 'test',
        preventChildrenMovement: true,
        childrenPerLine: 5,
      });

      expect(componentDefinition.type).toEqual('type');
      expect(componentDefinition.icon).toEqual('icon');
      expect(componentDefinition.model).toEqual('model');
      expect(componentDefinition.displayName).toEqual('displayName');
      expect(componentDefinition.description).toEqual('description');
      expect(componentDefinition.url).toEqual('url');
      expect(componentDefinition.parentTypes.length).toEqual(1);
      expect(componentDefinition.parentTypes[0]).toEqual('type');
      expect(componentDefinition.childrenTypes.length).toEqual(1);
      expect(componentDefinition.childrenTypes[0]).toEqual('childrenType');
      expect(componentDefinition.definedAttributes.length).toEqual(1);
      expect(componentDefinition.definedAttributes[0]).toEqual('attribute');
      expect(componentDefinition.isContainer).toBeTruthy();
      expect(componentDefinition.displayType).toEqual('test');
      expect(componentDefinition.preventChildrenMovement).toBeTruthy();
      expect(componentDefinition.childrenPerLine).toEqual(5);
    });
  });
});
