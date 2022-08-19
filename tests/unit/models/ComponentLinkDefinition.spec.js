import ComponentLinkDefinition from 'src/models/ComponentLinkDefinition';

describe('Test class: ComponentLinkDefinition', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const link = new ComponentLinkDefinition();

      expect(link.sourceRef).toBeNull();
      expect(link.targetRef).toBeNull();
      expect(link.type).toBeNull();
    });

    it('Check passing undefined variables to constructor', () => {
      const link = new ComponentLinkDefinition({});

      expect(link.sourceRef).toBeNull();
      expect(link.targetRef).toBeNull();
      expect(link.type).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const link = new ComponentLinkDefinition({
        sourceRef: 'id1',
        targetRef: 'id2',
        type: 'type',
      });

      expect(link.sourceRef).toEqual('id1');
      expect(link.targetRef).toEqual('id2');
      expect(link.type).toEqual('type');
    });
  });
});
