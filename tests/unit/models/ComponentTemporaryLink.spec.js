import ComponentTemporaryLink from 'src/models/ComponentTemporaryLink';

describe('Test class: ComponentTemporaryLink', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const link = new ComponentTemporaryLink();

      expect(link.__class).toEqual('Link');
      expect(link.anchorName).toBeNull();
      expect(link.endX).toBeNull();
      expect(link.endY).toBeNull();
      expect(link.isTemporary).toEqual(true);
    });

    it('Check passing undefined variables to constructor', () => {
      const link = new ComponentTemporaryLink({});

      expect(link.__class).toEqual('Link');
      expect(link.anchorName).toBeNull();
      expect(link.endX).toBeNull();
      expect(link.endY).toBeNull();
      expect(link.isTemporary).toEqual(true);
    });

    it('Check passing variable to constructor', () => {
      const link = new ComponentTemporaryLink({
        anchorName: 'anchorName',
      });

      expect(link.__class).toEqual('Link');
      expect(link.anchorName).toEqual('anchorName');
      expect(link.endX).toBeNull();
      expect(link.endY).toBeNull();
      expect(link.isTemporary).toEqual(true);
    });
  });
});
