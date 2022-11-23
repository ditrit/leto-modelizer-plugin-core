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
          source: 'link1',
          target: 'test',
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
            sourceRef: 'laptop2',
            targetRef: 'server',
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
          children: [test2, notTest],
        });

        pluginData.components = [test1, notTest];
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

      it('Should return the sub-component corresponding to the given id', () => {
        const definition = new ComponentDefinition();
        const pluginData = new DefaultData();

        pluginData.addComponent('test', definition);
        pluginData.addComponent('test2', definition);
        pluginData.components[0].children = [pluginData.components[1]];
        pluginData.components = [pluginData.components[0]];

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

        expect(pluginData.removeComponentById('test')).toEqual(true);
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

        expect(pluginData.removeComponentById('unknown')).toEqual(false);
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
        const definition = new ComponentDefinition();
        const pluginData = new DefaultData();

        pluginData.addComponent('root', definition);
        pluginData.addComponent('child', definition);
        pluginData.addComponent('subChild', definition);

        pluginData.components[1].children = [pluginData.components[2]];
        pluginData.components[0].children = [pluginData.components[1]];
        pluginData.components = [pluginData.components[0]];

        pluginData.removeComponentById('subChild');
        expect(pluginData.components).toEqual([
          new Component({
            id: 'root',
            name: 'root',
            children: [new Component({
              id: 'child',
              name: 'child',
              definition,
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

        pluginData.components[0].children = [pluginData.components[1]];
        pluginData.components[0].attributes.push(rootAttribute);
        pluginData.components[1].children = [pluginData.components[2]];
        pluginData.components[1].attributes.push(childAttribute);
        pluginData.components[3].attributes.push(otherChildAttribute);

        pluginData.components = [pluginData.components[0], pluginData.components[3]];

        pluginData.removeComponentById('subChild');
        expect(pluginData.components).toEqual([
          new Component({
            id: 'root',
            name: 'root',
            attributes: [new ComponentAttribute({
              value: ['child'],
              definition: new ComponentAttributeDefinition({ type: 'Link' }),
            })],
            children: [new Component({
              id: 'child',
              name: 'child',
              definition,
            })],
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
  });
});
