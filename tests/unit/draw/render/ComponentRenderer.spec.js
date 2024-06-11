import { expect, describe } from '@jest/globals';
import ComponentRenderer from 'src/draw/render/ComponentRenderer';
import DefaultData from 'src/models/DefaultData';

describe('Test Class: ComponentRenderer', () => {
  describe('Test constructor', () => {
    it('Checks variable instantiation', () => {
      const componentRenderer = new ComponentRenderer();

      expect(componentRenderer.pluginData).toBeNull();
      expect(componentRenderer.viewport).toBeNull();
    });

    it('Checks passing variable to constructor', () => {
      const componentRenderer = new ComponentRenderer(new DefaultData(), 'viewport');

      expect(componentRenderer.pluginData).toEqual(new DefaultData());
      expect(componentRenderer.viewport).toEqual('viewport');
    });
  });
});
