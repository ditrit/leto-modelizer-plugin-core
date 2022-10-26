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
      expect(drawer.events).toEqual({
        SelectEvent: null,
        EditEvent: null,
        DeleteEvent: null,
      });
    });

    it('Test passing value in constructor', () => {
      let drawer = new DefaultDrawer('resources', 'rootId', {});
      expect(drawer.resources).toEqual('resources');
      expect(drawer.rootId).toEqual('rootId');
      expect(drawer.d3).not.toBeNull();
      expect(drawer.margin).toEqual(6);
      expect(drawer.actions).not.toBeNull();
      expect(drawer.events).toEqual({
        SelectEvent: null,
        EditEvent: null,
        DeleteEvent: null,
      });

      drawer = new DefaultDrawer('resources', 'rootId', {
        SelectEvent: 1,
        EditEvent: 2,
        DeleteEvent: 3,
      });
      expect(drawer.events).toEqual({
        SelectEvent: 1,
        EditEvent: 2,
        DeleteEvent: 3,
      });
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
      drawer.setSelectionAction = jest.fn();
      drawer.initializeActionMenu = jest.fn();
      drawer.__drawModels = jest.fn();
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

      expect(drawer.d3.select).toBeCalledTimes(3);
      expect(drawer.d3.selectAll).toBeCalledTimes(2);
      expect(drawer.d3.data).toBeCalledTimes(1);
      expect(actionCallBack.data[0].data({ id: 'id' })).toEqual('id');
      expect(drawer.initializeComponents).toBeCalledTimes(1);
      expect(drawer.setViewPortAction).toBeCalledTimes(1);
      expect(drawer.setComponentAction).toBeCalledTimes(1);
      expect(drawer.setSelectionAction).not.toBeCalled();
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

      expect(drawer.d3.select).toBeCalledTimes(4);
      expect(drawer.d3.selectAll).toBeCalledTimes(4);
      expect(drawer.d3.data).toBeCalledTimes(2);
      expect(actionCallBack.data[0].data({ id: 'id0' })).toEqual('id0');
      expect(actionCallBack.data[1].data({ id: 'id1' })).toEqual('id1');
      expect(drawer.initializeComponents).toBeCalledTimes(2);
      expect(drawer.setSelectionAction).toBeCalledTimes(5);
      expect(drawer.initializeActionMenu).toBeCalledTimes(2);
      expect(drawer.__drawModels).toBeCalledTimes(2);

      expect(drawer.d3.attr).toBeCalledTimes(8);
      expect(actionCallBack.attr[0].name)
        .toEqual('id');
      expect(actionCallBack.attr[0].callback({ id: 'idTest0' })).toEqual('idTest0');
      expect(actionCallBack.attr[1].name).toEqual('class');
      expect(actionCallBack.attr[1].callback({ definition: { model: 'test0', type: 'type0' } }))
        .toEqual('parent type0 component component-test0 ');
      expect(actionCallBack.attr[2].name).toEqual('id');
      expect(actionCallBack.attr[2].callback({ id: 'idTest1' })).toEqual('idTest1');
      expect(actionCallBack.attr[3].name).toEqual('class');
      expect(actionCallBack.attr[4].name).toEqual('x');
      expect(actionCallBack.attr[4].callback({ drawOption: { x: 1 } })).toEqual(1);
      expect(actionCallBack.attr[5].name).toEqual('y');
      expect(actionCallBack.attr[5].callback({ drawOption: { y: 2 } })).toEqual(2);
      expect(actionCallBack.attr[6].name).toEqual('x');
      expect(actionCallBack.attr[6].callback({ drawOption: { x: 3 } })).toEqual(3);
      expect(actionCallBack.attr[7].name).toEqual('y');
      expect(actionCallBack.attr[7].callback({ drawOption: { y: 4 } })).toEqual(4);

      expect(drawer.d3.html).toBeCalledTimes(2);
      expect(actionCallBack.html[0].callback({ definition: { model: 'test0' } })).toEqual('testModel0');
      expect(actionCallBack.html[1].callback({ definition: { model: 'test1' } })).toEqual('testModel1');
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
      drawer.d3.datum.mockReturnValue({ children: [] });
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

  describe('Test method: setComponentAction', () => {
    const drawer = new DefaultDrawer();
    drawer.__drag = jest.fn();
    drawer.__dropToRoot = jest.fn();
    drawer.__dropToContainer = jest.fn();
    const components = [
      {
        definition: {
          childrenTypes: [],
          isContainer: false,
        },
      },
      {
        definition: {
          childrenTypes: ['type0', 'type1'],
          isContainer: true,
        },
      },
    ];

    it('Should call inner function', () => {
      drawer.setComponentAction(components);
      expect(drawer.__drag).toBeCalled();
      expect(drawer.__dropToRoot).toBeCalled();
      expect(drawer.__dropToContainer).toBeCalled();
    });
  });

  describe('Test method: __drag', () => {
    const drawer = new DefaultDrawer();
    drawer.interact = jest.fn().mockReturnValue({
      unset: jest.fn(),
      draggable: jest.fn(),
    });

    it('Should call all interact methods', () => {
      drawer.__drag();
      expect(drawer.interact).toBeCalledTimes(2);
      expect(drawer.interact().unset).toBeCalled();
      expect(drawer.interact().draggable).toBeCalled();
    });
  });

  describe('Test method: __dropToRoot', () => {
    const drawer = new DefaultDrawer();
    drawer.interact = jest.fn().mockReturnValue({
      unset: jest.fn(),
      dropzone: jest.fn(),
    });
    it('Should call all interact methods', () => {
      drawer.__dropToRoot();
      expect(drawer.interact).toBeCalledTimes(2);
      expect(drawer.interact().unset).toBeCalled();
      expect(drawer.interact().dropzone).toBeCalled();
    });
  });

  describe('Test method: __dropToContainer', () => {
    const drawer = new DefaultDrawer();
    drawer.interact = jest.fn().mockReturnValue({
      unset: jest.fn(),
      dropzone: jest.fn(),
    });
    const component0 = {
      definition: {
        childrenTypes: [],
        isContainer: false,
      },
    };
    const component1 = {
      definition: {
        childrenTypes: ['type0', 'type1'],
        isContainer: true,
      },
    };
    it('Should not call interact methods', () => {
      drawer.__dropToContainer([], component0);
      expect(drawer.interact).toBeCalledTimes(2);
    });

    it('Should call all interact methods', () => {
      drawer.__dropToContainer([], component1);
      expect(drawer.interact).toBeCalledTimes(4);
      expect(drawer.interact().unset).toBeCalled();
      expect(drawer.interact().dropzone).toBeCalled();
    });
  });

  describe('Test method: __getChildrenContainer', () => {
    const drawer = new DefaultDrawer();
    const children = [
      {
        id: 'test0',
        definition: { isContainer: true },
        children: [{
          id: 'test1',
          definition: { isContainer: true },
          children: [],
        }],
      },
      { id: 'test2', definition: { isContainer: false }, children: [] },
      { id: 'test3', definition: { isContainer: true }, children: [] },
    ];
    const array = [];

    it('Should get id of container components', () => {
      drawer.__getChildrenContainer(children, array);
      expect(array.length).toEqual(3);
      expect(array[0]).toEqual('test0');
      expect(array[1]).toEqual('test1');
      expect(array[2]).toEqual('test3');
    });
  });

  describe('Test method: __resetDrawOption', () => {
    const drawer = new DefaultDrawer();
    drawer.d3 = mockD3(jest);
    const currentComponent = {
      datum: jest.fn().mockReturnValue({ drawOption: 'not null' }),
    };
    drawer.draw = jest.fn();

    it('Should reset drawOption', () => {
      drawer.__resetDrawOption([], currentComponent);
      expect(drawer.d3.each).toBeCalledTimes(1);
      expect(currentComponent.datum).toBeCalledTimes(1);
      expect(currentComponent.datum().drawOption).toBeNull();
      expect(drawer.draw).toBeCalledTimes(1);
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
      drawer.d3.datum.mockReturnValue({ children: [] });
    });

    it('Should call d3 methods to setup containers, parentId equal rootId ', () => {
      drawer.setContainerSize(components, 'root');
      expect(drawer.d3.attr).not.toBeCalled();
    });

    it('Should call d3 methods to setup containers sizes', () => {
      drawer.setContainerSize(components, 'parentId');

      expect(drawer.d3.attr).toBeCalledTimes(7);
      expect(drawer.d3.attr.mock.calls[0][0]).toBe('y');
      expect(drawer.d3.attr.mock.calls[1][0]).toBe('width');
      expect(drawer.d3.attr.mock.calls[2][0]).toBe('height');
      expect(drawer.d3.attr.mock.calls[3][0]).toBe('width');
      expect(drawer.d3.attr.mock.calls[4][0]).toBe('height');
      expect(drawer.d3.attr.mock.calls[5][0]).toBe('width');
      expect(drawer.d3.attr.mock.calls[6][0]).toBe('height');
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

  describe('Test method: setSelectionAction', () => {
    let drawer;
    let actionCallBack;

    beforeEach(() => {
      actionCallBack = {};
      drawer = new DefaultDrawer();
      drawer.__selectComponent = jest.fn();
      drawer.__toggleComponentSelection = jest.fn();
      drawer.d3 = mockD3(jest);
      drawer.d3.on = jest.fn((name, callback) => {
        actionCallBack[name] = callback;
        return drawer.d3;
      });
    });

    it('Should setup 3 events', () => {
      drawer.setSelectionAction({});

      expect(drawer.d3.select).toBeCalled();
      expect(drawer.d3.call).toBeCalled();
      expect(drawer.d3.on).toBeCalledTimes(3);
      expect(Object.keys(actionCallBack).length).toEqual(3);
    });

    it('Selection state when drag start', () => {
      drawer.setSelectionAction({});
      actionCallBack.start();
      expect(drawer.__selectComponent).not.toBeCalled();
      expect(drawer.__toggleComponentSelection).not.toBeCalled();
    });

    it('Selection state when component is on drag', () => {
      drawer.setSelectionAction({});
      actionCallBack.drag(null, { id: 0 });
      expect(drawer.__selectComponent).toBeCalled();
      expect(drawer.__toggleComponentSelection).not.toBeCalled();
    });

    it('Selection state when drag end when drag state is true', () => {
      drawer.actions.drag.state = true;
      drawer.setSelectionAction({});
      actionCallBack.end(null, { id: 1 });
      expect(drawer.__selectComponent).not.toBeCalled();
      expect(drawer.__toggleComponentSelection).not.toBeCalled();
    });

    it('Selection state when drag end when drag state is false', () => {
      drawer.actions.drag.state = false;
      drawer.setSelectionAction({});
      actionCallBack.end(null, { id: 1 });
      expect(drawer.__toggleComponentSelection).toBeCalled();
      expect(drawer.__selectComponent).not.toBeCalled();
    });
  });

  describe('Test method: initializeActionMenu', () => {
    const drawer = new DefaultDrawer();
    drawer.d3 = mockD3(jest);

    it('Should call D3 methods', () => {
      drawer.initializeActionMenu();
      expect(drawer.d3.select).toBeCalledTimes(1);
      expect(drawer.d3.append).toBeCalledTimes(4);
      expect(drawer.d3.attr).toBeCalledTimes(4);
      expect(drawer.d3.html).toBeCalledTimes(3);
      expect(drawer.d3.style).toBeCalledTimes(12);
    });
  });

  describe('Test actions', () => {
    let drawer;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      drawer.d3 = mockD3(jest);
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
      drawer.displayActionMenu = jest.fn();
      drawer.d3.node.mockReturnValue({
        getBoundingClientRect: jest.fn(),
      });
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
