import ComponentLink from 'src/models/ComponentLink';

describe('Test class: ComponentLink', () => {

  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const link = new ComponentLink();

      expect(link.from.id).toBeNull();
      expect(link.to.id).toBeNull();
      expect(link.type).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const link = new ComponentLink({ id: 'id1' }, { id: 'id2' }, 'type');

      expect(link.from.id).toEqual('id1');
      expect(link.to.id).toEqual('id2');
      expect(link.type).toEqual('type');
    });
  });
});