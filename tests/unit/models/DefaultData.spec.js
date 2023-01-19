import DefaultData from 'src/models/DefaultData';
import { version as CORE_VERSION } from 'package.json';
import ComponentDefinition from 'src/models/ComponentDefinition';
import Component from 'src/models/Component';
import ComponentAttribute from 'src/models/ComponentAttribute';
import ComponentAttributeDefinition from 'src/models/ComponentAttributeDefinition';
import ComponentLink from 'src/models/ComponentLink';
import ComponentLinkDefinition from 'src/models/ComponentLinkDefinition';

describe('Test class: DefaultData', () => {
  describe('Test constructor', () => {
    it('Check variables instantiation', () => {
      const pluginData = new DefaultData();

      expect(pluginData.name).toBeNull();
      expect(pluginData.version).toBeNull();
      expect(pluginData.components).toEqual([]);
      expect(pluginData.parseErrors).toEqual([]);
      expect(pluginData.definitions).toEqual({ components: [], links: [] });
    });

    it('Check passing undefined variables to constructor', () => {
      let pluginData = new DefaultData({});

      expect(pluginData.name).toBeNull();
      expect(pluginData.version).toBeNull();
      expect(pluginData.components).toEqual([]);
      expect(pluginData.parseErrors).toEqual([]);
      expect(pluginData.definitions).toEqual({ components: [], links: [] });

      pluginData = new DefaultData({ definitions: {} });
      expect(pluginData.definitions).toEqual({ components: [], links: [] });
    });

    it('Check passing all variables to constructor', () => {
      const pluginData = new DefaultData({
        name: 'name',
        version: 'version',
        components: [0],
        parseErrors: [2],
        definitions: {
          components: [3],
          links: [4],
        },
      });

      expect(pluginData.name).toEqual('name');
      expect(pluginData.version).toEqual('version');
      expect(pluginData.components).toEqual([0]);
      expect(pluginData.parseErrors).toEqual([2]);
      expect(pluginData.definitions).toEqual({ components: [3], links: [4] });
    });
  });

  describe('Test getters', () => {
    describe('Test getter: coreVersion', () => {
      it('should be equal to the version in package.json', () => {
        expect(CORE_VERSION).not.toBeNull();
        expect(new DefaultData().coreVersion).toEqual(CORE_VERSION);
      });
    });
  });

  describe('Test methods', () => {
    describe('Test method: removeLink', () => {
      it('Should remove default link', () => {
        const pluginData = new DefaultData();

        pluginData.components.push(new Component({
          id: 'test',
          name: 'test',
          attributes: [new ComponentAttribute({
            name: 'link',
            value: ['link1'],
            definition: new ComponentAttributeDefinition({
              type: 'Link',
            }),
          })],
        }));

        pluginData.removeLink(new ComponentLink({
          source: 'test',
          target: 'link1',
          definition: new ComponentLinkDefinition({ attributeRef: 'link' }),
        }));

        expect(pluginData.components[0].attributes).toEqual([]);
      });

      it('Should remove reverse link', () => {
        const pluginData = new DefaultData();

        pluginData.components.push(new Component({
          id: 'test',
          name: 'test',
          attributes: [new ComponentAttribute({
            name: 'link',
            value: ['link1'],
            definition: new ComponentAttributeDefinition({
              type: 'Link',
            }),
          })],
        }));

        pluginData.removeLink(new ComponentLink({
          source: 'test',
          target: 'link1',
          definition: new ComponentLinkDefinition({ attributeRef: 'link', type: 'Reverse' }),
        }));

        expect(pluginData.components[0].attributes).toEqual([]);
      });
    });

    describe('Test method: addComponent', () => {
      it('Should create new component and add it to the components list', () => {
        const pluginData = new DefaultData();

        expect(pluginData.components).toEqual([]);

        const definition = new ComponentDefinition();

        pluginData.addComponent('test', definition);
        expect(pluginData.components).toEqual([
          new Component({
            id: 'test',
            name: 'test',
            definition,
          }),
        ]);
      });
    });

    describe('Test method: initLinkDefinitions', () => {
      it('Should init link definitions', () => {
        const pluginData = new DefaultData();

        pluginData.definitions.components = [
          new ComponentDefinition({
            type: 'server',
            definedAttributes: [
              new ComponentAttributeDefinition({
                name: 'link1',
                type: 'Link',
                linkRef: 'laptop1',
                linkType: 'Default',
              }),
              new ComponentAttributeDefinition({
                name: 'link2',
                type: 'Link',
                linkRef: 'laptop2',
                linkType: 'Reverse',
              }),
              new ComponentAttributeDefinition({
                name: 'notALink',
                type: 'String',
              }),
              new ComponentAttributeDefinition({
                name: 'object',
                type: 'Object',
                definedAttributes: [
                  new ComponentAttributeDefinition({
                    name: 'link3',
                    type: 'Link',
                    linkRef: 'laptop3',
                    linkType: 'Default',
                  }),
                ],
              }),
            ],
          }),
        ];

        pluginData.initLinkDefinitions();

        expect(pluginData.definitions.links).toEqual([
          new ComponentLinkDefinition({
            attributeRef: 'link1',
            sourceRef: 'server',
            targetRef: 'laptop1',
            type: 'Default',
          }),
          new ComponentLinkDefinition({
            attributeRef: 'link2',
            sourceRef: 'server',
            targetRef: 'laptop2',
            type: 'Reverse',
          }),
          new ComponentLinkDefinition({
            attributeRef: 'link3',
            sourceRef: 'server',
            targetRef: 'laptop3',
            type: 'Default',
          }),
        ]);
      });
    });

    describe('Test method: getLinks', () => {
      it('Should return all links', () => {
        const pluginData = new DefaultData();
        const linkDefinition1 = new ComponentAttributeDefinition({
          name: 'link1',
          type: 'Link',
          linkRef: 'server',
          linkType: 'Default',
        });
        const linkDefinition2 = new ComponentAttributeDefinition({
          name: 'link2',
          type: 'Link',
          linkRef: 'server',
          linkType: 'Reverse',
        });
        const linkDefinition3 = new ComponentAttributeDefinition({
          name: 'link3',
          type: 'Link',
          linkRef: 'server',
          linkType: 'Default',
        });
        const notALinkDefinition = new ComponentAttributeDefinition({
          name: 'notALink',
          type: 'String',
        });
        const objectDefinition = new ComponentAttributeDefinition({
          name: 'object',
          type: 'Object',
          definedAttributes: [linkDefinition3],
        });
        const serverDefinition = new ComponentDefinition({
          type: 'server',
          definedAttributes: [
            linkDefinition1,
            linkDefinition2,
            notALinkDefinition,
            objectDefinition,
          ],
        });

        pluginData.definitions.components = [serverDefinition];

        pluginData.initLinkDefinitions();

        pluginData.components = [
          new Component({
            definition: serverDefinition,
            id: 'server1',
            attributes: [new ComponentAttribute({
              definition: linkDefinition1,
              name: 'link1',
              value: ['server2'],
              type: 'Array',
            })],
          }),
          new Component({
            definition: serverDefinition,
            id: 'server2',
            attributes: [new ComponentAttribute({
              definition: linkDefinition2,
              name: 'link2',
              value: ['server1'],
              type: 'Array',
            })],
          }),
          new Component({
            definition: serverDefinition,
            id: 'server3',
            attributes: [new ComponentAttribute({
              definition: objectDefinition,
              name: 'object',
              type: 'Object',
              value: [new ComponentAttribute({
                definition: linkDefinition3,
                name: 'link3',
                value: ['server2'],
                type: 'Array',
              })],
            })],
          }),
        ];

        expect(pluginData.getLinks()).toEqual([
          new ComponentLink({
            definition: pluginData.definitions.links[0],
            source: 'server1',
            target: 'server2',
          }),
          new ComponentLink({
            definition: pluginData.definitions.links[1],
            source: 'server2',
            target: 'server1',
          }),
          new ComponentLink({
            definition: pluginData.definitions.links[2],
            source: 'server3',
            target: 'server2',
          }),
        ]);
      });
    });

    describe('Test method: getComponentsByType', () => {
      it('Should return empty array on unknown type', () => {
        const pluginData = new DefaultData();

        pluginData.components = [new Component({
          definition: new ComponentDefinition({ type: 'test' }),
        })];
        expect(pluginData.getComponentsByType('unknown')).toEqual([]);
      });

      it('Should return wanted components', () => {
        const pluginData = new DefaultData();
        const notTest = new Component({
          definition: new ComponentDefinition({ type: 'notTest' }),
          id: 'notTest',
        });
        const test2 = new Component({
          definition: new ComponentDefinition({ type: 'test' }),
          id: 'test2',
        });
        const test1 = new Component({
          definition: new ComponentDefinition({ type: 'test' }),
          id: 'test1',
        });

        pluginData.components = [test1, notTest, test2];
        expect(pluginData.getComponentsByType('test')).toEqual([test1, test2]);
      });
    });

    describe('Test method: getComponentById', () => {
      it('Should return null on unknown id', () => {
        const pluginData = new DefaultData();

        expect(pluginData.getComponentById('bad')).toBeNull();
      });

      it('Should return the component corresponding to the given id', () => {
        const definition = new ComponentDefinition();
        const pluginData = new DefaultData();

        pluginData.addComponent('test', definition);
        pluginData.addComponent('test2', definition);

        expect(pluginData.getComponentById('test2')).toEqual(new Component({
          id: 'test2',
          name: 'test2',
          definition,
        }));
      });
    });

    describe('Test method: removeComponentById', () => {
      it('Should remove the component corresponding to the given id', () => {
        const definition = new ComponentDefinition();
        const pluginData = new DefaultData();

        pluginData.addComponent('test', definition);
        pluginData.addComponent('test2', definition);

        pluginData.removeComponentById('test');
        expect(pluginData.components).toEqual([
          new Component({
            id: 'test2',
            name: 'test2',
            definition,
          }),
        ]);

        pluginData.removeComponentById('test2');
        expect(pluginData.components).toEqual([]);
      });

      it('Should do nothing on unknown id', () => {
        const definition = new ComponentDefinition();
        const pluginData = new DefaultData();

        pluginData.addComponent('test', definition);
        pluginData.addComponent('test2', definition);

        pluginData.removeComponentById('unknown');
        expect(pluginData.components).toEqual([
          new Component({
            id: 'test',
            name: 'test',
            definition,
          }),
          new Component({
            id: 'test2',
            name: 'test2',
            definition,
          }),
        ]);
      });

      it('Should remove the sub-component corresponding to the given id', () => {
        const definition = new ComponentDefinition({
          name: 'server',
          definedAttributes: [new ComponentAttributeDefinition({
            name: 'test',
            type: 'Reference',
            containerRef: 'server',
          })],
        });
        const pluginData = new DefaultData();

        pluginData.addComponent('root', definition);
        pluginData.addComponent('child', definition);
        pluginData.addComponent('subChild', definition);
        pluginData.getComponentById('root')
          .setReferenceAttribute(pluginData.getComponentById('child'));
        pluginData.getComponentById('child')
          .setReferenceAttribute(pluginData.getComponentById('subChild'));

        pluginData.removeComponentById('subChild');
        expect(pluginData.components).toEqual([
          new Component({
            id: 'root',
            name: 'root',
            definition,
          }),
          new Component({
            id: 'child',
            name: 'child',
            definition,
          }),
        ]);

        pluginData.removeComponentById('child');
        expect(pluginData.components).toEqual([
          new Component({
            id: 'root',
            name: 'root',
            definition,
          }),
        ]);
      });

      it('Should remove Link attribute of component', () => {
        const definition = new ComponentDefinition();
        const pluginData = new DefaultData();

        pluginData.addComponent('root', definition);
        pluginData.addComponent('child', definition);
        pluginData.addComponent('subChild', definition);
        pluginData.addComponent('otherChild', definition);

        const rootAttribute = new ComponentAttribute({
          value: ['child', 'subChild'],
          definition: new ComponentAttributeDefinition({ type: 'Link' }),
        });

        const childAttribute = new ComponentAttribute({
          value: ['subChild'],
          definition: new ComponentAttributeDefinition({ type: 'Link' }),
        });

        const otherChildAttribute = new ComponentAttribute({
          value: ['test'],
          definition: new ComponentAttributeDefinition({ type: 'Link' }),
        });

        pluginData.components[0].attributes.push(rootAttribute);
        pluginData.components[1].attributes.push(childAttribute);
        pluginData.components[3].attributes.push(otherChildAttribute);

        pluginData.removeComponentById('subChild');
        expect(pluginData.components).toEqual([
          new Component({
            id: 'root',
            name: 'root',
            attributes: [new ComponentAttribute({
              value: ['child'],
              definition: new ComponentAttributeDefinition({ type: 'Link' }),
            })],
            definition,
          }),
          new Component({
            id: 'child',
            name: 'child',
            definition,
          }),
          new Component({
            id: 'otherChild',
            name: 'otherChild',
            attributes: [new ComponentAttribute({
              value: ['test'],
              definition: new ComponentAttributeDefinition({ type: 'Link' }),
            })],
            definition,
          }),
        ]);

        pluginData.removeComponentById('child');
        expect(pluginData.components).toEqual([
          new Component({
            id: 'root',
            name: 'root',
            definition,
          }),
          new Component({
            id: 'otherChild',
            name: 'otherChild',
            attributes: [new ComponentAttribute({
              value: ['test'],
              definition: new ComponentAttributeDefinition({ type: 'Link' }),
            })],
            definition,
          }),
        ]);
      });

      it('Should remove all child components on removing container component', () => {
        const definition = new ComponentDefinition();
        const pluginData = new DefaultData();

        pluginData.addComponent('root', definition);
        pluginData.addComponent('child', definition);
        pluginData.addComponent('subChild', definition);

        pluginData.components[1].attributes = [new ComponentAttribute({
          name: 'test',
          value: 'root',
          definition: new ComponentAttributeDefinition({ name: 'test', type: 'Reference' }),
        })];

        pluginData.components[2].attributes = [new ComponentAttribute({
          name: 'test',
          value: 'child',
          definition: new ComponentAttributeDefinition({ name: 'test', type: 'Reference' }),
        })];

        pluginData.removeComponentById('root');
        expect(pluginData.components).toEqual([]);
      });

      it('Should do nothing on unknown id', () => {
        const pluginData = new DefaultData();

        pluginData.addComponent('root', new ComponentDefinition());
        pluginData.components[0].attributes.push(new ComponentAttribute({
          value: 'test',
          definition: new ComponentAttributeDefinition({ type: 'String' }),
        }));

        pluginData.components[0].attributes.push(new ComponentAttribute({
          value: 'test',
        }));

        pluginData.removeComponentById('child');
        expect(pluginData.components).toEqual([
          new Component({
            id: 'root',
            name: 'root',
            attributes: [
              new ComponentAttribute({
                value: 'test',
                definition: new ComponentAttributeDefinition({ type: 'String' }),
              }),
              new ComponentAttribute({
                value: 'test',
              }),
            ],
            definition: new ComponentDefinition(),
          }),
        ]);
      });
    });

    describe('Test method: __moveComponentToIndex', () => {
      let pluginData;

      beforeEach(() => {
        pluginData = new DefaultData();
        pluginData.components = [
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
          { id: '5' },
        ];
      });

      it('Should do nothing when the component is already at the correct index', () => {
        pluginData.__moveComponentToIndex('3', 2);

        expect(pluginData.components).toEqual([
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
          { id: '5' },
        ]);
      });

      it('Should properly handle smaller indexes', () => {
        pluginData.__moveComponentToIndex('4', 1);

        expect(pluginData.components).toEqual([
          { id: '1' },
          { id: '4' },
          { id: '2' },
          { id: '3' },
          { id: '5' },
        ]);
      });

      it('Should properly handle greater indexes', () => {
        pluginData.__moveComponentToIndex('2', 3);

        expect(pluginData.components).toEqual([
          { id: '1' },
          { id: '3' },
          { id: '4' },
          { id: '2' },
          { id: '5' },
        ]);
      });

      it('Should properly handle 0 index', () => {
        pluginData.__moveComponentToIndex('3', 0);

        expect(pluginData.components).toEqual([
          { id: '3' },
          { id: '1' },
          { id: '2' },
          { id: '4' },
          { id: '5' },
        ]);
      });

      it('Should properly handle last index', () => {
        pluginData.__moveComponentToIndex('3', 4);

        expect(pluginData.components).toEqual([
          { id: '1' },
          { id: '2' },
          { id: '4' },
          { id: '5' },
          { id: '3' },
        ]);
      });
    });

    describe('Test method: insertComponentAfter', () => {
      let pluginData;

      beforeEach(() => {
        pluginData = new DefaultData();
        pluginData.components = [
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
          { id: '5' },
        ];
      });
      it('Should properly order components', () => {
        pluginData.insertComponentAfter('2', '4');
        expect(pluginData.components).toEqual(
          [
            { id: '1' },
            { id: '3' },
            { id: '4' },
            { id: '2' },
            { id: '5' },
          ],
        );

        pluginData.insertComponentAfter('3', '5');
        expect(pluginData.components).toEqual(
          [
            { id: '1' },
            { id: '4' },
            { id: '2' },
            { id: '5' },
            { id: '3' },
          ],
        );

        pluginData.insertComponentAfter('5', '1');
        expect(pluginData.components).toEqual(
          [
            { id: '1' },
            { id: '5' },
            { id: '4' },
            { id: '2' },
            { id: '3' },
          ],
        );
      });

      it('Should do nothing if the target is not part the component list', () => {
        pluginData.insertComponentAfter('3', '0');
        expect(pluginData.components).toEqual([
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
          { id: '5' },
        ]);
      });
    });

    describe('Test method: insertComponentBefore', () => {
      let pluginData;

      beforeEach(() => {
        pluginData = new DefaultData();
        pluginData.components = [
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
          { id: '5' },
        ];
      });

      it('Should properly order components', () => {
        pluginData.insertComponentBefore('2', '4');
        expect(pluginData.components).toEqual(
          [
            { id: '1' },
            { id: '3' },
            { id: '2' },
            { id: '4' },
            { id: '5' },
          ],
        );

        pluginData.insertComponentBefore('3', '5');
        expect(pluginData.components).toEqual(
          [
            { id: '1' },
            { id: '2' },
            { id: '4' },
            { id: '3' },
            { id: '5' },
          ],
        );

        pluginData.insertComponentBefore('5', '1');
        expect(pluginData.components).toEqual(
          [
            { id: '5' },
            { id: '1' },
            { id: '2' },
            { id: '4' },
            { id: '3' },
          ],
        );
      });

      it('Should do nothing if the target is not part the component list', () => {
        pluginData.insertComponentBefore('3', '0');
        expect(pluginData.components).toEqual([
          { id: '1' },
          { id: '2' },
          { id: '3' },
          { id: '4' },
          { id: '5' },
        ]);
      });
    });
  });
});
