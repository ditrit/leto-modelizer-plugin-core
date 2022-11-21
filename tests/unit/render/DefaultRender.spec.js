import DefaultRender from 'src/render/DefaultRender';
import DefaultData from 'src/models/DefaultData';

describe('Test Class: DefaultRender()', () => {
  describe('Test constructor', () => {
    it('pluginData should be null if it is not provided', () => {
      const renderer = new DefaultRender();

      expect(renderer.pluginData).toBeNull();
    });

    it('pluginData should be defined if it is provided', () => {
      const renderer = new DefaultRender(new DefaultData());

      expect(renderer.pluginData).toEqual(new DefaultData());
    });
  });

  describe('Test methods', () => {
    it('Test render() method', () => {
      const defaultRender = new DefaultRender();

      expect(defaultRender.render()).toEqual([]);
    });
  });
});
