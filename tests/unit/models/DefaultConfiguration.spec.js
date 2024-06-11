import { describe, it, expect } from '@jest/globals';
import DefaultConfiguration from 'src/models/DefaultConfiguration';

describe('Test class: DefaultConfiguration', () => {
  describe('Test constructor', () => {
    const defaultKeyBindings = {
      moveSceneUp: ['ArrowUp'],
      moveSceneDown: ['ArrowDown'],
      moveSceneLeft: ['ArrowLeft'],
      moveSceneRight: ['ArrowRight'],
      moveComponentUp: [],
      moveComponentDown: [],
      moveComponentLeft: [],
      moveComponentRight: [],
      zoomIn: ['+'],
      zoomOut: ['-'],
      deleteObject: ['Delete'],
      editComponent: [',', '?'],
      selection: ['Shift'],
      selectAll: ['A'],
      deselectAll: ['D'],
    };

    it('Check variables instantiation', () => {
      const config = new DefaultConfiguration();

      expect(config.editor).toEqual({ syntax: null });
      expect(config.restrictiveFolder).toBeNull();
      expect(config.defaultFileName).toBeNull();
      expect(config.defaultFileExtension).toBeNull();
      expect(config.tags).toEqual([]);
      expect(config.isFolderTypeDiagram).toEqual(true);
      expect(config.extraResources).toEqual([]);
      expect(config.rootContainer).toEqual({
        margin: 30,
        gap: 50,
      });
      expect(config.container).toEqual({
        margin: 30,
        gap: 50,
      });
      expect(config.keysBinding).toEqual(defaultKeyBindings);
    });

    it('Check passing undefined variables to constructor', () => {
      const config = new DefaultConfiguration({});

      expect(config.editor).toEqual({ syntax: null });
      expect(config.restrictiveFolder).toBeNull();
      expect(config.defaultFileName).toBeNull();
      expect(config.defaultFileExtension).toBeNull();
      expect(config.tags).toEqual([]);
      expect(config.isFolderTypeDiagram).toEqual(true);
      expect(config.extraResources).toEqual([]);
      expect(config.rootContainer).toEqual({
        margin: 30,
        gap: 50,
      });
      expect(config.container).toEqual({
        margin: 30,
        gap: 50,
      });
      expect(config.keysBinding).toEqual(defaultKeyBindings);
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
        isFolderTypeDiagram: false,
        extraResources: ['test'],
        rootContainer: {
          margin: 1,
          gap: 2,
        },
        container: {
          margin: 3,
          gap: 4,
        },
        keysBinding: {
          moveSceneUp: ['z'],
        },
      });

      expect(config.editor).toEqual({ syntax: true });
      expect(config.restrictiveFolder).toEqual('root');
      expect(config.defaultFileName).toEqual('test');
      expect(config.defaultFileExtension).toEqual('.test');
      expect(config.tags).toEqual(['test']);
      expect(config.isFolderTypeDiagram).toEqual(false);
      expect(config.extraResources).toEqual(['test']);
      expect(config.rootContainer).toEqual({
        margin: 1,
        gap: 2,
      });
      expect(config.container).toEqual({
        margin: 3,
        gap: 4,
      });
      expect(config.keysBinding).toEqual({
        ...defaultKeyBindings,
        moveSceneUp: ['z'],
      });
    });
  });
});
