import { expect, describe } from '@jest/globals';
import LinkRenderer from 'src/draw/render/LinkRenderer';
import DefaultData from 'src/models/DefaultData';

describe('Test Class: LinkRenderer', () => {
  describe('Test constructor', () => {
    it('Checks variable instantiation', () => {
      const linkRenderer = new LinkRenderer();

      expect(linkRenderer.pluginData).toBeNull();
      expect(linkRenderer.viewport).toBeNull();
    });

    it('Checks passing variable to constructor', () => {
      const linkRenderer = new LinkRenderer(new DefaultData(), 'viewport');

      expect(linkRenderer.pluginData).toEqual(new DefaultData());
      expect(linkRenderer.viewport).toEqual('viewport');
    });
  });

  describe('Test method: getReducedPointPositionOnSegment', () => {
    it('Should return valid positions', () => {
      const linkRenderer = new LinkRenderer();

      expect(linkRenderer.getReducedPointPositionOnSegment(0, 0, 0, 1, 1))
        .toEqual({ x: 0, y: 0 });

      expect(linkRenderer.getReducedPointPositionOnSegment(0, 0, 0, 2, 1))
        .toEqual({ x: 0, y: 1 });
    });
  });
});
