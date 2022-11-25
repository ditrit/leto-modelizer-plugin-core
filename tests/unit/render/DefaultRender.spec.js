import DefaultRender from 'src/render/DefaultRender';
import DefaultData from 'src/models/DefaultData';
import FileInput from 'src/models/FileInput';
import Component from 'src/models/Component';
import ComponentDrawOption from 'src/models/ComponentDrawOption';

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
    describe('Test method: render', () => {
      it('Should render empty array', () => {
        const defaultRender = new DefaultRender();

        expect(defaultRender.render()).toEqual([]);
      });
    });

    describe('Test method: renderConfiguration', () => {
      it('Should render configuration with empty plugin', () => {
        const pluginData = new DefaultData({ name: 'test' });
        const render = new DefaultRender(pluginData);

        const configFile = new FileInput({
          path: 'test.json',
          content: '',
        });

        render.renderConfiguration(configFile);

        expect(configFile.path).toEqual('test.json');
        expect(configFile.content).toEqual(JSON.stringify({
          test: {},
        }));
      });

      it('Should update file content on empty configuration file', () => {
        const pluginData = new DefaultData({ name: 'test' });
        const render = new DefaultRender(pluginData);

        pluginData.components.push(new Component({
          id: 'c1',
          drawOption: new ComponentDrawOption({ x: 1 }),
        }));

        const configFile = new FileInput({
          path: 'test.json',
          content: '',
        });

        render.renderConfiguration(configFile);

        expect(configFile.path).toEqual('test.json');
        expect(configFile.content).toEqual(JSON.stringify({
          test: {
            c1: {
              x: 1,
              needsResizing: false,
            },
          },
        }));
      });

      it('Should update file content without removing other plugins configuration', () => {
        const pluginData = new DefaultData({ name: 'test' });
        const render = new DefaultRender(pluginData);

        pluginData.components.push(new Component({
          id: 'c1',
          drawOption: 1,
        }));

        const configFile = new FileInput({
          path: 'test.json',
          content: JSON.stringify({
            other: {
              test: 1,
            },
            test: {
              c1: 2,
              c2: 3,
            },
          }),
        });

        render.renderConfiguration(configFile);

        expect(configFile.path).toEqual('test.json');
        expect(configFile.content).toEqual(JSON.stringify({
          other: {
            test: 1,
          },
          test: {
            c1: 1,
          },
        }));
      });
    });
  });
});
