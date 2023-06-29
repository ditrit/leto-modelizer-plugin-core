import DefaultPlugin from 'src/models/DefaultPlugin';
import DefaultData from 'src/models/DefaultData';
import DefaultDrawer from 'src/draw/DefaultDrawer';
import DefaultMetadata from 'src/metadata/DefaultMetadata';
import DefaultParser from 'src/parser/DefaultParser';
import DefaultRender from 'src/render/DefaultRender';
import DefaultConfiguration from 'src/models/DefaultConfiguration';
import FileInformation from 'src/models/FileInformation';

describe('Test class: DefaultPlugin', () => {
  describe('Test constructor', () => {
    it('Check variables instantiation', () => {
      const plugin = new DefaultPlugin();
      const data = new DefaultData(new DefaultConfiguration());

      expect(plugin.configuration).toEqual(new DefaultConfiguration());
      expect(plugin.data).toEqual(data);
      expect(plugin.__drawer).toEqual(new DefaultDrawer(data));
      expect(plugin.__metadata).toEqual(new DefaultMetadata(data));
      expect(plugin.__parser).toEqual(new DefaultParser(data));
      expect(plugin.__renderer).toEqual(new DefaultRender(data));
    });

    it('Check passing undefined variables to constructor', () => {
      const plugin = new DefaultPlugin({});
      const data = new DefaultData(new DefaultConfiguration());

      expect(plugin.configuration).toEqual(new DefaultConfiguration());
      expect(plugin.data).toEqual(data);
      expect(plugin.__drawer).toEqual(new DefaultDrawer(data));
      expect(plugin.__metadata).toEqual(new DefaultMetadata(data));
      expect(plugin.__parser).toEqual(new DefaultParser(data));
      expect(plugin.__renderer).toEqual(new DefaultRender(data));
    });

    it('Check passing all variables to constructor', () => {
      const plugin = new DefaultPlugin({
        pluginData: 1,
        pluginDrawer: 2,
        pluginMetadata: 3,
        pluginParser: 4,
        pluginRenderer: 5,
        configuration: 6,
      });

      expect(plugin.data).toEqual(1);
      expect(plugin.__drawer).toEqual(2);
      expect(plugin.__metadata).toEqual(3);
      expect(plugin.__parser).toEqual(4);
      expect(plugin.__renderer).toEqual(5);
      expect(plugin.configuration).toEqual(6);
    });
  });

  describe('Test method: init', () => {
    it('should set events and call validate and parse of metadata', () => {
      const mockInitLinkDefinitions = jest.fn();
      const mockParse = jest.fn();
      const plugin = new DefaultPlugin({
        pluginData: {
          initLinkDefinitions: mockInitLinkDefinitions,
          emitEvent: jest.fn(),
        },
        pluginMetadata: {
          parse: mockParse,
        },
      });

      plugin.init();
      expect(mockParse).toBeCalled();
      expect(mockInitLinkDefinitions).toBeCalled();
    });

    it('should create 1 success event log', () => {
      const mockParse = jest.fn();
      const pluginData = new DefaultData();
      const plugin = new DefaultPlugin({
        pluginData,
        pluginMetadata: {
          parse: mockParse,
        },
      });

      pluginData.initLinkDefinitions = jest.fn();

      plugin.init();

      expect(plugin.data.eventLogs.length).toEqual(1);
      expect(plugin.data.eventLogs[0].type).toEqual('Plugin');
      expect(plugin.data.eventLogs[0].action).toEqual('init');
      expect(plugin.data.eventLogs[0].status).toEqual('success');
    });
  });

  describe('Test method: initResources', () => {
    it('should set resources on drawer', () => {
      const plugin = new DefaultPlugin({
        pluginDrawer: {
          resources: {},
        },
      });

      plugin.initResources({ test: 'test' });
      expect(plugin.__drawer.resources).toEqual({ test: 'test' });
    });
  });

  describe('Test method: isParsable', () => {
    it('should call isParsable from parser', () => {
      const mockIsParsable = jest.fn();
      const plugin = new DefaultPlugin({
        pluginParser: {
          isParsable: mockIsParsable,
        },
      });

      plugin.isParsable();
      expect(mockIsParsable).toBeCalled();
    });
  });

  describe('Test method: getModels', () => {
    it('should return an empty array if there are no folders', () => {
      const plugin = new DefaultPlugin({
        pluginParser: {
          getModels: (files) => files,
        },
      });

      expect(plugin.getModels()).toEqual([]);
      expect(plugin.getModels([])).toEqual([]);
    });

    it('should return all folders', () => {
      const plugin = new DefaultPlugin({
        pluginParser: {
          isParsable: ({ path }) => path === 'model',
          getModels: (files) => files.map(({ path }) => path),
        },
      });

      expect(plugin.getModels([
        new FileInformation({ path: 'not a model' }),
        new FileInformation({ path: 'model' }),
      ])).toEqual(['model']);
    });
  });

  describe('Test method: draw', () => {
    it('should call draw method from drawer', () => {
      const mockDraw = jest.fn();
      const plugin = new DefaultPlugin({
        pluginDrawer: {
          draw: mockDraw,
        },
      });

      plugin.draw();
      expect(mockDraw).toBeCalled();
    });
  });

  describe('Test method: parse', () => {
    it('should call parse method from parser', () => {
      const mockParse = jest.fn();
      const mockParseConfiguration = jest.fn();
      const plugin = new DefaultPlugin({
        pluginParser: {
          parse: mockParse,
          parseConfiguration: mockParseConfiguration,
        },
      });

      plugin.parse();
      expect(mockParseConfiguration).toBeCalled();
      expect(mockParse).toBeCalled();
    });

    it('should create 2 success event logs', () => {
      const mockParse = jest.fn();
      const pluginData = new DefaultData();
      const plugin = new DefaultPlugin({
        pluginData,
        pluginMetadata: {
          parse: mockParse,
        },
      });

      plugin.parse({ path: 'diagram' }, { path: 'a' }, [{ path: 'b' }, { path: 'c' }]);

      expect(plugin.data.eventLogs).toEqual([
        expect.objectContaining({
          type: 'Parser',
          action: 'read',
          status: 'success',
          data: {
            global: true,
          },
          files: ['b', 'c', 'a'],
        }),
        expect.objectContaining({
          type: 'Parser',
          action: 'read',
          status: 'warning',
          data: {
            global: false,
            code: 'no_content',
          },
          files: ['a'],
        }),
      ]);
    });
  });

  describe('Test method: render', () => {
    it('should call render method from renderer', () => {
      const mockRender = jest.fn(() => [{ path: 'test' }]);
      const mockRenderConfiguration = jest.fn();
      const plugin = new DefaultPlugin({
        pluginRenderer: {
          render: mockRender,
          renderConfiguration: mockRenderConfiguration,
        },
      });

      const result = plugin.render({ path: 'diagram' }, { path: 'config' });

      expect(result).toEqual([{ path: 'test' }, { path: 'config' }]);
      expect(mockRenderConfiguration).toBeCalled();
      expect(mockRender).toBeCalled();
    });

    it('should create 1 success event log', () => {
      const mockRender = jest.fn(() => ['test']);
      const mockRenderConfiguration = jest.fn();
      const pluginData = new DefaultData();
      const plugin = new DefaultPlugin({
        pluginData,
        pluginRenderer: {
          render: mockRender,
          renderConfiguration: mockRenderConfiguration,
        },
      });

      plugin.render({ path: 'diagram' }, { path: 'a' }, [{ path: 'b' }, { path: 'c' }]);

      expect(plugin.data.eventLogs).toEqual([
        expect.objectContaining({
          type: 'Render',
          action: 'write',
          status: 'success',
          data: {
            global: true,
          },
          files: ['b', 'c', 'a'],
        }),
      ]);
    });
  });
});
