import { expect, describe } from '@jest/globals';
import DefaultLayout from 'src/draw/DefaultLayout';
import DefaultData from 'src/models/DefaultData';

describe('Test Class: DefaultLayout', () => {
  describe('Test constructor', () => {
    it('Checks variable instantiation', () => {
      const layout = new DefaultLayout();

      expect(layout.pluginData).toBeNull();
    });

    it('Checks passing variable to constructor', () => {
      const layout = new DefaultLayout(new DefaultData());

      expect(layout.pluginData).toEqual(new DefaultData());
    });
  });
  describe('Test method: arrangeComponentsPosition', () => {
    const layoutManager = new DefaultLayout(undefined);

    it('returns empty Promise', async () => {
      await expect(layoutManager.arrangeComponentsPosition()).resolves.toBeUndefined();
    });
  });
});
