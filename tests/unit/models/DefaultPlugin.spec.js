import DefaultPlugin from 'src/models/DefaultPlugin';
import DefaultData from 'src/models/DefaultData';
import DefaultDrawer from 'src/draw/DefaultDrawer';
import DefaultMetadata from 'src/metadata/DefaultMetadata';
import DefaultParser from 'src/parser/DefaultParser';
import DefaultRender from 'src/render/DefaultRender';

describe('Test class: DefaultPlugin', () => {
  describe('Test constructor', () => {
    it('Check variables instantiation', () => {
      const plugin = new DefaultPlugin();

      expect(plugin.data).toEqual(new DefaultData());
      expect(plugin.__drawer).toEqual(new DefaultDrawer(new DefaultData()));
      expect(plugin.__metadata).toEqual(new DefaultMetadata(new DefaultData()));
      expect(plugin.__parser).toEqual(new DefaultParser(new DefaultData()));
      expect(plugin.__renderer).toEqual(new DefaultRender(new DefaultData()));
    });

    it('Check passing undefined variables to constructor', () => {
      const plugin = new DefaultPlugin({});

      expect(plugin.data).toEqual(new DefaultData());
      expect(plugin.__drawer).toEqual(new DefaultDrawer(new DefaultData()));
      expect(plugin.__metadata).toEqual(new DefaultMetadata(new DefaultData()));
      expect(plugin.__parser).toEqual(new DefaultParser(new DefaultData()));
      expect(plugin.__renderer).toEqual(new DefaultRender(new DefaultData()));
    });

    it('Check passing all variables to constructor', () => {
      const plugin = new DefaultPlugin({
        pluginData: 1,
        pluginDrawer: 2,
        pluginMetadata: 3,
        pluginParser: 4,
        pluginRenderer: 5,
      });

      expect(plugin.data).toEqual(1);
      expect(plugin.__drawer).toEqual(2);
      expect(plugin.__metadata).toEqual(3);
      expect(plugin.__parser).toEqual(4);
      expect(plugin.__renderer).toEqual(5);
    });
  });

  describe('Test methods', () => {
    describe('Test method: init', () => {
      it('Should set events and call validate and parse of metadata', () => {
        const mockSetEvents = jest.fn();
        const mockParse = jest.fn();
        const plugin = new DefaultPlugin({
          pluginDrawer: {
            setEvents: mockSetEvents,
          },
          pluginMetadata: {
            parse: mockParse,
          },
        });

        plugin.init();
        expect(mockSetEvents).toBeCalled();
        expect(mockParse).toBeCalled();
      });
    });

    describe('Test method: initResources', () => {
      it('Should set resources on drawer', () => {
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
      it('Should call isParsable from parser', () => {
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

    describe('Test method: draw', () => {
      it('Should call draw method from drawer', () => {
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
      it('Should call parse method from parser', () => {
        const mockParse = jest.fn();
        const plugin = new DefaultPlugin({
          pluginParser: {
            parse: mockParse,
          },
        });

        plugin.parse();
        expect(mockParse).toBeCalled();
      });
    });

    describe('Test method: render', () => {
      it('Should call render method from renderer', () => {
        const mockRender = jest.fn(() => 'test');
        const plugin = new DefaultPlugin({
          pluginRenderer: {
            render: mockRender,
          },
        });

        const result = plugin.render();

        expect(result).toEqual('test');
        expect(mockRender).toBeCalled();
      });
    });
  });
});
