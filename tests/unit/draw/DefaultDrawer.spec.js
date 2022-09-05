import DefaultDrawer from 'src/draw/DefaultDrawer';
import ComponentDrawOption from 'src/models/ComponentDrawOption';
import mockD3 from 'tests/mock/D3Mock';

describe('Test Class: DefaultDrawer()', () => {
  describe('Test instanciate', () => {
    it('Test default constructor', () => {
      const drawer = new DefaultDrawer();
      expect(drawer.resources).toBeNull();
      expect(drawer.rootId).toEqual('root');
      expect(drawer.d3).not.toBeNull();
    });

    it('Test passing value in constructor', () => {
      const drawer = new DefaultDrawer('resources', 'rootId');
      expect(drawer.resources).toEqual('resources');
      expect(drawer.rootId).toEqual('rootId');
      expect(drawer.d3).not.toBeNull();
      expect(drawer.margin).toEqual(6);
      expect(drawer.actions).not.toBeNull();
    });
  });

  describe('Test method: draw', () => {
    let drawer;
    let actionCallBack;

    beforeEach(() => {
      actionCallBack = { data: [], attr: [], html: [] };
      drawer = new DefaultDrawer();
      drawer.d3 = mockD3(jest);
      drawer.resources = { models: { test0: 'testModel0', test1: 'testModel1' }, icons: { test: 'testIcon' } };
      drawer.initializeComponents = jest.fn();
      drawer.setViewPortAction = jest.fn();
      drawer.setComponentAction = jest.fn();
      drawer.d3.data = jest.fn((components, data) => {
        actionCallBack.data.push({ data });
        return drawer.d3;
      });
      drawer.d3.attr = jest.fn((name, callback) => {
        actionCallBack.attr.push({ name, callback });
        return drawer.d3;
      });
      drawer.d3.html = jest.fn((callback) => {
        actionCallBack.html.push({ callback });
        return drawer.d3;
      });
    });

    it('Call draw method without components', () => {
      drawer.draw();

      expect(drawer.d3.select).toBeCalledTimes(2);
      expect(drawer.d3.selectAll).toBeCalledTimes(1);
      expect(drawer.d3.data).toBeCalledTimes(1);
      expect(actionCallBack.data[0].data({ id: 'id' })).toEqual('id');
      expect(drawer.initializeComponents).toBeCalledTimes(1);
      expect(drawer.setViewPortAction).toBeCalledTimes(1);
      expect(drawer.setComponentAction).not.toBeCalled();
    });

    it('Draw should call the internal methods', () => {
      drawer.drawCustomModel = jest.fn();
      drawer.draw([{
        children: [],
        definition: { model: 'DefaultModel' },
      }, {
        children: [],
        definition: { model: null },
      }, {
        children: [],
        definition: { model: 'CustomModel' },
      }, {
        children: [{
          children: [],
          definition: { model: 'CustomModel' },
        }],
        definition: { model: 'bad' },
      }], 'parent');

      expect(drawer.d3.select).toBeCalledTimes(7);
      expect(drawer.d3.selectAll).toBeCalledTimes(7);
      expect(drawer.d3.data).toBeCalledTimes(2);
      expect(actionCallBack.data[0].data({ id: 'id0' })).toEqual('id0');
      expect(actionCallBack.data[1].data({ id: 'id1' })).toEqual('id1');
      expect(drawer.initializeComponents).toBeCalledTimes(2);
      expect(drawer.setViewPortAction).toBeCalledTimes(2);
      expect(drawer.setComponentAction).toBeCalledTimes(5);

      expect(drawer.d3.attr).toBeCalledTimes(4);
      expect(actionCallBack.attr[0].name).toEqual('id');
      expect(actionCallBack.attr[0].callback({ id: 'idTest0' })).toEqual('idTest0');
      expect(actionCallBack.attr[1].name).toEqual('class');
      expect(actionCallBack.attr[1].callback({ definition: { model: 'test0' } })).toEqual('parent component component-test0');
      expect(actionCallBack.attr[2].name).toEqual('id');
      expect(actionCallBack.attr[2].callback({ id: 'idTest1' })).toEqual('idTest1');
      expect(actionCallBack.attr[3].name).toEqual('class');
      expect(actionCallBack.attr[3].callback({ definition: { model: 'test1' } })).toEqual('root component component-test1');

      expect(drawer.d3.html).toBeCalledTimes(3);
      expect(actionCallBack.html[0].callback({ definition: { model: 'test0' } })).toEqual('testModel0');
      expect(actionCallBack.html[1].callback({ definition: { icon: 'test' } })).toEqual('testIcon');
      expect(actionCallBack.html[2].callback({ definition: { model: 'test1' } })).toEqual('testModel1');
    });
  });

  describe('Test method: initializeComponents', () => {
    let drawer;
    let d3Element;
    let components;
    let component00;
    let component01;
    let component02;
    let actionCallBack;
    beforeEach(() => {
      actionCallBack = { attr: [], html: {} };
      drawer = new DefaultDrawer();
      drawer.d3 = mockD3(jest);
      d3Element = mockD3(jest);
      drawer.pack = jest.fn().mockReturnValue({
        width: 1,
        height: 1,
        items: [
          { item: { id: 'a' }, x: 1, y: 2 },
          { item: { id: 'b' }, x: 3, y: 4 },
          { item: { id: 'c' }, x: 5, y: 6 },
        ],
      });
      d3Element.drawOption = {
        x: 1,
        y: 2,
        width: 3,
        height: 4,
      };
      component00 = { id: 'a', drawOption: null };
      component01 = { id: 'b', drawOption: null };
      component02 = {
        id: 'c',
        drawOption: {
          x: 1,
          y: 2,
          width: 0,
          height: 0,
        },
      };
      components = [component00, component01, component02];
      d3Element.attr = jest.fn((name, callback) => {
        actionCallBack.attr.push({ name, callback });
        return d3Element;
      });
    });

    it('Should call every internal methods and set a drawOption if null', () => {
      drawer.initializeComponents(d3Element, components, 'parentId');

      expect(components[0].drawOption).not.toBeNull();
      expect(components[0].drawOption.x).toEqual(7);
      expect(components[0].drawOption.y).toEqual(8);

      expect(components[1].drawOption).not.toBeNull();
      expect(components[1].drawOption.x).toEqual(9);
      expect(components[1].drawOption.y).toEqual(10);

      expect(components[2].drawOption).not.toBeNull();
      expect(components[2].drawOption.x).toEqual(1);
      expect(components[2].drawOption.y).toEqual(2);

      expect(d3Element.attr).toBeCalledTimes(6);
      expect(actionCallBack.attr[0].name).toEqual('x');
      expect(actionCallBack.attr[0].callback({ drawOption: { x: 1 } })).toEqual(1);
      expect(actionCallBack.attr[1].name).toEqual('y');
      expect(actionCallBack.attr[1].callback({ drawOption: { y: 2 } })).toEqual(2);
      expect(actionCallBack.attr[2].name).toEqual('width');
      expect(actionCallBack.attr[2].callback({ drawOption: { width: 3 } })).toEqual(3);
      expect(actionCallBack.attr[3].name).toEqual('height');
      expect(actionCallBack.attr[3].callback({ drawOption: { height: 4 } })).toEqual(4);
      expect(actionCallBack.attr[4].name).toEqual('width');
      expect(actionCallBack.attr[4].callback).toEqual('100%');
      expect(actionCallBack.attr[5].name).toEqual('height');
      expect(actionCallBack.attr[5].callback).toEqual('100%');

      expect(d3Element.select).toBeCalledTimes(1);
      expect(d3Element.select.mock.calls[0][0]).toBe('.template');
    });
  });

  describe('Test method: setContainerSize', () => {
    let drawer;
    let d3Element;
    let components;
    let component00;
    let component01;
    let component02;
    beforeEach(() => {
      drawer = new DefaultDrawer();
      drawer.d3 = mockD3(jest);
      d3Element = mockD3(jest);
      drawer.pack = jest.fn().mockReturnValue({
        width: 1,
        height: 1,
        items: [
          { item: { id: 'a' }, x: 1, y: 2 },
          { item: { id: 'b' }, x: 3, y: 4 },
          { item: { id: 'c' }, x: 5, y: 6 },
        ],
      });
      d3Element.drawOption = {
        x: 1,
        y: 2,
        width: 3,
        height: 4,
      };
      component00 = { id: 'a', drawOption: { width: 1, height: 1 } };
      component01 = { id: 'b', drawOption: { width: 1, height: 1 } };
      component02 = { id: 'c', drawOption: { width: 1, height: 1 } };
      components = [component00, component01, component02];
    });

    it('Should call d3 methods to setup containers, parentId equal rootId ', () => {
      drawer.setContainerSize(components, 'root');
      expect(drawer.d3.attr).not.toBeCalled();
    });

    it('Should call d3 methods to setup containers sizes', () => {
      drawer.setContainerSize(components, 'parentId');

      expect(drawer.d3.attr).toBeCalledTimes(5);
      expect(drawer.d3.attr.mock.calls[0][0]).toBe('y');
      expect(drawer.d3.attr.mock.calls[1][0]).toBe('width');
      expect(drawer.d3.attr.mock.calls[2][0]).toBe('height');
      expect(drawer.d3.attr.mock.calls[3][0]).toBe('width');
      expect(drawer.d3.attr.mock.calls[4][0]).toBe('height');
    });
  });

  describe('Test method: setComponentPosition', () => {
    let drawer;
    let positions;
    let component01;
    let component02;
    let component03;
    let components;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      positions = [
        { item: { id: 'a' }, x: 1, y: 2 },
        { item: { id: 'b' }, x: 3, y: 4 },
        { item: { id: 'c' }, x: 5, y: 6 },
      ];
      component01 = {
        id: 'a',
        drawOption: new ComponentDrawOption({
          x: 1,
          y: 1,
          width: 1,
          height: 1,
        }),
      };
      component02 = {
        id: 'b',
        drawOption: new ComponentDrawOption({
          x: 1,
          y: 1,
          width: 1,
          height: 1,
        }),
      };
      component03 = {
        id: 'c',
        drawOption: new ComponentDrawOption({
          x: 1,
          y: 1,
          width: 1,
          height: 1,
        }),
      };
      components = [component01, component02, component03];
    });

    it('Should set the good positions to components.drawOption', () => {
      drawer.setComponentPosition(components, positions);

      expect(components[0].drawOption.x).toEqual(7);
      expect(components[0].drawOption.y).toEqual(8);
      expect(components[1].drawOption.x).toEqual(9);
      expect(components[1].drawOption.y).toEqual(10);
      expect(components[2].drawOption.x).toEqual(11);
      expect(components[2].drawOption.y).toEqual(12);
    });
  });

  describe('Test method: storeComponentSize', () => {
    let drawer;
    let components;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      drawer.getComponentSize = jest.fn().mockReturnValue({ width: 1, height: 2 });
      components = [{
        drawOption: {
          width: null,
          height: null,
        },
      }];
    });

    it('Should set the component.drawOption width and height', () => {
      drawer.storeComponentSize(components);
      expect(drawer.getComponentSize).toBeCalled();
      expect(components[0].drawOption.width).toEqual(1);
      expect(components[0].drawOption.height).toEqual(2);
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
      drawer = new DefaultDrawer({ icons: { DefaultIcon: 'test' } }, 'root');
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

      expect(d3Element.select).toBeCalledTimes(3);
      expect(d3Element.select.mock.calls[0][0]).toBe('.component-name');
      expect(d3Element.select.mock.calls[1][0]).toBe('.component-type');
      expect(d3Element.select.mock.calls[2][0]).toBe('.component-icon');

      expect(d3Element.html).toBeCalledTimes(1);
      expect(d3Element.text).toBeCalledTimes(2);
      expect(actionCallBack.text[0]({ name: 'test-name' })).toEqual('test-name');
      expect(actionCallBack.text[1]({ definition: { type: 'test-type' } })).toEqual('test-type');

      expect(actionCallBack.html({ definition: { icon: 'DefaultIcon' } })).toEqual('test');
    });
  });

  describe('Test method: drawDefaultContainer', () => {
    let drawer;
    let d3Element;
    let actionCallBack;

    beforeEach(() => {
      actionCallBack = { attr: {}, html: {}, text: [] };
      drawer = new DefaultDrawer({ icons: { DefaultIcon: 'test' } }, 'root');
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
      drawer.drawDefaultContainer(d3Element);

      expect(d3Element.select).toBeCalledTimes(3);
      expect(d3Element.select.mock.calls[0][0]).toBe('.component-name');
      expect(d3Element.select.mock.calls[1][0]).toBe('.component-type');
      expect(d3Element.select.mock.calls[2][0]).toBe('.component-icon');

      expect(d3Element.html).toBeCalledTimes(1);
      expect(d3Element.text).toBeCalledTimes(2);
      expect(actionCallBack.text[0]({ name: 'test-name' })).toEqual('test-name');
      expect(actionCallBack.text[1]({ definition: { type: 'test-type' } })).toEqual('test-type');

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
