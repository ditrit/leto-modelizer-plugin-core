import DefaultMetadata from 'src/metadata/DefaultMetadata';

describe('Test Class: DefaultMetadata()', () => {
  describe('Test methods', () => {
    describe('Test method: validate', () => {
      it('Should return true', () => {
        const defaultMetadata = new DefaultMetadata();
        expect(defaultMetadata.validate()).toEqual(true);
      });
    });

    describe('Test method: getComponentDefinitions', () => {
      it('Should return empty array', () => {
        const defaultMetadata = new DefaultMetadata();
        expect(defaultMetadata.getComponentDefinitions()).toEqual([]);
      });
    });
  });
});
