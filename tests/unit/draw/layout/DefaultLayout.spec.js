import { expect, describe } from '@jest/globals';
import DefaultLayout from 'src/draw/layout/DefaultLayout';
import DefaultData from 'src/models/DefaultData';

describe('Test Class: DefaultLayout', () => {
  describe('Test constructor', () => {
    it('Checks variable instantiation', () => {
      const layout = new DefaultLayout();

      expect(layout.pluginData).toBeNull();
      expect(layout.viewport).toBeNull();
    });

    it('Checks passing variable to constructor', () => {
      const layout = new DefaultLayout(new DefaultData(), 'viewport');

      expect(layout.pluginData).toEqual(new DefaultData());
      expect(layout.viewport).toEqual('viewport');
    });
  });

  describe('Test method: generateComponentsLayout', () => {
    it('Should return true', () => {
      const layout = new DefaultLayout();

      expect(layout.generateComponentsLayout('id', true)).toEqual(true);
    });
  });

  describe('Test method: resize', () => {
    it('Should return true', () => {
      const layout = new DefaultLayout();

      expect(layout.resize('id')).toEqual(true);
    });
  });
});
