import FileInformation from 'src/models/FileInformation';

describe('Test class: FileInformation', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const fileInformation = new FileInformation();

      expect(fileInformation.path).toBeNull();
      expect(fileInformation.fileName).toBeNull();
    });

    it('Check passing undefined variables to constructor', () => {
      const fileInformation = new FileInformation({});

      expect(fileInformation.path).toBeNull();
      expect(fileInformation.fileName).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const fileInformation = new FileInformation({
        path: '/src/test/file.txt',
        name: 'name',
      });

      expect(fileInformation.path).toEqual('/src/test/file.txt');
      expect(fileInformation.fileName).toEqual('file.txt');
    });
  });
});
