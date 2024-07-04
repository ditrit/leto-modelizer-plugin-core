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
      expect(componentDefinition.categories).toEqual([]);
      expect(componentDefinition.tags).toEqual([]);
      expect(componentDefinition.parentTypes).toEqual([]);
      expect(componentDefinition.childrenTypes).toEqual([]);
      expect(componentDefinition.definedAttributes).toEqual([]);
      expect(componentDefinition.isContainer).toBeFalsy();
      expect(componentDefinition.displayType).toBeFalsy();
      expect(componentDefinition.workflowDirection).toEqual('horizontal');
      expect(componentDefinition.linkModel).toBeNull();
      expect(componentDefinition.defaultWidth).toEqual(0);
      expect(componentDefinition.defaultHeight).toEqual(0);
      expect(componentDefinition.minWidth).toEqual(0);
      expect(componentDefinition.minHeight).toEqual(0);
      expect(componentDefinition.reservedWidth).toEqual(0);
      expect(componentDefinition.reservedHeight).toEqual(0);
      expect(componentDefinition.margin).toEqual(10);
      expect(componentDefinition.gap).toEqual(30);
    });

    it('Check passing undefined variables to constructor', () => {
      const componentDefinition = new ComponentDefinition({});

      expect(componentDefinition.type).toBeNull();
      expect(componentDefinition.icon).toBeNull();
      expect(componentDefinition.model).toBeNull();
      expect(componentDefinition.displayName).toBeNull();
      expect(componentDefinition.description).toBeNull();
      expect(componentDefinition.url).toBeNull();
      expect(componentDefinition.categories).toEqual([]);
      expect(componentDefinition.tags).toEqual([]);
      expect(componentDefinition.parentTypes).toEqual([]);
      expect(componentDefinition.childrenTypes).toEqual([]);
      expect(componentDefinition.definedAttributes).toEqual([]);
      expect(componentDefinition.isContainer).toBeFalsy();
      expect(componentDefinition.displayType).toBeFalsy();
      expect(componentDefinition.workflowDirection).toEqual('horizontal');
      expect(componentDefinition.linkModel).toBeNull();
      expect(componentDefinition.defaultWidth).toEqual(0);
      expect(componentDefinition.defaultHeight).toEqual(0);
      expect(componentDefinition.minWidth).toEqual(0);
      expect(componentDefinition.minHeight).toEqual(0);
      expect(componentDefinition.reservedWidth).toEqual(0);
      expect(componentDefinition.reservedHeight).toEqual(0);
      expect(componentDefinition.margin).toEqual(10);
      expect(componentDefinition.gap).toEqual(30);
    });

    it('Check passing variable to constructor', () => {
      const componentDefinition = new ComponentDefinition({
        type: 'type',
        icon: 'icon',
        model: 'model',
        displayName: 'displayName',
        description: 'description',
        url: 'url',
        tags: ['tag'],
        categories: ['category'],
        parentTypes: ['type'],
        childrenTypes: ['childrenType'],
        definedAttributes: ['attribute'],
        isContainer: true,
        displayType: 'displayType',
        workflowDirection: 'vertical',
        linkModel: 'linkModel',
        defaultWidth: 1,
        defaultHeight: 2,
        minWidth: 3,
        minHeight: 4,
        reservedWidth: 5,
        reservedHeight: 6,
        margin: 7,
        gap: 8,
      });

      expect(componentDefinition.type).toEqual('type');
      expect(componentDefinition.icon).toEqual('icon');
      expect(componentDefinition.model).toEqual('model');
      expect(componentDefinition.displayName).toEqual('displayName');
      expect(componentDefinition.description).toEqual('description');
      expect(componentDefinition.url).toEqual('url');
      expect(componentDefinition.categories).toEqual(['category']);
      expect(componentDefinition.tags).toEqual(['tag']);
      expect(componentDefinition.parentTypes.length).toEqual(1);
      expect(componentDefinition.parentTypes[0]).toEqual('type');
      expect(componentDefinition.childrenTypes.length).toEqual(1);
      expect(componentDefinition.childrenTypes[0]).toEqual('childrenType');
      expect(componentDefinition.definedAttributes.length).toEqual(1);
      expect(componentDefinition.definedAttributes[0]).toEqual('attribute');
      expect(componentDefinition.isContainer).toBeTruthy();
      expect(componentDefinition.displayType).toEqual('displayType');
      expect(componentDefinition.workflowDirection).toEqual('vertical');
      expect(componentDefinition.linkModel).toEqual('linkModel');
      expect(componentDefinition.defaultWidth).toEqual(1);
      expect(componentDefinition.defaultHeight).toEqual(2);
      expect(componentDefinition.minWidth).toEqual(3);
      expect(componentDefinition.minHeight).toEqual(4);
      expect(componentDefinition.reservedWidth).toEqual(5);
      expect(componentDefinition.reservedHeight).toEqual(6);
      expect(componentDefinition.margin).toEqual(7);
      expect(componentDefinition.gap).toEqual(8);
    });
  });
});
