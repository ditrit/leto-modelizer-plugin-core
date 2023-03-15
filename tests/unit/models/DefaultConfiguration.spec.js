import DefaultConfiguration from 'src/models/DefaultConfiguration';

describe('Test class: DefaultConfiguration', () => {
  describe('Test constructor', () => {
    it('Check variables instantiation', () => {
      const config = new DefaultConfiguration();

      expect(config.editor).toEqual({ syntax: null });
    });

    it('Check passing undefined variables to constructor', () => {
      const config = new DefaultConfiguration({});

      expect(config.editor).toEqual({ syntax: null });
    });

    it('Check passing all variables to constructor', () => {
      const config = new DefaultConfiguration({
        editor: {
          syntax: true,
        },
      });

      expect(config.editor).toEqual({ syntax: true });
    });
  });
});
