import ComponentLink from 'src/models/ComponentLink';

describe('Test class: ComponentLink', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const link = new ComponentLink();

      expect(link.__class).toEqual('Link');
      expect(link.source).toBeNull();
      expect(link.target).toBeNull();
      expect(link.name).toBeNull();
      expect(link.definition).toBeNull();
      expect(link.isReverse).toEqual(false);
    });

    it('Check passing undefined variables to constructor', () => {
      const link = new ComponentLink({});

      expect(link.__class).toEqual('Link');
      expect(link.source).toBeNull();
      expect(link.target).toBeNull();
      expect(link.name).toBeNull();
      expect(link.definition).toBeNull();
      expect(link.isReverse).toEqual(false);
    });

    it('Check passing variable to constructor', () => {
      const link = new ComponentLink({
        source: 'source',
        target: 'target',
        name: 'name',
        definition: {},
        isReverse: true,
      });

      expect(link.__class).toEqual('Link');
      expect(link.source).toEqual('source');
      expect(link.target).toEqual('target');
      expect(link.name).toEqual('name');
      expect(link.definition).toBeDefined();
      expect(link.isReverse).toEqual(true);
    });
  });
});
