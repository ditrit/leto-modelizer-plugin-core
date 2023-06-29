import DefaultConfiguration from 'src/models/DefaultConfiguration';

describe('Test class: DefaultConfiguration', () => {
  describe('Test constructor', () => {
    it('Check variables instantiation', () => {
      const config = new DefaultConfiguration();

      expect(config.editor).toEqual({ syntax: null });
      expect(config.restrictiveFolder).toBeNull();
      expect(config.defaultFileName).toBeNull();
      expect(config.defaultFileExtension).toBeNull();
      expect(config.tags).toEqual([]);
    });

    it('Check passing undefined variables to constructor', () => {
      const config = new DefaultConfiguration({});

      expect(config.editor).toEqual({ syntax: null });
      expect(config.restrictiveFolder).toBeNull();
      expect(config.defaultFileName).toBeNull();
      expect(config.defaultFileExtension).toBeNull();
      expect(config.tags).toEqual([]);
    });

    it('Check passing all variables to constructor', () => {
      const config = new DefaultConfiguration({
        editor: {
          syntax: true,
        },
        restrictiveFolder: 'root',
        defaultFileName: 'test',
        defaultFileExtension: '.test',
        tags: ['test'],
      });

      expect(config.editor).toEqual({ syntax: true });
      expect(config.restrictiveFolder).toEqual('root');
      expect(config.defaultFileName).toEqual('test');
      expect(config.defaultFileExtension).toEqual('.test');
      expect(config.tags).toEqual(['test']);
    });
  });
});
