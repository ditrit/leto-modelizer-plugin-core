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
    });

    it('Check passing undefined variables to constructor', () => {
      const link = new ComponentLinkDefinition({});

      expect(link.attributeRef).toBeNull();
      expect(link.sourceRef).toBeNull();
      expect(link.targetRef).toBeNull();
      expect(link.type).toBeNull();
      expect(link.color).toEqual('black');
    });

    it('Check passing variable to constructor', () => {
      const link = new ComponentLinkDefinition({
        attributeRef: 'attr',
        sourceRef: 'id1',
        targetRef: 'id2',
        type: 'type',
        color: 'blue',
      });

      expect(link.attributeRef).toEqual('attr');
      expect(link.sourceRef).toEqual('id1');
      expect(link.targetRef).toEqual('id2');
      expect(link.type).toEqual('type');
      expect(link.color).toEqual('blue');
    });
  });
});
