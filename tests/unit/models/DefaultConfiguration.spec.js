import {
  describe, it, expect, beforeEach,
} from '@jest/globals';
import DefaultConfiguration from 'src/models/DefaultConfiguration';

describe('Test class: DefaultConfiguration', () => {
  describe('Test constructor', () => {
    let defaultElkParams;
    let defaultSingleComponentParams;

    beforeEach(() => {
      defaultElkParams = {
        'elk.algorithm': 'elk.layered',
        'spacing.baseValue': '50',
        separateConnectedComponents: 'true',
        'elk.layered.cycleBreaking.strategy': 'INTERACTIVE',
        'elk.layered.layering.strategy': 'INTERACTIVE',
        'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
        'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
        'elk.layered.interactiveReferencePoint': 'TOP_LEFT',
        'elk.debugMode': 'true',
        'elk.direction': 'UNDEFINED',
      };

      defaultSingleComponentParams = {
        precision: 10,
        margin: 20,
      };
    });

    it('Check variables instantiation', () => {
      const config = new DefaultConfiguration();

      expect(config.editor).toEqual({ syntax: null });
      expect(config.restrictiveFolder).toBeNull();
      expect(config.defaultFileName).toBeNull();
      expect(config.defaultFileExtension).toBeNull();
      expect(config.tags).toEqual([]);
      expect(config.elkParams).toEqual(defaultElkParams);
      expect(config.singleComponentParams).toEqual(defaultSingleComponentParams);
    });

    it('Check passing undefined variables to constructor', () => {
      const config = new DefaultConfiguration({});

      expect(config.editor).toEqual({ syntax: null });
      expect(config.restrictiveFolder).toBeNull();
      expect(config.defaultFileName).toBeNull();
      expect(config.defaultFileExtension).toBeNull();
      expect(config.tags).toEqual([]);
      expect(config.elkParams).toEqual(defaultElkParams);
      expect(config.singleComponentParams).toEqual(defaultSingleComponentParams);
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
        elkParams: {
          test_attribute: 12345,
        },
        singleComponentParams: {
          test_attribute: 12345,
        },
      });

      expect(config.editor).toEqual({ syntax: true });
      expect(config.restrictiveFolder).toEqual('root');
      expect(config.defaultFileName).toEqual('test');
      expect(config.defaultFileExtension).toEqual('.test');
      expect(config.tags).toEqual(['test']);
      expect(config.elkParams).toEqual({
        ...defaultElkParams,
        test_attribute: 12345,
      });
      expect(config.singleComponentParams).toEqual({
        ...defaultSingleComponentParams,
        test_attribute: 12345,
      });
    });
  });
});
