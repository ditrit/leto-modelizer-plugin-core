import ParserLog from 'src/models/ParserLog';

describe('Test class: ParserLog', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const log = new ParserLog();

      expect(log.path).toBeNull();
      expect(log.severity).toEqual(1);
      expect(log.startLineNumber).toBeNull();
      expect(log.startColumn).toBeNull();
      expect(log.endLineNumber).toBeNull();
      expect(log.endColumn).toBeNull();
      expect(log.message).toBeNull();
      expect(log.initialErrorMessage).toBeNull();
      expect(log.componentId).toBeNull();
      expect(log.attribute).toBeNull();
      expect(log.extraData).toEqual('');
    });

    it('Check passing undefined variables to constructor', () => {
      const log = new ParserLog({});

      expect(log.path).toBeNull();
      expect(log.severity).toEqual(1);
      expect(log.startLineNumber).toBeNull();
      expect(log.startColumn).toBeNull();
      expect(log.endLineNumber).toBeNull();
      expect(log.endColumn).toBeNull();
      expect(log.message).toBeNull();
      expect(log.initialErrorMessage).toBeNull();
      expect(log.componentId).toBeNull();
      expect(log.attribute).toBeNull();
      expect(log.extraData).toEqual('');
    });

    it('Check passing all variables to constructor', () => {
      const log = new ParserLog({
        path: 'path',
        severity: 8,
        startLineNumber: 1,
        startColumn: 2,
        endLineNumber: 3,
        endColumn: 4,
        message: 'message',
        initialErrorMessage: 'initialErrorMessage',
        componentId: 'componentId',
        attribute: 'attribute',
        extraData: 'extraData',
      });

      expect(log.path).toEqual('path');
      expect(log.severity).toEqual(8);
      expect(log.startLineNumber).toEqual(1);
      expect(log.startColumn).toEqual(2);
      expect(log.endLineNumber).toEqual(3);
      expect(log.endColumn).toEqual(4);
      expect(log.message).toEqual('message');
      expect(log.initialErrorMessage).toEqual('initialErrorMessage');
      expect(log.componentId).toEqual('componentId');
      expect(log.attribute).toEqual('attribute');
      expect(log.extraData).toEqual('extraData');
    });
  });
});
