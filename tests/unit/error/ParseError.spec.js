import ParseError from 'src/error/ParseError';

describe('Test class: ParseError', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const parseError = new ParseError();

      expect(parseError.message).toEqual(
        'Error happened when trying to parse.',
      );
      expect(parseError.startLine).toBe(0);
      expect(parseError.startColumn).toBe(0);
      expect(parseError.endLine).toBe(0);
      expect(parseError.endColumn).toBe(0);
      expect(parseError.severity).toEqual('Error');
    });

    it('Check passing variable to constructor', () => {
      const parseError = new ParseError('message', 1, 2, 3, 4, 'Warning');

      expect(parseError.message).toEqual('message');
      expect(parseError.startLine).toEqual(1);
      expect(parseError.startColumn).toEqual(2);
      expect(parseError.endLine).toEqual(3);
      expect(parseError.endColumn).toEqual(4);
      expect(parseError.severity).toEqual('Warning');
    });

    it('Check passing null variable to constructor', () => {
      const parseError = new ParseError(null, 1, 2, 3, 4, null);

      expect(parseError.message).toEqual('Error happened when trying to parse.');
      expect(parseError.startLine).toEqual(1);
      expect(parseError.startColumn).toEqual(2);
      expect(parseError.endLine).toEqual(3);
      expect(parseError.endColumn).toEqual(4);
      expect(parseError.severity).toEqual('Error');
    });
  });
  describe('Test throw', () => {
    try {
      throw new ParseError('message', 1, 2, 3, 4, 'Warning');
    } catch (error) {
      expect(error.message).toEqual('message');
      expect(error.startLine).toEqual(1);
      expect(error.startColumn).toEqual(2);
      expect(error.endLine).toEqual(3);
      expect(error.endColumn).toEqual(4);
      expect(error.severity).toEqual('Warning');
      expect(error.name).toEqual('ParseError');
    }
  });
});
