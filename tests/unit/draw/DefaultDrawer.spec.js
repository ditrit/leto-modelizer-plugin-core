import DefaultDrawer from 'src/draw/DefaultDrawer';

describe('Test Class: DefaultDrawer()', () => {
  describe('Test instanciate', () => {
    it('Test default constructor', () => {
      const drawer = new DefaultDrawer();
      expect(drawer.resources).toBeNull();
      expect(drawer.d3).not.toBeNull();
    });

    it('Test passing value in constructor', () => {
      const drawer = new DefaultDrawer('test');
      expect(drawer.resources).toEqual('test');
      expect(drawer.d3).not.toBeNull();
    });
  });

  describe('Test method: draw', () => {
    let drawer;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      drawer.d3 = {
        select: jest.fn(() => drawer.d3),
        selectAll: jest.fn(() => drawer.d3),
        data: jest.fn(() => drawer.d3),
        enter: jest.fn(() => drawer.d3),
        append: jest.fn(() => drawer.d3),
        attr: jest.fn(() => drawer.d3),
        each: jest.fn(() => drawer.d3),
        exit: jest.fn(() => drawer.d3),
        remove: jest.fn(() => drawer.d3),
      };
      drawer.drawDefaultResource = jest.fn();
    });

    it('Draw should call drawDefaultResource method', () => {
      drawer.draw([]);

      expect(drawer.drawDefaultResource).toBeCalled();
    });
  });

  describe('Test method: drawDefaultResource', () => {
    let drawer;
    let component;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      component = {
        attr: jest.fn(() => component),
        select: jest.fn(() => component),
        text: jest.fn(() => component),
      };
    });

    it('drawDefaultResource should setup default component', () => {
      drawer.drawDefaultResource(component);

      expect(component.attr).toBeCalledTimes(3);
      expect(component.attr.mock.calls[0][0]).toBe('id');
      expect(component.attr.mock.calls[1][0]).toBe('x');
      expect(component.attr.mock.calls[2][0]).toBe('y');

      expect(component.select).toBeCalledTimes(2);
      expect(component.text).toBeCalledTimes(2);
      expect(component.select.mock.calls).toEqual([['.component-name'], ['.component-type']]);
    });
  });
});
