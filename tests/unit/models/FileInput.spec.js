import FileInput from 'src/models/FileInput';

describe('Test class: FileInput', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const fileInput = new FileInput();

      expect(fileInput.path).toBeNull();
      expect(fileInput.name).toBeNull();
      expect(fileInput.content).toBeNull();
    });

    it('Check passing undefined variables to constructor', () => {
      const fileInput = new FileInput({});

      expect(fileInput.path).toBeNull();
      expect(fileInput.name).toBeNull();
      expect(fileInput.content).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const fileInput = new FileInput({
        path: 'path',
        name: 'name',
        content: 'content',
      });

      expect(fileInput.path).toEqual('path');
      expect(fileInput.name).toEqual('name');
      expect(fileInput.content).toEqual('content');
    });
  });
});
