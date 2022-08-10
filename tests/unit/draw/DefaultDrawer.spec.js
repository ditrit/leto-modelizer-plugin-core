import DefaultDrawer from 'src/draw/DefaultDrawer';
import ComponentDrawOption from 'src/models/ComponentDrawOption';
import mockD3 from 'tests/mock/D3Mock';

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
      drawer.d3 = mockD3(jest);
      drawer.initializeComponents = jest.fn();
      drawer.drawDefaultModel = jest.fn();
    });

    it('Draw should call the internal methods', () => {
      drawer.drawCustomModel = jest.fn();
      drawer.draw('', [{
        definition: { svgTemplate: 'DefaultModel' },
      }, {
        definition: { svgTemplate: null },
      }, {
        definition: { svgTemplate: 'CustomModel' },
      }, {
        definition: { svgTemplate: 'bad' },
      }]);

      expect(drawer.initializeComponents).toBeCalled();
      expect(drawer.drawDefaultModel).toBeCalledTimes(3);
      expect(drawer.drawCustomModel).toBeCalled();
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
      drawer.d3 = mockD3(jest);
      drawer.d3.getBBox = jest.fn().mockReturnValue({ width: 1, height: 2 });
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
      svgContainer = mockD3(jest);
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

  describe('Test method: setViewPortAction', () => {
    let drawer;
    let actionCallBack;

    beforeEach(() => {
      actionCallBack = {};
      drawer = new DefaultDrawer();
      drawer.__unselectComponent = jest.fn();
      drawer.d3 = mockD3(jest);
      drawer.d3.on = jest.fn((name, callback) => {
        actionCallBack[name] = callback;
        return drawer.d3;
      });
    });

    it('Viewport click should call unselect component action', () => {
      drawer.setViewPortAction(drawer.d3);
      expect(Object.keys(actionCallBack).length).toEqual(1);
      expect(actionCallBack.mousedown).not.toBeNull();

      actionCallBack.mousedown();
      expect(drawer.__unselectComponent).toBeCalled();
    });
  });

  describe('Test method: setComponentAction', () => {
    let drawer;
    let actionCallBack;

    beforeEach(() => {
      actionCallBack = {};
      drawer = new DefaultDrawer();
      drawer.__dragStart = jest.fn();
      drawer.__dragPending = jest.fn();
      drawer.__dragEnd = jest.fn();
      drawer.__selectComponent = jest.fn();
      drawer.__toggleComponentSelection = jest.fn();
      drawer.d3 = mockD3(jest);
      drawer.d3.on = jest.fn((name, callback) => {
        actionCallBack[name] = callback;
        return drawer.d3;
      });
    });

    it('Should setup 3 events', () => {
      drawer.setComponentAction({});

      expect(drawer.d3.select).toBeCalled();
      expect(drawer.d3.call).toBeCalled();
      expect(drawer.d3.on).toBeCalledTimes(3);
      expect(Object.keys(actionCallBack).length).toEqual(3);
    });

    it('Event drag start should call dragStart method', () => {
      drawer.setComponentAction({});
      actionCallBack.start();
      expect(drawer.__dragStart).toBeCalled();
      expect(drawer.__dragPending).not.toBeCalled();
      expect(drawer.__dragEnd).not.toBeCalled();
      expect(drawer.__selectComponent).not.toBeCalled();
      expect(drawer.__toggleComponentSelection).not.toBeCalled();
    });

    it('Event drag pending should call dragPending and selectComponent methods', () => {
      drawer.setComponentAction({});
      actionCallBack.drag();
      expect(drawer.__dragPending).toBeCalled();
      expect(drawer.__selectComponent).toBeCalled();
      expect(drawer.__dragStart).not.toBeCalled();
      expect(drawer.__dragEnd).not.toBeCalled();
      expect(drawer.__toggleComponentSelection).not.toBeCalled();
    });

    it('Event drag end with drag action should call dragEnd method', () => {
      drawer.actions.drag.state = true;
      drawer.setComponentAction({});
      actionCallBack.end({ subject: { id: 1 } });
      expect(drawer.__dragEnd).toBeCalled();
      expect(drawer.__dragStart).not.toBeCalled();
      expect(drawer.__dragPending).not.toBeCalled();
      expect(drawer.__selectComponent).not.toBeCalled();
      expect(drawer.__toggleComponentSelection).not.toBeCalled();
    });

    it('Event drag end without drag action should call dragEnd and toggleComponentSelection method', () => {
      drawer.actions.drag.state = false;
      drawer.setComponentAction({});
      actionCallBack.end({ subject: { id: 1 } });
      expect(drawer.__dragEnd).toBeCalled();
      expect(drawer.__toggleComponentSelection).toBeCalled();
      expect(drawer.__dragStart).not.toBeCalled();
      expect(drawer.__dragPending).not.toBeCalled();
      expect(drawer.__selectComponent).not.toBeCalled();
    });
  });

  describe('Test actions', () => {
    let drawer;
    let component;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      drawer.d3 = mockD3(jest);
      component = {
        id: 1,
        drawOption: {
          x: null,
          y: null,
        },
      };
    });

    it('Test action: __dragStart', () => {
      drawer.actions.drag.state = null;
      drawer.actions.drag.deltaX = null;
      drawer.actions.drag.deltaY = null;
      drawer.__dragStart(
        { x: 2, y: 3 },
        component,
        {
          attr() {
            return 1;
          },
        },
      );
      expect(drawer.actions.drag.state).toBeFalsy();
      expect(drawer.actions.drag.deltaX).toEqual(1);
      expect(drawer.actions.drag.deltaY).toEqual(2);
      expect(drawer.d3.select).toBeCalled();
      expect(drawer.d3.attr).toBeCalled();
    });

    it('Test action: __dragPending', () => {
      drawer.actions.drag.state = null;
      drawer.actions.drag.deltaX = 1;
      drawer.actions.drag.deltaY = 2;
      const element = mockD3(jest);
      drawer.__dragPending(
        { x: 5, y: 4 },
        component,
        element,
      );
      expect(drawer.actions.drag.state).toBeTruthy();
      expect(component.drawOption.x).toEqual(4);
      expect(component.drawOption.y).toEqual(2);
      expect(element.attr).toBeCalledTimes(2);
    });

    it('Test action: __dragEnd', () => {
      drawer.actions.drag.state = null;
      drawer.actions.drag.deltaX = null;
      drawer.actions.drag.deltaY = null;
      const element = mockD3(jest);
      drawer.__dragEnd(
        element,
      );
      expect(drawer.actions.drag.state).toBeFalsy();
      expect(drawer.actions.drag.deltaX).toEqual(0);
      expect(drawer.actions.drag.deltaY).toEqual(0);
      expect(element.attr).toBeCalled();
    });

    describe('Test action: __unselectComponent', () => {
      it('On no selected component should do nothing', () => {
        drawer.actions.selection.current = null;
        drawer.__unselectComponent();

        expect(drawer.actions.selection.current).toBeNull();
        expect(drawer.d3.select).not.toBeCalled();
        expect(drawer.d3.style).not.toBeCalled();
      });

      it('On selected component should unselect it', () => {
        drawer.actions.selection.current = 'id1';
        drawer.__unselectComponent();

        expect(drawer.actions.selection.current).toBeNull();
        expect(drawer.d3.select).toBeCalled();
        expect(drawer.d3.style).toBeCalled();
      });
    });

    it('Test action: __selectComponent', () => {
      drawer.actions.selection.current = null;
      drawer.__unselectComponent = jest.fn();

      drawer.__selectComponent('id1');

      expect(drawer.actions.selection.current).toEqual('id1');
      expect(drawer.__unselectComponent).toBeCalled();
      expect(drawer.d3.select).toBeCalled();
      expect(drawer.d3.style).toBeCalledTimes(2);
    });

    describe('Test action: __toggleComponentSelection', () => {
      it('Toggle selection should unselect the same id', () => {
        drawer.actions.selection.current = 'id1';
        drawer.__selectComponent = jest.fn();
        drawer.__unselectComponent = jest.fn();

        drawer.__toggleComponentSelection('id1');

        expect(drawer.__selectComponent).not.toBeCalled();
        expect(drawer.__unselectComponent).toBeCalled();
      });

      it('Toggle selection should select another id', () => {
        drawer.actions.selection.current = 'id1';
        drawer.__selectComponent = jest.fn();
        drawer.__unselectComponent = jest.fn();

        drawer.__toggleComponentSelection('id2');

        expect(drawer.__selectComponent).toBeCalled();
        expect(drawer.__unselectComponent).not.toBeCalled();
      });
    });
  });
});
