import { expect, describe, jest } from '@jest/globals';

import ElkLayout from 'src/draw/ElkLayout';
import Component from 'src/models/Component';
import ComponentDefinition from 'src/models/ComponentDefinition';
import ComponentAttribute from 'src/models/ComponentAttribute';
import ComponentDrawOption from 'src/models/ComponentDrawOption';
import DefaultData from 'src/models/DefaultData';
import DefaultConfiguration from 'src/models/DefaultConfiguration';

const exampleComponents = [new Component({
  id: 'workflow1',
  name: 'verticalWorkflow',
  definition: new ComponentDefinition({ parentTypes: ['network', 'workflow'] }),
  drawOption: new ComponentDrawOption({
    x: 292,
    y: 12,
    width: 308,
    height: 406,
  }),
  attributes: [],
}), new Component({
  id: 'wfstep1',
  name: 'step1',
  definition: new ComponentDefinition({ parentTypes: ['workflow'] }),
  drawOption: new ComponentDrawOption({
    x: 30,
    y: 30,
    width: 230,
    height: 50,
  }),
  attributes: [new ComponentAttribute({
    name: 'workflow',
    value: 'workflow1',
    definition: {
      type: 'Reference',
      name: 'workflow',
    },
  })],
}), new Component({
  id: 'wfstep2',
  name: 'step2',
  definition: new ComponentDefinition({ parentTypes: ['workflow'] }),
  drawOption: new ComponentDrawOption({
    x: 30,
    y: 110,
    width: 230,
    height: 50,
  }),
  attributes: [new ComponentAttribute({
    name: 'workflow',
    value: 'workflow1',
    definition: {
      type: 'Reference',
      name: 'workflow',
    },
  })],
})];

const exampleLinks = [{
  source: 'wfstep1',
  target: 'wfstep2',
}];

describe('Test Class: ElkLayout', () => {
  describe('Test static field elk', () => {
    it('should have imported elkjs', () => {
      expect(typeof ElkLayout.elk.layout).toEqual('function');
    });
  });

  describe('Test method: getNodes', () => {
    it('should return an empty map when an empty array is provided', () => {
      const layoutManager = new ElkLayout(new DefaultData(new DefaultConfiguration()));

      expect(layoutManager.getNodes([])).toEqual(new Map());
    });

    it('should return exactly one node when one component has been provided', () => {
      const layoutManager = new ElkLayout(new DefaultData(new DefaultConfiguration()));
      const component = new Component({
        id: 'my_id',
        name: 'my_name',
        drawOption: {
          x: 1,
          y: 2,
          width: 3,
          height: 4,
        },
        attributes: [],
        definition: { parentTypes: [] },
      });

      const nodes = layoutManager.getNodes([component]);

      expect(nodes.size).toEqual(1);

      const node = nodes.get('my_id');

      expect(node).toBeDefined();
      expect(node.raw).toBe(component);
      expect(node.parent).toBeDefined();
      expect(node.parent.children[0]).toBe(node);
      expect(node.children).toEqual([]);
      expect(node.depth).toEqual(1);
    });

    it(
      'should generate a unique root, common parent for each orphan, with a coherent hierarchy',
      () => {
        const layoutManager = new ElkLayout(new DefaultData(new DefaultConfiguration()));
        const comp1 = new Component({
          id: 'my_id_1',
          name: 'my_name_1',
          drawOption: {},
          attributes: [],
          definition: { parentTypes: [] },
        });

        const comp2 = new Component({
          id: 'my_id_2',
          name: 'my_name_2',
          drawOption: {},
          attributes: [],
          definition: { parentTypes: [] },
        });

        const nodes = layoutManager.getNodes([comp1, comp2]);

        expect(nodes.size).toEqual(2);

        const node1 = nodes.get('my_id_1');
        const node2 = nodes.get('my_id_2');

        expect(node1).toBeDefined();
        expect(node2).toBeDefined();
        expect(node1.raw).toBe(comp1);
        expect(node2.raw).toBe(comp2);
        expect(node1.parent).not.toBeNull();
        expect(node1.parent).toBe(node2.parent);

        const root = node1.parent;

        expect(root.children).toEqual([node1, node2]);
        expect(root.depth).toEqual(0);
        expect(root.raw).toBeNull();
        expect(root.parent).toBeNull();
      },
    );

    it('should capture parent-child relationship and depth in the expected way', () => {
      const layoutManager = new ElkLayout(new DefaultData(new DefaultConfiguration()));
      const comp1 = new Component({
        id: 'my_id_1',
        name: 'my_name_1',
      });

      const comp2 = new Component({
        id: 'my_id_2',
        name: 'my_name_2',
        attributes: [new ComponentAttribute({
          definition: new ComponentDefinition({ type: 'Reference' }),
          value: 'my_id_1',
        })],
      });

      const comp3 = new Component({
        id: 'my_id_3',
        name: 'my_name_3',
        attributes: [new ComponentAttribute({
          definition: new ComponentDefinition({ type: 'Reference' }),
          value: 'my_id_2',
        })],
      });

      const nodes = layoutManager.getNodes([comp1, comp2, comp3]);

      const node1 = nodes.get('my_id_1');
      const node2 = nodes.get('my_id_2');
      const node3 = nodes.get('my_id_3');

      expect(node1).toBeDefined();
      expect(node2).toBeDefined();
      expect(node3).toBeDefined();
      expect(node1.raw).toBe(comp1);
      expect(node2.raw).toBe(comp2);
      expect(node3.raw).toBe(comp3);
      expect(node1.children).toHaveLength(1);
      expect(node2.children).toHaveLength(1);
      expect(node3.children).toHaveLength(0);
      expect(node1.children[0]).toBe(node2);
      expect(node2.children[0]).toBe(node3);
      expect(node2.parent).toBe(node1);
      expect(node3.parent).toBe(node2);
      expect(node1.parent.depth).toEqual(0);
      expect(node1.depth).toEqual(1);
      expect(node2.depth).toEqual(2);
      expect(node3.depth).toEqual(3);
    });
  });

  describe('Test method: getNodeDepth', () => {
    it('should compute depth correctly', () => {
      const layoutManager = new ElkLayout(new DefaultData(new DefaultConfiguration()));

      expect(layoutManager.getNodeDepth({})).toEqual(0);
      expect(layoutManager.getNodeDepth({ parent: {} })).toEqual(1);
      expect(layoutManager.getNodeDepth({ parent: { parent: {} } })).toEqual(2);
      expect(layoutManager.getNodeDepth({ parent: { parent: { parent: {} } } })).toEqual(3);
    });
  });

  describe('Test method: getParentsByDepth', () => {
    it('should return no parents when no components are provided', () => {
      const layoutManager = new ElkLayout(new DefaultData(new DefaultConfiguration()));

      expect(layoutManager.getParentsByDepth(new Map())).toEqual([]);
    });

    it('should have expected behavior with 3 given components', () => {
      const layoutManager = new ElkLayout(new DefaultData(new DefaultConfiguration()));
      const grandparent = new Component({
        id: 'my_id_1',
        name: 'my_name_1',
      });

      const parent = new Component({
        id: 'my_id_2',
        name: 'my_name_2',
        attributes: [new ComponentAttribute({
          definition: new ComponentDefinition({ type: 'Reference' }),
          value: 'my_id_1',
        })],
      });

      const child = new Component({
        id: 'my_id_3',
        name: 'my_name_3',
        attributes: [new ComponentAttribute({
          definition: new ComponentDefinition({ type: 'Reference' }),
          value: 'my_id_2',
        })],
      });

      const nodes = layoutManager.getNodes([parent, grandparent, child]);

      const parents = layoutManager.getParentsByDepth(nodes);

      const node1 = nodes.get('my_id_1');
      const node2 = nodes.get('my_id_2');
      const root = node1.parent;

      expect(parents).toHaveLength(3);
      expect(parents[0]).toBe(node2);
      expect(parents[1]).toBe(node1);
      expect(parents[2]).toBe(root);
    });
  });

  describe('Test method: generateLayout', () => {
    it('should call the expected underlying functions', () => {
      const layoutManager = new ElkLayout(new DefaultData(new DefaultConfiguration()));
      // no need for real data here as it is not used
      const components = [2304324];
      const nodes = ['a', 'b', 'c'];
      const parents = [328, 32424, 1029310];
      const links = [];

      const spyGetNodes = jest
        .spyOn(layoutManager, 'getNodes')
        .mockImplementation(() => nodes);

      const spyGetParentsByDepth = jest
        .spyOn(layoutManager, 'getParentsByDepth')
        .mockImplementation(() => parents);

      const spyGenerateELKLayout = jest
        .spyOn(layoutManager, 'generateELKLayout')
        .mockImplementation(async () => undefined);

      layoutManager.generateAllElkLayouts(components, links);

      expect(spyGetNodes).toHaveBeenCalledWith(components);
      expect(spyGetParentsByDepth).toHaveBeenCalledWith(nodes);
      expect(spyGenerateELKLayout).toHaveBeenCalledTimes(parents.length);
    });
  });

  describe('Test method: generateELKLayout', () => {
    it('should provide to ELK the right input format on a minimal example', () => {
      const layoutManager = new ElkLayout(new DefaultData(new DefaultConfiguration()));
      const node = {
        raw: undefined,
        children: [{
          raw: {
            id: 'id',
            drawOption: {
              width: 1,
              height: 2,
              x: 3,
              y: 4,
            },
          },
        }],
      };
      const nodes = [];
      const links = [];

      const spyElkLayout = jest.fn((graph) => {
        expect(graph).toMatchObject({
          children: [{
            height: 2,
            id: 'id',
            width: 1,
            x: 3,
            y: 4,
          }],
          edges: [],
          id: 'root',
        });
      });

      jest.replaceProperty(ElkLayout, 'elk', { layout: spyElkLayout });

      layoutManager.generateELKLayout(node, nodes, links);
      expect(spyElkLayout).toHaveBeenCalled();
    });

    it('should provide to ELK the right input format on a full example', () => {
      const layoutManager = new ElkLayout(new DefaultData(new DefaultConfiguration()));
      const nodes = layoutManager.getNodes(exampleComponents);

      // root
      const node = nodes.get('workflow1').parent;

      const expectedGraph = {};

      const spyElkLayout = jest.fn((graph) => {
        expect(graph).toMatchObject(expectedGraph);

        jest.replaceProperty(ElkLayout, 'elk', { layout: spyElkLayout });

        layoutManager.generateELKLayout(node, nodes, exampleLinks);
        expect(spyElkLayout).toHaveBeenCalled();
      });
    });
  });

  describe('Test method: getAncestorByDepth', () => {
    it('should climb the tree structure correctly', () => {
      const layoutManager = new ElkLayout(new DefaultData(new DefaultConfiguration()));
      const a = {
        parent: {
          parent: {
            parent: {},
            depth: 121,
          },
          depth: 122,
        },
        depth: 123,
      };

      expect(layoutManager.getAncestorByDepth(a, 124)).toBeNull();
      expect(layoutManager.getAncestorByDepth(a, 123)).toBe(a);
      expect(layoutManager.getAncestorByDepth(a, 122)).toBe(a.parent);
      expect(layoutManager.getAncestorByDepth(a, 121)).toBe(a.parent.parent);
    });
  });

  describe('Test method: getLinksForChildren', () => {
    it('should find the links among children of given parent node', () => {
      const layoutManager = new ElkLayout(new DefaultData(new DefaultConfiguration()));
      const nodes = layoutManager.getNodes(exampleComponents);

      // root
      const parentNode = nodes.get('workflow1');

      let result;

      expect(() => {
        result = layoutManager.getLinksForChildren(nodes, exampleLinks, parentNode);
      }).not.toThrow();

      expect(result).toEqual([{
        source: 'wfstep1',
        target: 'wfstep2',
      }]);
    });
  });

  describe('Test method: writeLayout', () => {
    it('should call writeSingleDepthLayout with correct arguments', () => {
      const pluginData = [123];
      const layoutManager = new ElkLayout(pluginData);

      const func = jest
        .spyOn(layoutManager, 'writeSingleDepthLayout')
        .mockImplementation(() => undefined);

      const layout = ['a', 'b', 'c', 'd'];

      layoutManager.writeLayout(layout);

      expect(func).toHaveBeenCalledTimes(layout.length);
      layout.forEach((elkNode) => {
        expect(func).toHaveBeenCalledWith(elkNode);
      });
    });
  });

  describe('Test method: writeSingleDepthLayout', () => {
    it('should give empty output on empty input', () => {
      const pluginData = { components: [] };
      const layoutManager = new ElkLayout(pluginData);
      const output = { children: [] };

      expect(() => layoutManager.writeSingleDepthLayout(output)).not.toThrow();
      expect(output.children).toHaveLength(0);
    });

    it('should write the provided layout to the components model', () => {
      const pluginData = {
        components: [new Component({
          id: 'id1',
          drawOption: {},
        }), new Component({
          id: 'id2',
          drawOption: {},
        }), new Component({
          id: 'id3',
          drawOption: {},
        })],
      };
      const layoutManager = new ElkLayout(pluginData);

      const elkNode = {
        children: [{
          id: 'id1',
          x: 101,
          y: 201,
        }, {
          id: 'id2',
          x: 102,
          y: 202,
        }],
      };

      expect(() => layoutManager.writeSingleDepthLayout(elkNode)).not.toThrow();
      expect(pluginData.components[0].drawOption).toEqual({
        x: 101,
        y: 201,
      });
      expect(pluginData.components[1].drawOption).toEqual({
        x: 102,
        y: 202,
      });
      expect(pluginData.components[2].drawOption).toEqual({}); // untouched
    });
  });

  describe('Test method: arrangeComponentsPosition', () => {
    it('should call the appropriate underlying methods', async () => {
      // no need for real data here as it is not used
      // the values are only used to assert equality
      const components = [912873];
      const links = [74324];
      const x = 473284732473;

      const pluginData = {
        components,
        getLinks: jest.fn(() => links),
      };

      const layoutManager = new ElkLayout(pluginData);

      const spyGenerateAllElkLayouts = jest
        .spyOn(layoutManager, 'generateAllElkLayouts')
        .mockImplementation(() => x);

      const spyWriteLayout = jest
        .spyOn(layoutManager, 'writeLayout')
        .mockImplementation(() => undefined);

      await layoutManager.arrangeComponentsPosition();

      expect(pluginData.getLinks).toHaveBeenCalled();
      expect(spyGenerateAllElkLayouts).toHaveBeenCalledWith(components, links);
      expect(spyWriteLayout).toHaveBeenCalledWith(x);
    });

    it('should rearrange a given component\'s children', async () => {
      // no need for real data here as it is not used
      // the values are only used to assert equality
      const components = [9085325];
      const links = [4382424];
      const x = 29371372091312;

      const pluginData = {
        components,
        getLinks: jest.fn(() => links),
        getChildren: jest.fn(() => components),
      };

      const layoutManager = new ElkLayout(pluginData);

      const spyGenerateAllElkLayouts = jest
        .spyOn(layoutManager, 'generateAllElkLayouts')
        .mockImplementation(() => x);

      const spyWriteLayout = jest
        .spyOn(layoutManager, 'writeLayout')
        .mockImplementation(() => undefined);

      await layoutManager.arrangeComponentsPosition('my_fake_container_id');

      expect(pluginData.getChildren).toHaveBeenCalledWith('my_fake_container_id');
      expect(pluginData.getChildren).toHaveBeenCalledTimes(1);
      expect(pluginData.getLinks).toHaveBeenCalled();
      expect(spyGenerateAllElkLayouts).toHaveBeenCalledWith(components, links);
      expect(spyWriteLayout).toHaveBeenCalledWith(x);
    });
  });
});
