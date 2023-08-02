import { expect, describe } from '@jest/globals';
import DefaultLayout from 'src/draw/DefaultLayout';

describe('Test Class: DefaultLayout', () => {
  describe('Test constructor', () => {
    it('correctly defines this.pluginData', () => {
      const pluginData = 38492732402; // value does not matter

      expect((new DefaultLayout(pluginData)).pluginData).toEqual(pluginData);
    });
  });
  describe('Test method: arrangeComponentsPosition', () => {
    const layoutManager = new DefaultLayout(undefined);

    it('returns empty Promise', async () => {
      await expect(layoutManager.arrangeComponentsPosition()).resolves.toBeUndefined();
    });
  });
});
