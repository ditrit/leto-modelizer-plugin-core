import DefaultDrawer from 'src/draw/DefaultDrawer';
import ComponentDrawOption from 'src/models/ComponentDrawOption';

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
      drawer.initializeComponents = jest.fn();
      drawer.drawDefaultModel = jest.fn();
    });

    it('Draw should call the internal methods', () => {
      drawer.draw([]);

      expect(drawer.initializeComponents).toBeCalled();
      expect(drawer.drawDefaultModel).toBeCalled();
    });
  });

  describe('Test method: initializeComponents', () => {
    let drawer;
    let component01;
    let component02;
    let svgContainer;

    beforeEach(() => {
      document.body.innerHTML = '<svg id="viewport"></svg>';
      drawer = new DefaultDrawer();
      drawer.storeComponentSize = jest.fn();
      drawer.setComponentPosition = jest.fn();
      component01 = { drawOption: null };
      component02 = { drawOption: new ComponentDrawOption() };
      svgContainer = {
        each: jest.fn(() => svgContainer)
          .mockImplementation((arg) => arg(null, 0, [])),
      };
    });

    it('Should call every internal methods and set a drawOption if null', () => {
      drawer.storeComponentSize.mockImplementation((list, component) => {
        component.drawOption.width = 0;
        component.drawOption.height = 0;
      });
      drawer.initializeComponents([component01], svgContainer);
      expect(component01.drawOption).not.toEqual(null);
      expect(drawer.storeComponentSize).toBeCalledTimes(1);
      expect(drawer.setComponentPosition).toBeCalledTimes(1);
    });

    it('Should not call setComponentPosition method', () => {
      drawer.storeComponentSize.mockImplementation((list, component) => {
        component.drawOption.width = 1;
        component.drawOption.height = 1;
      });
      drawer.initializeComponents([component02], svgContainer);
      expect(drawer.setComponentPosition).not.toBeCalled();
    });
  });

  describe('Test method: setComponentPosition', () => {
    let drawer;
    let component01;
    let component02;
    let component03;
    let canvasWidth;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      component01 = { drawOption: new ComponentDrawOption(1, 1, 1, 1) };
      component02 = { drawOption: new ComponentDrawOption(1, 1, 1, 1) };
      component03 = { drawOption: new ComponentDrawOption(1, 1, 1, 1) };
      canvasWidth = 33;
    });

    it('Should set the good positions to components.drawOption', () => {
      /*
      [0][_][2]
      [_][4][_]
      [_][_][_] *0, 2 and 4 are index of setup components.

      Expected grid from => canvasWidth / (componentWidth + margin).
      componentWidth = 1, margin = 10, canvasSize = 33.
      So cells width is equal to 11 and maxColumn is equal to 3.
       */
      drawer.setComponentPosition(component01, 0, canvasWidth, { width: 1, height: 1 });
      expect(component01.drawOption.x).toEqual(0);
      expect(component01.drawOption.y).toEqual(0);
      drawer.setComponentPosition(component02, 2, canvasWidth, { width: 1, height: 1 });
      expect(component02.drawOption.x).toEqual(22);
      expect(component02.drawOption.y).toEqual(0);
      drawer.setComponentPosition(component03, 4, canvasWidth, { width: 1, height: 1 });
      expect(component03.drawOption.x).toEqual(11);
      expect(component03.drawOption.y).toEqual(11);
    });
  });

  describe('Test method: storeComponentSize', () => {
    let drawer;
    let component;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      drawer.getComponentSize = jest.fn().mockReturnValue({ width: 1, height: 2 });
      component = {
        drawOption: {
          width: null,
          height: null,
        },
      };
    });

    it('Should set the component.drawOption width and height', () => {
      drawer.storeComponentSize(0, component);
      expect(drawer.getComponentSize).toBeCalledWith(0);
      expect(component.drawOption.width).toEqual(1);
      expect(component.drawOption.height).toEqual(2);
    });
  });

  describe('Test method: getComponentSize', () => {
    let drawer;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      drawer.d3 = {
        select: jest.fn(() => drawer.d3),
        node: jest.fn(() => drawer.d3),
        getBBox: jest.fn().mockReturnValue({ width: 1, height: 2 }),
      };
    });

    it('Should return object contains not null width and height', () => {
      const { width, height } = drawer.getComponentSize();
      expect(width).toEqual(1);
      expect(height).toEqual(2);
      expect(drawer.d3.select).toBeCalled();
      expect(drawer.d3.node).toBeCalled();
      expect(drawer.d3.getBBox).toBeCalled();
    });
  });

  describe('Test method: drawDefaultModel', () => {
    let drawer;
    let svgContainer;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      svgContainer = {
        attr: jest.fn(() => svgContainer),
        select: jest.fn(() => svgContainer),
        text: jest.fn(() => svgContainer),
      };
    });

    it('drawDefaultModel should setup default svgContainer', () => {
      drawer.drawDefaultModel(svgContainer);

      expect(svgContainer.attr).toBeCalledTimes(4);
      expect(svgContainer.attr.mock.calls[0][0]).toBe('id');
      expect(svgContainer.attr.mock.calls[1][0]).toBe('x');
      expect(svgContainer.attr.mock.calls[2][0]).toBe('y');
      expect(svgContainer.attr.mock.calls[3][0]).toBe('cursor');

      expect(svgContainer.select).toBeCalledTimes(2);
      expect(svgContainer.text).toBeCalledTimes(2);
      expect(svgContainer.select.mock.calls).toEqual([['.component-name'], ['.component-type']]);
    });
  });

  describe('Test method: moveComponent()', () => {
    let drawer;
    let svgContainer;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      svgContainer = {
        each: jest.fn(() => svgContainer)
          .mockImplementation((arg) => arg(null, 0, [])),
      };
      drawer.d3 = {
        attr: jest.fn(() => drawer.d3),
        select: jest.fn(() => drawer.d3),
        call: jest.fn(() => drawer.d3),
        drag: jest.fn(() => drawer.d3),
        on: jest.fn((name, callback) => {
          callback({ x: 0, y: 0, subject: { id: 1, drawOption: { x: 0, y: 0 } } });
          return drawer.d3;
        }),
      };
    });

    it('Should call every d3 methods', () => {
      drawer.moveComponent(svgContainer);

      expect(drawer.d3.drag).toBeCalled();
      expect(svgContainer.each).toBeCalledTimes(1);
      expect(drawer.d3.select).toBeCalledTimes(3);
      expect(drawer.d3.call).toBeCalled();

      expect(drawer.d3.on).toBeCalledTimes(3);
      expect(drawer.d3.on.mock.calls[0][0]).toBe('start');
      expect(drawer.d3.on.mock.calls[1][0]).toBe('drag');
      expect(drawer.d3.on.mock.calls[2][0]).toBe('end');

      expect(drawer.d3.attr).toBeCalledTimes(9);
      expect(drawer.d3.attr.mock.calls[0][0]).toBe('xlink:href');
      expect(drawer.d3.attr.mock.calls[1][0]).toBe('x');
      expect(drawer.d3.attr.mock.calls[2][0]).toBe('y');
      expect(drawer.d3.attr.mock.calls[3][0]).toBe('cursor');
      expect(drawer.d3.attr.mock.calls[4][0]).toBe('x');
      expect(drawer.d3.attr.mock.calls[5][0]).toBe('y');
      expect(drawer.d3.attr.mock.calls[6][0]).toBe('cursor');
      expect(drawer.d3.attr.mock.calls[7][0]).toBe('x');
      expect(drawer.d3.attr.mock.calls[8][0]).toBe('y');
    });
  });
});
