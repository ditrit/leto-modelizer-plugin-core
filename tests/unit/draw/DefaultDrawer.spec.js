import DefaultDrawer from 'src/draw/DefaultDrawer';
import * as d3 from 'd3';
import DefaultData from 'src/models/DefaultData';
import ComponentLinkDefinition from 'src/models/ComponentLinkDefinition';
import Component from 'src/models/Component';
import ComponentDefinition from 'src/models/ComponentDefinition';
import ComponentAttributeDefinition from 'src/models/ComponentAttributeDefinition';
import ComponentDrawOption from 'src/models/ComponentDrawOption';

jest.mock('d3', () => {
  const mockD3 = {};

  [
    'append', 'attr', 'call', 'data', 'drag', 'classed',
    'each', 'enter', 'exit', 'getBBox', 'on', 'linkHorizontal',
    'remove', 'select', 'selectAll', 'style', 'select',
    'text', 'node', 'html', 'transition', 'duration', 'datum',
    'source', 'target', 'join', 'empty',
  ].forEach((method) => {
    mockD3[method] = jest.fn(() => mockD3);
  });

  return mockD3;
});

describe('Test Class: DefaultDrawer()', () => {
  describe('Test constructor', () => {
    it('Test without arguments', () => {
      const drawer = new DefaultDrawer(new DefaultData());

      expect(drawer.pluginData).toEqual(new DefaultData());
      expect(drawer.rootId).toEqual('root');
      expect(drawer.resources).toBeNull();
      expect(drawer.minWidth).toEqual(230);
      expect(drawer.minHeight).toEqual(50);
      expect(drawer.padding).toEqual(30);
      expect(drawer.margin).toEqual(6);
      expect(drawer.lineLengthPerDepth).toEqual([5, 1]);
    });

    it('Test passing value in constructor', () => {
      const drawer = new DefaultDrawer(new DefaultData(), 'resources', null);

      expect(drawer.pluginData).toEqual(new DefaultData());
      expect(drawer.rootId).toEqual('root');
      expect(drawer.resources).toEqual('resources');
      expect(drawer.minWidth).toEqual(230);
      expect(drawer.minHeight).toEqual(50);
      expect(drawer.padding).toEqual(30);
      expect(drawer.margin).toEqual(6);
      expect(drawer.lineLengthPerDepth).toEqual([5, 1]);
    });

    it('Test passing options in constructor', () => {
      const drawer = new DefaultDrawer(
        new DefaultData(),
        'resources',
        'rootId',
        {
          width: 1,
          height: 2,
          minWidth: 3,
          minHeight: 4,
          padding: 5,
          margin: 7,
          lineLengthPerDepth: [1, 2],
        },
      );

      expect(drawer.pluginData).toEqual(new DefaultData());
      expect(drawer.rootId).toEqual('rootId');
      expect(drawer.resources).toEqual('resources');
      expect(drawer.minWidth).toEqual(3);
      expect(drawer.minHeight).toEqual(4);
      expect(drawer.padding).toEqual(5);
      expect(drawer.margin).toEqual(7);
      expect(drawer.lineLengthPerDepth).toEqual([1, 2]);
    });
  });

  describe('Test method: setupTiles', () => {
    let drawer;
    let data;

    beforeEach(() => {
      drawer = new DefaultDrawer(
        new DefaultData(),
        null,
        'root',
        { maxValuePerLine: [5, 1], padding: 10 },
      );
      data = [{
        items: [{
          children: [{
            height: 0,
            data: {},
            depth: 2,
            value: 1,
          },
          {
            height: 0,
            data: {},
            depth: 2,
            value: 1,
          }],
          depth: 1,
          data: {},
          height: 1,
          parent: null,
          value: 2,
        }, {
          children: [],
          depth: 1,
          data: {},
          height: 0,
          parent: null,
          value: 1,
        }, {
          children: [],
          depth: 1,
          data: {},
          height: 0,
          parent: null,
          value: 1,
        }, {
          children: [],
          depth: 1,
          data: {},
          height: 0,
          parent: null,
          value: 1,
        }],
      }];
    });

    it('Should set x0,y0,x1 and y1 in each item', () => {
      drawer.setupTiles(data);
      data[0].items.forEach((item) => {
        expect(item.x0).toBeDefined();
        expect(item.x1).toBeDefined();
        expect(item.y0).toBeDefined();
        expect(item.y1).toBeDefined();
      });
    });

    it('Should set x0,y0,x1 and y1 to proper values', () => {
      drawer.setupTiles(data);

      expect(data[0].items[0].x0).toEqual(10);
      expect(data[0].items[0].y0).toEqual(10);
      expect(data[0].items[0].x1).toEqual(272);
      expect(data[0].items[0].y1).toEqual(136);

      expect(data[0].items[1].x0).toEqual(282);
      expect(data[0].items[1].y0).toEqual(10);
      expect(data[0].items[1].x1).toEqual(524);
      expect(data[0].items[1].y1).toEqual(60);
    });

    it('Should save the newly computed layout positions', () => {
      drawer.setupTiles(data);

      expect(data[0].items[0].data.drawOption).toBeDefined();
      expect(data[0].items[1].data.drawOption).toBeDefined();

      expect(data[0].items[0].data.drawOption).toEqual(new ComponentDrawOption({
        x: 10,
        y: 10,
        needsResizing: false,
        height: 126,
        width: 262,
      }));
      expect(data[0].items[1].data.drawOption).toEqual(new ComponentDrawOption({
        x: 282,
        y: 10,
        needsResizing: false,
        height: 50,
        width: 242,
      }));
    });

    it('Should not modify manually set coordinates', () => {
      data[0].items[0].data.drawOption = new ComponentDrawOption({
        x: 1,
        y: 1,
        width: 100,
        height: 50,
      });
      data[0].items[1].data.drawOption = new ComponentDrawOption({
        x: 150,
        y: 100,
        width: 100,
        height: 60,
      });

      drawer.setupTiles(data);
      expect(data[0].items[0].x0).toEqual(1);
      expect(data[0].items[0].y0).toEqual(1);
      expect(data[0].items[0].x1).toEqual(101);
      expect(data[0].items[0].y1).toEqual(51);

      expect(data[0].items[1].x0).toEqual(150);
      expect(data[0].items[1].y0).toEqual(100);
      expect(data[0].items[1].x1).toEqual(250);
      expect(data[0].items[1].y1).toEqual(160);
    });
    it(
      `Should only recompute the height and width 
    of a manually positioned component when requested`,
      () => {
        data[0].items[0].data.drawOption = new ComponentDrawOption({
          x: 1,
          y: 1,
          width: 100,
          height: 50,
          needsResizing: true,
        });
        data[0].items[1].data.drawOption = new ComponentDrawOption({
          x: 150,
          y: 100,
          width: 100,
          height: 60,
          needsResizing: true,
        });

        drawer.setupTiles(data);
        expect(data[0].items[0].x0).toEqual(1);
        expect(data[0].items[0].y0).toEqual(1);
        expect(data[0].items[0].x1).toEqual(263);
        expect(data[0].items[0].y1).toEqual(127);

        expect(data[0].items[1].x0).toEqual(150);
        expect(data[0].items[1].y0).toEqual(100);
        expect(data[0].items[1].x1).toEqual(392);
        expect(data[0].items[1].y1).toEqual(150);
      },
    );
  });

  describe('Test method: __getVerticalCoefficient', () => {
    let drawer;

    beforeEach(() => {
      drawer = new DefaultDrawer(new DefaultData(), null, 'root', { maxValuePerLine: [5, 1] });
    });

    it('Should return 0.2 for a non container at root level', () => {
      expect(drawer.__getVerticalCoefficient({
        value: 1,
        depth: 0,
        data: {},
      })).toEqual(0.2);
    });

    it('Should return 1.2 for an empty container at root level', () => {
      expect(drawer.__getVerticalCoefficient({
        value: 1,
        depth: 0,
        data: { definition: { isContainer: true } },
      })).toEqual(1.2);
    });

    it.each([[5, 1], [5, 2], [5, 3], [5, 4]])(
      'Should return 3 with a nested empty container with vals %i,%i',
      (...maxValues) => {
        drawer.maxValuePerLine = maxValues;
        expect(drawer.__getVerticalCoefficient({
          height: 1,
          depth: 1,
          value: 1,
          children: [{
            depth: 2,
            value: 1,
            height: 0,
            data: {
              definition: {
                isContainer: true,
              },
            },
          }],
          data: {
            definition: {
              isContainer: true,
            },
          },
        })).toEqual(3);
      },
    );

    it('Should properly handle nested data', () => {
      expect(drawer.__getVerticalCoefficient({
        value: 2,
        depth: 0,
        height: 1,
        children: [{
          value: 1,
          depth: 1,
          height: 0,
          data: { definition: { isContainer: true } },
        }, {
          value: 1,
          depth: 1,
          height: 0,
          data: { definition: { isContainer: true } },
        }],
        data: { definition: { isContainer: true } },
      })).toEqual(5);

      expect(drawer.__getVerticalCoefficient({
        value: 3,
        depth: 0,
        height: 2,
        children: [{
          value: 1,
          depth: 1,
          height: 1,
          children: [{
            value: 1,
            depth: 2,
            height: 0,
          }],
          data: { definition: { isContainer: true } },
        }, {
          value: 1,
          depth: 1,
          height: 0,
          data: { definition: { isContainer: true } },
        }],
        data: { definition: { isContainer: true } },
      })).toEqual(5);
    });
  });

  describe('Test method: __buildLines', () => {
    let drawer;
    let data;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      data = {
        children: [{
          children: [{
            height: 0,
            depth: 2,
            value: 1,
            data: {},
          },
          {
            height: 0,
            depth: 2,
            value: 1,
            data: {},
          }],
          depth: 1,
          height: 1,
          parent: null,
          value: 2,
          data: {},
        }, {
          children: [],
          depth: 1,
          height: 0,
          parent: null,
          value: 1,
          data: {},
        }, {
          children: [],
          depth: 1,
          height: 0,
          parent: null,
          value: 1,
          data: {},
        }, {
          children: [],
          depth: 1,
          height: 0,
          parent: null,
          value: 1,
          data: {},
        }],
        depth: 0,
        height: 2,
        parent: null,
        data: {},
        value: 5,
      };
    });

    it('Should build the correct amount of lines', () => {
      expect(drawer.__buildLines(data.children, data.depth).length).toEqual(1);
      expect(drawer.__buildLines(
        data.children[0].children,
        data.children[0].depth,
      ).length).toEqual(2);
    });

    it('Should correctly set the items in the lines', () => {
      expect(drawer.__buildLines(data.children, data.depth)[0].items).toEqual(data.children);
      expect(drawer.__buildLines(data.children[0].children, data.children[0].depth)[0].items[0])
        .toEqual(data.children[0].children[0]);
      expect(drawer.__buildLines(data.children[0].children, data.children[0].depth)[1].items[0])
        .toEqual(data.children[0].children[1]);
    });
  });

  describe('Test method: getMaxValueForDepth', () => {
    it('Should return the defined value for a given depth', () => {
      const drawer = new DefaultDrawer(
        new DefaultData(),
        null,
        'root',
        { lineLengthPerDepth: [4, 3, 2, 1] },
      );

      expect(drawer.getLineLengthForDepth(0)).toEqual(4);
      expect(drawer.getLineLengthForDepth(1)).toEqual(3);
      expect(drawer.getLineLengthForDepth(2)).toEqual(2);
      expect(drawer.getLineLengthForDepth(3)).toEqual(1);
    });

    it('Should return the last valid value if not explicitely defined', () => {
      const drawer = new DefaultDrawer(
        new DefaultData(),
        null,
        'root',
        { lineLengthPerDepth: [4, 3, 2, 1] },
      );

      expect(drawer.getLineLengthForDepth(5)).toEqual(1);
      drawer.lineLengthPerDepth = [4];
      expect(drawer.getLineLengthForDepth(6)).toEqual(4);
    });

    it('Should use override value when provided', () => {
      const drawer = new DefaultDrawer(
        new DefaultData(),
        null,
        'root',
        { lineLengthPerDepth: [4] },
      );

      expect(drawer.getLineLengthForDepth(5, 1)).toEqual(1);
      expect(drawer.getLineLengthForDepth(5, 5)).toEqual(5);
      expect(drawer.getLineLengthForDepth(5, Infinity)).toEqual(Infinity);
    });
  });

  describe('Test method: findInsertionPosition', () => {
    let drawer;
    let parentNode;
    let event;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      parentNode = {
        data: {
          definition: {
            displayType: 'workflow',
          },
        },
        x0: 0,
        y0: 0,
        children: [
          {
            data: { id: '1' }, x0: 50, x1: 100, y0: 50, y1: 100,
          },
          {
            data: { id: '2' }, x0: 150, x1: 200, y0: 50, y1: 100,
          },
          {
            data: { id: '3' }, x0: 250, x1: 300, y0: 50, y1: 100,
          },
        ],

      };
      event = {
        subject: {
        },
      };
    });

    it('Should handle movement within the same container', () => {
      event.subject.parent = parentNode;
      event.x = 125;
      event.y = 75;
      expect(drawer.findInsertionPosition(parentNode, event))
        .toEqual({
          data: { id: '1' }, x0: 50, x1: 100, y0: 50, y1: 100,
        });

      event.x = 350;
      expect(drawer.findInsertionPosition(parentNode, event))
        .toEqual({
          data: { id: '3' }, x0: 250, x1: 300, y0: 50, y1: 100,
        });

      event.x = 20;
      expect(drawer.findInsertionPosition(parentNode, event))
        .toEqual(null);

      parentNode.children = [
        {
          data: { id: '1' }, x0: 50, x1: 100, y0: 50, y1: 100,
        },
        {
          data: { id: '2' }, x0: 50, x1: 100, y0: 150, y1: 200,
        },
        {
          data: { id: '3' }, x0: 50, x1: 100, y0: 250, y1: 300,
        },
      ];
      event.y = 125;
      expect(drawer.findInsertionPosition(parentNode, event))
        .toEqual({
          data: { id: '1' }, x0: 50, x1: 100, y0: 50, y1: 100,
        });

      event.y = 350;
      expect(drawer.findInsertionPosition(parentNode, event))
        .toEqual({
          data: { id: '3' }, x0: 50, x1: 100, y0: 250, y1: 300,
        });

      event.y = 50;
      expect(drawer.findInsertionPosition(parentNode, event))
        .toEqual(null);
    });

    it('Should handle movement between two different containers', () => {
      event.subject.parent = {
        x0: 1000,
        y0: 1000,
      };
      event.x = -825;
      event.y = -925;
      expect(drawer.findInsertionPosition(parentNode, event))
        .toEqual({
          data: { id: '1' }, x0: 50, x1: 100, y0: 50, y1: 100,
        });

      event.x = -625;
      expect(drawer.findInsertionPosition(parentNode, event))
        .toEqual({
          data: { id: '3' }, x0: 250, x1: 300, y0: 50, y1: 100,
        });

      event.x = -950;
      expect(drawer.findInsertionPosition(parentNode, event))
        .toEqual(null);

      parentNode.children = [
        {
          data: { id: '1' }, x0: 50, x1: 100, y0: 50, y1: 100,
        },
        {
          data: { id: '2' }, x0: 50, x1: 100, y0: 150, y1: 200,
        },
        {
          data: { id: '3' }, x0: 50, x1: 100, y0: 250, y1: 300,
        },
      ];
      event.x = -925;
      event.y = -875;
      expect(drawer.findInsertionPosition(parentNode, event))
        .toEqual({
          data: { id: '1' }, x0: 50, x1: 100, y0: 50, y1: 100,
        });

      event.y = -625;
      expect(drawer.findInsertionPosition(parentNode, event))
        .toEqual({
          data: { id: '3' }, x0: 50, x1: 100, y0: 250, y1: 300,
        });

      event.y = -950;
      expect(drawer.findInsertionPosition(parentNode, event))
        .toEqual(null);
    });
  });

  describe('Test actions', () => {
    let drawer;

    beforeEach(() => {
      drawer = new DefaultDrawer(new DefaultData());
    });

    describe('Test action: __unselectComponent', () => {
      it('On no selected component Should do nothing', () => {
        d3.empty.mockReturnValue(false);
        drawer.actions.selection.current = null;
        drawer.__unselectComponent();

        expect(drawer.actions.selection.current).toBeNull();
        expect(d3.empty).not.toBeCalled();
        expect(d3.classed).not.toBeCalled();
        expect(d3.select).not.toBeCalled();
        expect(d3.style).not.toBeCalled();
      });

      it('On selected component is [null]', () => {
        d3.empty.mockReturnValue(true);
        drawer.actions.selection.current = new Component({});
        drawer.__unselectComponent();

        expect(drawer.actions.selection.current).toBeNull();
        expect(d3.empty).toBeCalledTimes(1);
        expect(d3.classed).not.toBeCalled();
        expect(d3.select).toBeCalledTimes(1);
        expect(d3.style).not.toBeCalled();
      });

      it('On selected component Should unselect it', () => {
        d3.empty.mockReturnValue(false);
        drawer.actions.selection.current = new Component({});
        drawer.__unselectComponent();

        expect(drawer.actions.selection.current).toBeNull();
        expect(d3.empty).toBeCalledTimes(2);
        expect(d3.classed).toBeCalledTimes(2);
        expect(d3.select).toBeCalled();
        expect(d3.style).toBeCalled();
      });
    });
  });

  describe('Test method: createLink', () => {
    let drawer;
    let data;

    beforeEach(() => {
      data = new DefaultData();
      data.components = [
        new Component({
          id: 'cmp1',
          definition: new ComponentDefinition({
            type: 'type1',
            definedAttributes: [
              new ComponentAttributeDefinition(
                {
                  name: 'testAttr',
                  type: 'Link',
                  linkRef: 'type2',
                },
              )],
          }),
        }),
        new Component({
          id: 'cmp2',
          definition: new ComponentDefinition({
            type: 'type2',
          }),
        }),
        new Component({
          id: 'cmp3',
          definition: new ComponentDefinition({
            type: 'type3',
            definedAttributes: [
              new ComponentAttributeDefinition({
                name: 'testAttr',
                type: 'Link',
                linkRef: 'type2',
              })],
          }),
        }),
      ];
      data.definitions = {
        links: [new ComponentLinkDefinition({
          attributeRef: 'testAttr',
          sourceRef: 'type1',
          targetRef: 'type2',
          type: 'Default',
        })],
      };
      drawer = new DefaultDrawer(data);

      drawer.actions.linkCreation = {
        creating: true,
        source: data.components[0],
        target: data.components[1],
      };
      drawer.unsetAllDisabledStyles = jest.fn();
      drawer.drawLinks = jest.fn();
    });

    it('Should create a link with the proper definition', () => {
      drawer.createLink();
      const links = data.getLinks();

      expect(links.length).toBe(1);
      expect(links[0])
        .toEqual(expect.objectContaining({ definition: data.definitions.links[0] }));
    });

    it('Should create a link between the correct components', () => {
      drawer.createLink();
      const links = data.getLinks();

      expect(links.length).toBe(1);
      expect(links[0]).toEqual(
        expect.objectContaining({
          source: data.components[0].id,
          target: data.components[1].id,
        }),
      );
    });

    it('Should properly set the link attribute in the source component', () => {
      drawer.createLink();
      expect(data.components[0].attributes[0]).toEqual(
        expect.objectContaining({
          name: 'testAttr',
          value: [data.components[1].id],
        }),
      );
    });

    it('Should cleanup once the links are created', () => {
      drawer.createLink();
      expect(drawer.actions.linkCreation).toEqual(expect.objectContaining({
        creating: false,
        source: null,
        target: null,
      }));
      expect(drawer.unsetAllDisabledStyles).toHaveBeenCalled();
    });

    it('Should re-draw the links', () => {
      drawer.createLink();
      expect(drawer.drawLinks).toHaveBeenCalled();
    });
  });

  describe('Test method: getMenuActions', () => {
    let drawer;

    beforeEach(() => {
      drawer = new DefaultDrawer(new DefaultData());
    });

    it('Should use the class name to find the actions', () => {
      expect(drawer.getMenuActions({ classed: () => true }))
        .toEqual(
          expect.arrayContaining([
            expect.objectContaining({ id: 'create-link' }),
            expect.objectContaining({ id: 'remove-component' }),
          ]),
        );

      expect(drawer.getMenuActions({ classed: () => false })).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: 'remove-link' })]),
      );
    });
  });

  describe('Test method: __markAsNeedingResize', () => {
    let drawer;

    beforeEach(() => {
      drawer = new DefaultDrawer();
    });

    it('Should flag the starting node', () => {
      const startNode = { data: { drawOption: new ComponentDrawOption() } };

      drawer.__markAsNeedingResize(startNode);
      expect(startNode.data.drawOption.needsResizing).toEqual(true);
    });

    it('Should flag the parent nodes', () => {
      const n3 = { data: { drawOption: new ComponentDrawOption() } };
      const n2 = { parent: n3, data: { drawOption: new ComponentDrawOption() } };
      const n1 = { parent: n2, data: { drawOption: new ComponentDrawOption() } };

      drawer.__markAsNeedingResize(n1);
      expect(n1.data.drawOption.needsResizing).toEqual(true);
      expect(n2.data.drawOption.needsResizing).toEqual(true);
      expect(n3.data.drawOption.needsResizing).toEqual(true);
    });

    it('Should skip nodes without drawOption but still flag their parents', () => {
      const n3 = { data: { drawOption: new ComponentDrawOption() } };
      const n2 = { parent: n3, data: { } };
      const n1 = { parent: n2, data: { } };

      drawer.__markAsNeedingResize(n1);
      expect(n1.data.drawOption).toBeFalsy();
      expect(n2.data.drawOption).toBeFalsy();
      expect(n3.data.drawOption.needsResizing).toEqual(true);
    });
  });

  describe('Test method: getBearing', () => {
    let drawer;

    beforeEach(() => {
      drawer = new DefaultDrawer();
    });

    it('Should return 0 when the second component is below the first', () => {
      expect(drawer.getBearing({
        x: 100,
        y: 100,
      }, {
        x: 100,
        y: 200,
      })).toEqual(expect.closeTo(0));
    });

    it('Should return 180 when the second component is above the first', () => {
      expect(drawer.getBearing({
        x: 100,
        y: 200,
      }, {
        x: 100,
        y: 100,
      })).toEqual(expect.closeTo(180));
    });

    it('Should return 90 when the second component is right of the first', () => {
      expect(drawer.getBearing({
        x: 100,
        y: 100,
      }, {
        x: 200,
        y: 100,
      })).toEqual(expect.closeTo(90));
    });

    it('Should return 270 when the second component is left of the first', () => {
      expect(drawer.getBearing({
        x: 200,
        y: 100,
      }, {
        x: 100,
        y: 100,
      })).toEqual(expect.closeTo(270));
    });

    it('Should support negative coordinates', () => {
      expect(drawer.getBearing({
        x: -200,
        y: -100,
      }, {
        x: -100,
        y: -100,
      })).toEqual(expect.closeTo(90));
    });
  });

  describe('Test method: getComponentHeight', () => {
    let component;
    let drawer;

    beforeEach(() => {
      drawer = new DefaultDrawer(new DefaultData());
      component = {
        id: 'test',
        data: new Component({
          id: 'test',
          drawOption: new ComponentDrawOption({
            sizeManuallySet: false,
            height: 0,
          }),
          definition: new ComponentDefinition({
            isContainer: false,
          }),
        }),
        depth: 0,
        children: null,
      };
    });

    it('Should ignore shadowRoot', () => {
      component.id = '__shadowRoot';
      expect(drawer.getComponentHeight(component)).toEqual(0);
    });

    it('Should correctly compute height without children', () => {
      expect(drawer.getComponentHeight(component)).toEqual(drawer.minHeight);
      component.data.definition.isContainer = true;
      expect(drawer.getComponentHeight(component))
        .toEqual(2 * drawer.minHeight + drawer.padding + drawer.margin);
    });

    it('Should correctly compute height with children', () => {
      component.data.definition.isContainer = true;
      component.children = [
        { depth: 1, y1: 3 * (drawer.minHeight + drawer.padding) },
        { depth: 1, y1: 4 * (drawer.minHeight + drawer.padding) },
        { depth: 1, y1: 5 * (drawer.minHeight + drawer.padding) },
      ];
      expect(drawer.getComponentHeight(component))
        .toEqual(component.children[2].y1 + drawer.minHeight + drawer.padding + drawer.margin);
    });
  });

  describe('Test method: getComponentWidth', () => {
    let component;
    let drawer;

    beforeEach(() => {
      drawer = new DefaultDrawer(new DefaultData());
      component = {
        id: 'test',
        data: new Component({
          id: 'test',
          drawOption: new ComponentDrawOption({
            sizeManuallySet: false,
            height: 0,
          }),
          definition: new ComponentDefinition({
            isContainer: false,
          }),
        }),
        children: null,
      };
    });

    it('Should ignore shadowRoot', () => {
      component.id = '__shadowRoot';
      expect(drawer.getComponentWidth(component)).toEqual(0);
    });

    it('Should correctly compute width without children', () => {
      expect(drawer.getComponentWidth(component)).toEqual(drawer.minWidth);
      component.data.definition.isContainer = true;
      expect(drawer.getComponentWidth(component))
        .toEqual(drawer.minWidth);
    });

    it('Should correctly compute width with children', () => {
      component.data.definition.isContainer = true;
      component.children = [
        { x1: drawer.minWidth + drawer.padding },
        { x1: 2 * drawer.minWidth + drawer.padding },
        { x1: 3 * drawer.minWidth + drawer.padding },
      ];
      expect(drawer.getComponentWidth(component))
        .toEqual(component.children[2].x1 + drawer.padding + drawer.margin);
    });
  });

  describe('Test method: initializeComponentDrawOption ', () => {
    let drawer;
    let component;

    beforeEach(() => {
      drawer = new DefaultDrawer(new DefaultData());
      component = {
        value: 1,
        height: 0,
        depth: 0,
        data: new Component({
          definition: new ComponentDefinition({ isContainer: false }),
        }),
      };
    });

    it('Should initialize the component\'s draw options', () => {
      drawer.initializeComponentDrawOptions(component);
      expect(component.data.drawOption).toBeDefined();
    });

    it('Should pre-compute the component\'s dimensions', () => {
      drawer.initializeComponentDrawOptions(component);
      expect(component.data.drawOption.width).toEqual(drawer.minWidth + 2 * drawer.margin);
      expect(component.data.drawOption.height).toEqual(drawer.minHeight);
    });
  });

  describe('Test method: __isInverted', () => {
    let drawer;
    let parentNode;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      parentNode = {
        children: [
          { data: { id: '1' } },
          { data: { id: '2' } },
          { data: { id: '3' } },
        ],
      };
    });

    it('Should return true if the left component index is greater than the right', () => {
      expect(
        drawer.__isInverted(parentNode, { data: { id: '3' } }, { data: { id: '2' } }),
      ).toEqual(true);
      expect(
        drawer.__isInverted(parentNode, { data: { id: '2' } }, { data: { id: '1' } }),
      ).toEqual(true);
    });

    it('Should return true if the right component is the last in the list', () => {
      expect(
        drawer.__isInverted(parentNode, null, { data: { id: '3' } }),
      ).toEqual(true);
    });

    it(
      'Should return false if the left index is smaller or the right component doesn\'t exist',
      () => {
        expect(
          drawer.__isInverted(parentNode, { data: { id: '3' } }, null),
        ).toEqual(false);
        expect(
          drawer.__isInverted(parentNode, null, { data: { id: '1' } }),
        ).toEqual(false);
        expect(
          drawer.__isInverted(parentNode, { data: { id: '2' } }, { data: { id: '3' } }),
        ).toEqual(false);
      },
    );
  });

  describe('Test method: __fillMissingBracket', () => {
    let drawer;
    let parentNode;
    let bracketingComponents;

    beforeEach(() => {
      drawer = new DefaultDrawer();
      bracketingComponents = {
        componentLeft: null,
        componentRight: null,
      };
      parentNode = {
        children: [
          { data: { id: '1' } },
          { data: { id: '2' } },
          { data: { id: '3' } },
        ],
      };
    });

    it('Should not change an already set left hand component', () => {
      const subject = { data: { id: '2' } };

      bracketingComponents.componentLeft = { data: { id: '3' } };

      drawer.__fillMissingBracket(parentNode, bracketingComponents, subject);
      expect(bracketingComponents).toEqual({
        componentLeft: { data: { id: '3' } },
        componentRight: null,
      });
    });

    it('Should load the previous component into the left slot', () => {
      const subject = { data: { id: '4' } };

      bracketingComponents.componentRight = { data: { id: '3' } };

      drawer.__fillMissingBracket(parentNode, bracketingComponents, subject);
      expect(bracketingComponents).toEqual({
        componentLeft: { data: { id: '2' } },
        componentRight: { data: { id: '3' } },
      });
    });

    it('Should load the component before the subject if the subject is bracketed', () => {
      const subject = { data: { id: '2' } };

      bracketingComponents.componentRight = { data: { id: '3' } };

      drawer.__fillMissingBracket(parentNode, bracketingComponents, subject);
      expect(bracketingComponents).toEqual({
        componentLeft: { data: { id: '1' } },
        componentRight: { data: { id: '3' } },
      });
    });
    it('Should do nothing if the right hand component is the first child', () => {
      const subject = { data: { id: '4' } };

      bracketingComponents.componentRight = { data: { id: '1' } };

      drawer.__fillMissingBracket(parentNode, bracketingComponents, subject);
      expect(bracketingComponents).toEqual({
        componentLeft: null,
        componentRight: { data: { id: '1' } },
      });
    });
  });
});
