import Tag from 'src/models/Tag';

describe('Test class: Tag', () => {
  describe('Test constructor', () => {
    it('Check variables instantiation', () => {
      const tag = new Tag();

      expect(tag.type).toBeNull();
      expect(tag.value).toBeNull();
    });

    it('Check passing undefined variables to constructor', () => {
      const tag = new Tag({});

      expect(tag.type).toBeNull();
      expect(tag.value).toBeNull();
    });

    it('Check passing all variables to constructor', () => {
      const tag = new Tag({
        type: 'type',
        value: 'value',
      });

      expect(tag.type).toEqual('type');
      expect(tag.value).toEqual('value');
    });
  });
});
