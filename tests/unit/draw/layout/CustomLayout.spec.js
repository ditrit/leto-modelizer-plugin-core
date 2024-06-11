import { expect, describe } from '@jest/globals';
import CustomLayout from 'src/draw/layout/CustomLayout';

describe('Test Class: DefaultLayout', () => {
  describe('Test method: createNode', () => {
    it('Should return node with default value', () => {
      const layout = new CustomLayout({
        getComponentDepth: (id) => id,
      });

      expect(layout.createNode({
        id: 0,
        getContainerId: () => null,
        definition: {
          displayType: null,
          workflowDirection: 'vertical',
          isContainer: true,
          defaultWidth: 1,
          defaultHeight: 2,
          minWidth: 3,
          minHeight: 4,
          reservedWidth: 5,
          reservedHeight: 6,
          margin: 7,
          gap: 8,
        },
        drawOption: {
          x: 9,
          y: 10,
        },
      })).toEqual({
        id: 0,
        parent: 'root',
        type: 'default',
        direction: 'vertical',
        children: [],
        depth: 1,
        isContainer: true,
        width: 1,
        height: 2,
        minWidth: 3,
        minHeight: 4,
        reservedWidth: 5,
        reservedHeight: 6,
        margin: 7,
        gap: 8,
        x: 9,
        y: 10,
      });
    });

    it('Should return node with default specific value', () => {
      const layout = new CustomLayout({
        getComponentDepth: (id) => id,
      });

      expect(layout.createNode({
        id: 11,
        getContainerId: () => 'test',
        definition: {
          displayType: 'displayType',
          workflowDirection: 'vertical',
          isContainer: true,
          defaultWidth: 1,
          defaultHeight: 2,
          minWidth: 3,
          minHeight: 4,
          reservedWidth: 5,
          reservedHeight: 6,
          margin: 7,
          gap: 8,
        },
        drawOption: {
          x: 9,
          y: 10,
        },
      })).toEqual({
        id: 11,
        parent: 'test',
        type: 'displayType',
        direction: 'vertical',
        children: [],
        depth: 12,
        isContainer: true,
        width: 1,
        height: 2,
        minWidth: 3,
        minHeight: 4,
        reservedWidth: 5,
        reservedHeight: 6,
        margin: 7,
        gap: 8,
        x: 9,
        y: 10,
      });
    });
  });

  describe('Test method: canBePlaced', () => {
    it('Should return true on outside position', () => {
      const layout = new CustomLayout();
      const nodes = [{
        x: 5,
        y: 5,
        width: 2,
        height: 2,
      }];
      const node = { width: 1, height: 1 };

      // Check node on left of nodes.
      expect(layout.canBePlaced(nodes, node, { x: 0, y: 5 })).toEqual(true);
      expect(layout.canBePlaced(nodes, node, { x: 3, y: 5 })).toEqual(true);
      // Check node on right of nodes.
      expect(layout.canBePlaced(nodes, node, { x: 10, y: 0 })).toEqual(true);
      expect(layout.canBePlaced(nodes, node, { x: 8, y: 0 })).toEqual(true);
      // Check node above of nodes.
      expect(layout.canBePlaced(nodes, node, { x: 5, y: 10 })).toEqual(true);
      expect(layout.canBePlaced(nodes, node, { x: 5, y: 8 })).toEqual(true);
      // Check node below of nodes.
      expect(layout.canBePlaced(nodes, node, { x: 5, y: 0 })).toEqual(true);
      expect(layout.canBePlaced(nodes, node, { x: 5, y: 3 })).toEqual(true);
    });

    it('Should return false on inside position', () => {
      const layout = new CustomLayout();
      const nodes = [{
        x: 5,
        y: 5,
        width: 2,
        height: 2,
      }];
      const node = { width: 1, height: 1 };

      // Check node on left edge of nodes.
      expect(layout.canBePlaced(nodes, node, { x: 4, y: 5 })).toEqual(false);
      // Check node on right edge of nodes.
      expect(layout.canBePlaced(nodes, node, { x: 7, y: 5 })).toEqual(false);
      // Check node on top edge of nodes.
      expect(layout.canBePlaced(nodes, node, { x: 5, y: 7 })).toEqual(false);
      // Check node bottom edge of nodes.
      expect(layout.canBePlaced(nodes, node, { x: 5, y: 4 })).toEqual(false);
      // Check nodeon nodes.
      expect(layout.canBePlaced(nodes, node, { x: 5, y: 5 })).toEqual(false);
    });
  });

  describe('Test method: getPoints', () => {
    it('Should return valid points', () => {
      const layout = new CustomLayout();

      expect(layout.getPoints(0, 1, 1)).toEqual([
        { x: 1, y: 1 },
      ]);
      expect(layout.getPoints(0, 2, 3)).toEqual([
        { x: 2, y: 2 },
      ]);
      expect(layout.getPoints(1, 1, 1)).toEqual([
        { x: 1, y: 2 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
      ]);
      expect(layout.getPoints(1, 3, 2)).toEqual([
        { x: 3, y: 5 },
        { x: 5, y: 3 },
        { x: 5, y: 5 },
      ]);
      expect(layout.getPoints(2, 1, 1)).toEqual([
        { x: 1, y: 3 },
        { x: 3, y: 1 },
        { x: 2, y: 3 },
        { x: 3, y: 2 },
        { x: 3, y: 3 },
      ]);
      expect(layout.getPoints(2, 4, 6)).toEqual([
        { x: 4, y: 16 },
        { x: 16, y: 4 },
        { x: 10, y: 16 },
        { x: 16, y: 10 },
        { x: 16, y: 16 },
      ]);
    });
  });
});
