import ComponentAttributeDefinition from 'src/models/ComponentAttributeDefinition';

describe('Test class: ComponentAttributeDefinition', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const definedAttribute = new ComponentAttributeDefinition();

      expect(definedAttribute.name).toBeNull();
      expect(definedAttribute.type).toBeNull();
      expect(definedAttribute.displayName).toBeNull();
      expect(definedAttribute.description).toBeNull();
      expect(definedAttribute.url).toBeNull();
      expect(definedAttribute.linkType).toBeNull();
      expect(definedAttribute.linkRef).toEqual([]);
      expect(definedAttribute.linkColor).toEqual('black');
      expect(definedAttribute.linkWidth).toEqual(2);
      expect(definedAttribute.linkDashStyle).toBeNull();
      expect(definedAttribute.containerRef).toBeNull();
      expect(definedAttribute.definedAttributes).toEqual([]);
      expect(definedAttribute.itemDefinition).toEqual([]);
      expect(definedAttribute.itemType).toBeNull();
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
      expect(definedAttribute.displayName).toBeNull();
      expect(definedAttribute.description).toBeNull();
      expect(definedAttribute.url).toBeNull();
      expect(definedAttribute.linkType).toBeNull();
      expect(definedAttribute.linkRef).toEqual([]);
      expect(definedAttribute.linkColor).toEqual('black');
      expect(definedAttribute.linkWidth).toEqual(2);
      expect(definedAttribute.linkDashStyle).toBeNull();
      expect(definedAttribute.containerRef).toBeNull();
      expect(definedAttribute.definedAttributes).toEqual([]);
      expect(definedAttribute.itemDefinition).toEqual([]);
      expect(definedAttribute.itemType).toBeNull();
      expect(definedAttribute.required).toEqual(false);
      expect(definedAttribute.rules.values).toBeNull();
      expect(definedAttribute.rules.min).toBeNull();
      expect(definedAttribute.rules.max).toBeNull();
      expect(definedAttribute.rules.regex).toBeNull();
    });

    it('Check passing empty rules to constructor', () => {
      const definedAttribute = new ComponentAttributeDefinition({ rules: {}, linkWidth: 0 });

      expect(definedAttribute.name).toBeNull();
      expect(definedAttribute.type).toBeNull();
      expect(definedAttribute.displayName).toBeNull();
      expect(definedAttribute.description).toBeNull();
      expect(definedAttribute.url).toBeNull();
      expect(definedAttribute.linkType).toBeNull();
      expect(definedAttribute.linkRef).toEqual([]);
      expect(definedAttribute.linkColor).toEqual('black');
      expect(definedAttribute.linkWidth).toEqual(2);
      expect(definedAttribute.linkDashStyle).toBeNull();
      expect(definedAttribute.containerRef).toBeNull();
      expect(definedAttribute.definedAttributes).toEqual([]);
      expect(definedAttribute.itemDefinition).toEqual([]);
      expect(definedAttribute.itemType).toBeNull();
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
        displayName: 'displayName',
        description: 'description',
        url: 'url',
        linkType: 'Default',
        linkRef: ['linkRef'],
        linkColor: 'blue',
        linkWidth: 3,
        linkDashStyle: [1, 1],
        containerRef: 'containerRef',
        definedAttributes: [new ComponentAttributeDefinition()],
        itemDefinition: [new ComponentAttributeDefinition()],
        itemType: 'ItemType',
        required: true,
        rules: {
          values: ['value'],
          min: 1,
          max: 2,
          regex: /regex/,
        },
      });

      expect(definedAttribute.name).toEqual('name');
      expect(definedAttribute.type).toEqual('type');
      expect(definedAttribute.displayName).toEqual('displayName');
      expect(definedAttribute.description).toEqual('description');
      expect(definedAttribute.url).toEqual('url');
      expect(definedAttribute.linkType).toEqual('Default');
      expect(definedAttribute.linkRef.length).toEqual(1);
      expect(definedAttribute.linkRef[0]).toEqual('linkRef');
      expect(definedAttribute.linkColor).toEqual('blue');
      expect(definedAttribute.linkWidth).toEqual(3);
      expect(definedAttribute.linkDashStyle).toEqual([1, 1]);
      expect(definedAttribute.containerRef).toEqual('containerRef');
      expect(definedAttribute.definedAttributes.length).toEqual(1);
      expect(definedAttribute.definedAttributes[0]).not.toBeNull();
      expect(definedAttribute.itemDefinition.length).toEqual(1);
      expect(definedAttribute.itemDefinition[0]).not.toBeNull();
      expect(definedAttribute.itemType).toEqual('ItemType');
      expect(definedAttribute.rules.values).toEqual(['value']);
      expect(definedAttribute.required).toEqual(true);
      expect(definedAttribute.rules.values).toEqual(['value']);
      expect(definedAttribute.rules.min).toEqual(1);
      expect(definedAttribute.rules.max).toEqual(2);
      expect(definedAttribute.rules.regex).toEqual(/regex/);
    });
  });
});
