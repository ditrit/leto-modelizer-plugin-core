import DefaultMetadata from 'src/metadata/DefaultMetadata';

describe('Test Class: DefaultMetadata()', () => {
  describe('Test methods', () => {
    describe('Test method: validate', () => {
      it('Should return true', () => {
        const defaultMetadata = new DefaultMetadata();
        expect(defaultMetadata.validate()).toEqual(true);
      });
    });

    describe('Test method: getDefinitions', () => {
      it('Should return object with component and link definitions', () => {
        const defaultMetadata = new DefaultMetadata();
        expect(defaultMetadata.getDefinitions()).toEqual({
          components: [],
          links: [],
        });
      });
    });
  });
});
