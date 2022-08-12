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
      const drawer = new DefaultDrawer('parentId', 'resources');
      expect(drawer.parentId).toEqual('parentId');
      expect(drawer.resources).toEqual('resources');
      expect(drawer.d3).not.toBeNull();
      expect(drawer.margin).toEqual(10);
      expect(drawer.actions).not.toBeNull();
    });
  });

  describe('Test method: draw', () => {
    let drawer;
    let actionCallBack;

    beforeEach(() => {
      actionCallBack = { data: {} };
      drawer = new DefaultDrawer();
      drawer.d3 = mockD3(jest);
      drawer.initializeComponents = jest.fn();
      drawer.setViewPortAction = jest.fn();
      drawer.setComponentAction = jest.fn();
      drawer.d3.data = jest.fn((components, data) => {
        actionCallBack.data = data;
        return drawer.d3;
      });
    });

    it('Call draw method without components', () => {
      drawer.draw();

      expect(drawer.d3.select).toBeCalledTimes(2);
      expect(drawer.d3.selectAll).toBeCalledTimes(1);
      expect(drawer.d3.data).toBeCalledTimes(1);
      expect(actionCallBack.data({ id: 'id' })).toEqual('id');
      expect(drawer.initializeComponents).toBeCalledTimes(1);
      expect(drawer.setViewPortAction).toBeCalledTimes(1);
      expect(drawer.setComponentAction).not.toBeCalled();
    });

    it('Draw should call the internal methods', () => {
      drawer.drawCustomModel = jest.fn();
      drawer.draw([{
        definition: { model: 'DefaultModel' },
      }, {
        definition: { model: null },
      }, {
        definition: { model: 'CustomModel' },
      }, {
        definition: { model: 'bad' },
      }]);

      expect(drawer.d3.select).toBeCalledTimes(2);
      expect(drawer.d3.selectAll).toBeCalledTimes(1);
      expect(drawer.d3.data).toBeCalledTimes(1);
      expect(actionCallBack.data({ id: 'id' })).toEqual('id');
      expect(drawer.initializeComponents).toBeCalledTimes(1);
      expect(drawer.setViewPortAction).toBeCalledTimes(1);
      expect(drawer.setComponentAction).toBeCalledTimes(4);
    });
  });

  describe('Test method: initializeComponents', () => {
    let drawer;
    let component00;
    let component01;
    let component02;
    let d3Element;
    let actionCallBack;

    beforeEach(() => {
      actionCallBack = { attr: {}, html: {} };
      document.body.innerHTML = '<svg id="viewport"></svg>';
      drawer = new DefaultDrawer('#root', { models: { DefaultModel: 'test' } });
      drawer.storeComponentSize = jest.fn();
      drawer.setComponentPosition = jest.fn();
      component00 = { drawOption: { width: 10, height: 10 }, definition: { model: 'DefaultModel' } };
      component01 = { drawOption: null, definition: { model: 'template' } };
      component02 = { drawOption: new ComponentDrawOption(), definition: { model: 'template' } };
      d3Element = mockD3(jest);
      drawer.d3 = mockD3(jest);
      d3Element.each = jest.fn((callback) => {
        actionCallBack.each = callback;
        return d3Element;
      });
      d3Element.attr = jest.fn((name, callback) => {
        actionCallBack.attr[name] = callback;
        return d3Element;
      });
      d3Element.html = jest.fn((callback) => {
        actionCallBack.html = callback;
        return d3Element;
      });
    });

    it('Should call every internal methods and set a drawOption if null', () => {
      drawer.storeComponentSize.mockImplementation((list, component) => {
        component.drawOption.width = 10;
        component.drawOption.height = 10;
      });
      drawer.initializeComponents([component00, component01], d3Element);
      actionCallBack.each(null, 0, [0]);
      actionCallBack.each(null, 1, [0]);

      expect(d3Element.enter).toBeCalledTimes(1);
      expect(d3Element.append).toBeCalledTimes(1);
      expect(d3Element.append.mock.calls[0][0]).toBe('svg');
      expect(d3Element.exit).toBeCalledTimes(1);
      expect(d3Element.remove).toBeCalledTimes(1);

      expect(actionCallBack.attr.id({ id: 'id' })).toEqual('id');
      expect(actionCallBack.attr.class({ definition: { model: 'DefaultModel' } }))
        .toEqual('component component-DefaultModel');
      expect(actionCallBack.html({ definition: { model: 'DefaultModel' } }))
        .toEqual('test');

      expect(d3Element.each).toBeCalledTimes(1);

      expect(component01.drawOption).not.toEqual(null);

      expect(d3Element.attr).toBeCalled();
      expect(d3Element.html).toBeCalled();

      expect(drawer.storeComponentSize).toBeCalled();
      expect(drawer.setComponentPosition).toBeCalled();
    });

    it('Should not call setComponentPosition method', () => {
      drawer.storeComponentSize.mockImplementation((list, component) => {
        component.drawOption.width = 1;
        component.drawOption.height = 1;
      });
      drawer.initializeComponents([component02], d3Element);
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
    let d3Element;
    let actionCallBack;

    beforeEach(() => {
      actionCallBack = { attr: {}, html: {}, text: [] };
      drawer = new DefaultDrawer('#root', { icons: { DefaultIcon: 'test' } });
      d3Element = mockD3(jest);
      d3Element.attr = jest.fn((name, callback) => {
        actionCallBack.attr[name] = callback;
        return d3Element;
      });
      d3Element.text = jest.fn((callback) => {
        actionCallBack.text.push(callback);
        return d3Element;
      });
      d3Element.html = jest.fn((callback) => {
        actionCallBack.html = callback;
        return d3Element;
      });
    });

    it('drawDefaultModel should setup default d3Element', () => {
      drawer.drawDefaultModel(d3Element);

      expect(d3Element.attr).toBeCalledTimes(3);
      expect(d3Element.attr.mock.calls[0][0]).toBe('x');
      expect(d3Element.attr.mock.calls[1][0]).toBe('y');
      expect(d3Element.attr.mock.calls[2][0]).toBe('cursor');

      expect(d3Element.select).toBeCalledTimes(3);
      expect(d3Element.select.mock.calls[0][0]).toBe('.component-name');
      expect(d3Element.select.mock.calls[1][0]).toBe('.component-type');
      expect(d3Element.select.mock.calls[2][0]).toBe('.component-icon');

      expect(d3Element.html).toBeCalledTimes(1);
      expect(d3Element.text).toBeCalledTimes(2);
      expect(actionCallBack.text[0]({ name: 'test-name' })).toEqual('test-name');
      expect(actionCallBack.text[1]({ definition: { type: 'test-type' } })).toEqual('test-type');

      expect(actionCallBack.attr.x({ drawOption: { x: 1 } })).toEqual(1);
      expect(actionCallBack.attr.y({ drawOption: { y: 1 } })).toEqual(1);
      expect(actionCallBack.html({ definition: { icon: 'DefaultIcon' } })).toEqual('test');
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
