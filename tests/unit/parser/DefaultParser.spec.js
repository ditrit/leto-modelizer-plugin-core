import DefaultParser from 'src/parser/DefaultParser';
import DefaultData from 'src/models/DefaultData';
import Component from 'src/models/Component';
import FileInput from 'src/models/FileInput';
import ComponentDrawOption from 'src/models/ComponentDrawOption';

describe('Test Class: DefaultParser()', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const parser = new DefaultParser();

      expect(parser.pluginData).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const parser = new DefaultParser(new DefaultData());

      expect(parser.pluginData).toEqual(new DefaultData());
    });
  });

  describe('Test methods', () => {
    describe('Test method: parse', () => {
      it('should return default object with initialized properties', () => {
        const defaultParser = new DefaultParser(new DefaultData());

        defaultParser.pluginData.components = [0];
        defaultParser.pluginData.parseErrors = [1];

        defaultParser.parse();

        expect(defaultParser.pluginData.components).toEqual([]);
        expect(defaultParser.pluginData.parseErrors).toEqual([]);
      });
    });

    describe('Test method: isParsable', () => {
      it('on any not null file name should return true', () => {
        const defaultParser = new DefaultParser();

        expect(defaultParser.isParsable('')).toBeTruthy();
      });

      it('on null/undefined file name should return false', () => {
        const defaultParser = new DefaultParser();

        expect(defaultParser.isParsable()).toBeFalsy();
        expect(defaultParser.isParsable(null)).toBeFalsy();
      });
    });

    it('Should save configuration even if the file content is null', () => {
      const pluginData = new DefaultData({ name: 'test' });
      const defaultParser = new DefaultParser(pluginData);
      const configFile = new FileInput({
        path: 'test.json',
        content: null,
      });

      pluginData.components.push(new Component({ id: 'c2' }));
      defaultParser.parseConfiguration(configFile);

      expect(pluginData.components).toEqual([new Component({ id: 'c2' })]);
    });

    describe('Test method: parseConfiguration', () => {
      it('Should not change component on empty configuration', () => {
        const pluginData = new DefaultData({ name: 'test' });
        const defaultParser = new DefaultParser(pluginData);
        const configFile = new FileInput({
          path: 'test.json',
          content: JSON.stringify({}),
        });

        pluginData.components.push(new Component({ id: 'c2' }));
        defaultParser.parseConfiguration(configFile);

        expect(pluginData.components).toEqual([new Component({ id: 'c2' })]);
      });

      it('Should not change component without plugin configuration', () => {
        const pluginData = new DefaultData({ name: 'test' });
        const defaultParser = new DefaultParser(pluginData);
        const configFile = new FileInput({
          path: 'test.json',
          content: JSON.stringify({
            other: {
              test: 1,
            },
          }),
        });

        pluginData.components.push(new Component({ id: 'c2' }));
        defaultParser.parseConfiguration(configFile);

        expect(pluginData.components).toEqual([new Component({ id: 'c2' })]);
      });

      it('Should not change component without component configuration', () => {
        const pluginData = new DefaultData({ name: 'test' });
        const defaultParser = new DefaultParser(pluginData);
        const configFile = new FileInput({
          path: 'test.json',
          content: JSON.stringify({
            other: {
              test: 1,
            },
            test: {
              c1: 1,
            },
          }),
        });

        pluginData.components.push(new Component({ id: 'c2' }));
        defaultParser.parseConfiguration(configFile);

        expect(pluginData.components).toEqual([new Component({ id: 'c2' })]);
      });

      it('Should update component', () => {
        const pluginData = new DefaultData({ name: 'test' });
        const defaultParser = new DefaultParser(pluginData);
        const configFile = new FileInput({
          path: 'test.json',
          content: JSON.stringify({
            test: {
              c1: new ComponentDrawOption({ x: 1 }),
              c2: new ComponentDrawOption({ x: 2 }),
            },
          }),
        });

        pluginData.components.push(new Component({ id: 'c1' }));
        pluginData.components.push(new Component({ id: 'c2' }));
        defaultParser.parseConfiguration(configFile);

        expect(pluginData.components).toEqual([
          new Component({ id: 'c1', drawOption: new ComponentDrawOption({ x: 1 }) }),
          new Component({ id: 'c2', drawOption: new ComponentDrawOption({ x: 2 }) }),
        ]);
      });
    });
  });
});
