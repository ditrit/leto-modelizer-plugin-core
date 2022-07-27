import DefaultParser from 'src/parser/DefaultParser';

describe('Test Class: DefaultParser()', () => {
  describe('Test methods', () => {
    it('Test parse() method', () => {
      const defaultParser = new DefaultParser();
      expect(defaultParser.parse().components).toEqual([]);
      expect(defaultParser.parse().links).toEqual([]);
    });
  });
});
