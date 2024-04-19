import DefaultDrawer from 'src/draw/DefaultDrawer';
import DefaultData from 'src/models/DefaultData';
import { expect } from '@jest/globals';

jest.mock('d3', () => {
  const mockD3 = {};

  [
    'append', 'attr', 'call', 'data', 'drag', 'classed',
    'each', 'enter', 'exit', 'getBBox', 'on', 'linkHorizontal',
    'remove', 'select', 'selectAll', 'style', 'select',
    'text', 'node', 'html', 'transition', 'duration', 'datum',
    'source', 'target', 'join', 'empty', 'hierarchy', 'filter',
  ].forEach((method) => {
    mockD3[method] = jest.fn(() => mockD3);
  });

  return mockD3;
});

describe('Test Class: DefaultDrawer()', () => {
  describe('Test constructor', () => {
    it('Test without arguments', () => {
      const drawer = new DefaultDrawer(new DefaultData());

      expect(drawer.pluginData).toEqual(new DefaultData());
      expect(drawer.resources).toBeNull();
      expect(drawer.viewportId).toEqual('view-port');
      expect(drawer.componentRenderer).not.toBeNull();
      expect(drawer.viewport).toBeNull();
      expect(drawer.root).toBeNull();
      expect(drawer.d3).not.toBeNull();
    });

    it('Test passing value in constructor', () => {
      const drawer = new DefaultDrawer(new DefaultData(), 'resources', 'viewportId');

      expect(drawer.pluginData).toEqual(new DefaultData());
      expect(drawer.viewportId).toEqual('viewportId');
      expect(drawer.resources).toEqual('resources');
      expect(drawer.componentRenderer).not.toBeNull();
      expect(drawer.viewport).toBeNull();
      expect(drawer.root).toBeNull();
      expect(drawer.d3).not.toBeNull();
    });
  });

  describe('Test method: init()', () => {
    it('Test init() method', () => {
      const drawer = new DefaultDrawer(new DefaultData(), 'resources', 'viewportId');

      drawer.__formatComponentDataset = jest.fn(() => 'componentDataset');
      drawer.draw = jest.fn();

      drawer.init();

      expect(drawer.__formatComponentDataset).toHaveBeenCalledTimes(1);

      expect(drawer.d3.select).toHaveBeenCalledTimes(1);
      expect(drawer.d3.select).toHaveBeenCalledWith('#viewportId');

      expect(drawer.d3.selectAll).toHaveBeenCalledTimes(1);
      expect(drawer.d3.selectAll).toHaveBeenCalledWith('#root');

      expect(drawer.d3.data).toHaveBeenCalledTimes(1);
      expect(drawer.d3.data).toHaveBeenCalledWith('componentDataset');

      expect(drawer.d3.join).toHaveBeenCalledTimes(1);
      expect(drawer.d3.join).toHaveBeenCalledWith('svg');

      expect(drawer.d3.attr).toHaveBeenCalledTimes(6);

      expect(drawer.d3.append).toHaveBeenCalledTimes(2);
      expect(drawer.d3.append).toHaveBeenNthCalledWith(2, 'g');

      expect(drawer.componentRenderer.context).not.toBeNull();
      expect(drawer.componentRenderer.resources).toEqual('resources');
    });
  });

  describe('Test method: _registerComponentsDrawOption()', () => {
    it('Test _registerComponentsDrawOption() method', () => {
      const pluginData = {
        components: [
          {
            id: 'component1',
            drawOption: {
              x: 0,
              y: 0,
              width: 0,
              height: 0,
            },
          },
        ],
      };

      const drawer = new DefaultDrawer(pluginData, 'resources', 'viewportId');

      drawer._getNodePosition = jest.fn(() => ({ x: 1, y: 2 }));
      drawer._getNodeSize = jest.fn(() => ({ width: 3, height: 4 }));

      drawer._registerComponentsDrawOption();

      expect(drawer._getNodePosition).toHaveBeenCalledTimes(1);
      expect(drawer._getNodePosition).toHaveBeenCalledWith('component1');
      expect(drawer._getNodeSize).toHaveBeenCalledTimes(1);
      expect(drawer._getNodeSize).toHaveBeenCalledWith('component1');

      expect(pluginData.components[0].drawOption.x).toEqual(1);
      expect(pluginData.components[0].drawOption.y).toEqual(2);
      expect(pluginData.components[0].drawOption.width).toEqual(3);
      expect(pluginData.components[0].drawOption.height).toEqual(4);
    });
  });
});
