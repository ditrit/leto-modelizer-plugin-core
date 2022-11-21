import DefaultParser from 'src/parser/DefaultParser';
import DefaultData from 'src/models/DefaultData';

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
  });
});
