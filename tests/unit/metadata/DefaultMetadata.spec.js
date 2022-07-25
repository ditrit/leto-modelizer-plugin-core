import DefaultMetadata from "src/metadata/DefaultMetadata";

describe('Test Class: DefaultMetadata()', () => {
  describe('Test methods', () => {
    it('Test validate() method', () => {
      const defaultMetadata = new DefaultMetadata();
      expect(defaultMetadata.validate()).toEqual(true);
    });
  });
});
