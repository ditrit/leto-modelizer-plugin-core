import ComponentLinkDefinition from 'src/models/ComponentLinkDefinition';

describe('Test class: ComponentLinkDefinition', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const link = new ComponentLinkDefinition();

      expect(link.attributeRef).toBeNull();
      expect(link.sourceRef).toBeNull();
      expect(link.targetRef).toBeNull();
      expect(link.type).toBeNull();
      expect(link.color).toEqual('black');
      expect(link.width).toEqual(2);
      expect(link.dashStyle).toBeNull();
    });

    it('Check passing undefined variables to constructor', () => {
      const link = new ComponentLinkDefinition({});

      expect(link.attributeRef).toBeNull();
      expect(link.sourceRef).toBeNull();
      expect(link.targetRef).toBeNull();
      expect(link.type).toBeNull();
      expect(link.color).toEqual('black');
      expect(link.width).toEqual(2);
      expect(link.dashStyle).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const link = new ComponentLinkDefinition({
        attributeRef: 'attr',
        sourceRef: 'id1',
        targetRef: 'id2',
        type: 'type',
        color: 'blue',
        width: 3,
        dashStyle: [1, 1],
      });

      expect(link.attributeRef).toEqual('attr');
      expect(link.sourceRef).toEqual('id1');
      expect(link.targetRef).toEqual('id2');
      expect(link.type).toEqual('type');
      expect(link.color).toEqual('blue');
      expect(link.width).toEqual(3);
      expect(link.dashStyle).toEqual([1, 1]);
    });
  });
});
