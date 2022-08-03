import DefaultParser from 'src/parser/DefaultParser';

describe('Test Class: DefaultParser()', () => {
  describe('Test methods', () => {
    describe('Test method: parse', () => {
      it('should return default object with initialized properties', () => {
        const defaultParser = new DefaultParser();
        expect(defaultParser.parse()).toEqual({
          components: [],
          links: [],
        });
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
