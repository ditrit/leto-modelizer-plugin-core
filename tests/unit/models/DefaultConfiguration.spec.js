import DefaultConfiguration from 'src/models/DefaultConfiguration';

describe('Test class: DefaultConfiguration', () => {
  describe('Test constructor', () => {
    it('Check variables instantiation', () => {
      const config = new DefaultConfiguration();

      expect(config.editor).toEqual({ syntax: null });
      expect(config.defaultFileName).toBeNull();
      expect(config.defaultFileExtension).toBeNull();
    });

    it('Check passing undefined variables to constructor', () => {
      const config = new DefaultConfiguration({});

      expect(config.editor).toEqual({ syntax: null });
      expect(config.defaultFileName).toBeNull();
      expect(config.defaultFileExtension).toBeNull();
    });

    it('Check passing all variables to constructor', () => {
      const config = new DefaultConfiguration({
        editor: {
          syntax: true,
        },
        defaultFileName: 'test',
        defaultFileExtension: '.test',
      });

      expect(config.editor).toEqual({ syntax: true });
      expect(config.defaultFileName).toEqual('test');
      expect(config.defaultFileExtension).toEqual('.test');
    });
  });
});
