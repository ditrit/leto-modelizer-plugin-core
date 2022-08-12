import FileInformation from 'src/models/FileInformation';

describe('Test class: FileInformation', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const fileInformation = new FileInformation();

      expect(fileInformation.path).toBeNull();
      expect(fileInformation.name).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const fileInformation = new FileInformation('path', 'name');

      expect(fileInformation.path).toEqual('path');
      expect(fileInformation.name).toEqual('name');
    });
  });
});
