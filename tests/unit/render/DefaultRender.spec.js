import DefaultRender from 'src/render/DefaultRender';

describe('Test Class: DefaultRender()', () => {
  describe('Test methods', () => {
    it('Test render() method', () => {
      const defaultRender = new DefaultRender();
      expect(defaultRender.render()).toEqual('string');
    });
  });
});
