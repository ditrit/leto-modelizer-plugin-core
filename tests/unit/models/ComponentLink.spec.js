import ComponentLink from 'src/models/ComponentLink';

describe('Test class: ComponentLink', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const link = new ComponentLink();

      expect(link.__class).toEqual('Link');
      expect(link.source).toBeNull();
      expect(link.target).toBeNull();
      expect(link.definition).toBeNull();
    });

    it('Check passing undefined variables to constructor', () => {
      const link = new ComponentLink({});

      expect(link.__class).toEqual('Link');
      expect(link.source).toBeNull();
      expect(link.target).toBeNull();
      expect(link.definition).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const link = new ComponentLink({
        source: 'source',
        target: 'target',
        definition: {},
      });

      expect(link.__class).toEqual('Link');
      expect(link.source).toEqual('source');
      expect(link.target).toEqual('target');
      expect(link.definition).toBeDefined();
    });
  });
});
