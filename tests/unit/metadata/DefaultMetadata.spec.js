import DefaultMetadata from 'src/metadata/DefaultMetadata';
import DefaultData from 'src/models/DefaultData';

describe('Test Class: DefaultMetadata()', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const defaultMetadata = new DefaultMetadata();

      expect(defaultMetadata.pluginData).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const defaultMetadata = new DefaultMetadata(new DefaultData());

      expect(defaultMetadata.pluginData).toEqual(new DefaultData());
    });
  });

  describe('Test methods', () => {
    describe('Test method: validate', () => {
      it('Should return true', () => {
        const defaultMetadata = new DefaultMetadata();

        expect(defaultMetadata.validate()).toEqual(true);
      });
    });

    describe('Test method: parse', () => {
      it('Should update pluginData definitions', () => {
        const defaultMetadata = new DefaultMetadata(new DefaultData());

        defaultMetadata.pluginData.definitions.components = [0];
        defaultMetadata.pluginData.definitions.links = [1];

        defaultMetadata.parse();
        expect(defaultMetadata.pluginData.definitions.components).toEqual([]);
        expect(defaultMetadata.pluginData.definitions.links).toEqual([]);
      });
    });
  });
});
