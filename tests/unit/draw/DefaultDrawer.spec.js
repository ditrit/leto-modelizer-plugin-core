import DefaultDrawer from 'src/draw/DefaultDrawer';

describe('Test Class: DefaultDrawer()', () => {
  describe('Test methods', () => {
    it('Test draw() method', () => {
      const defaultDrawer = new DefaultDrawer();
      expect(defaultDrawer.draw()).toEqual(null);
    });
  });
});
