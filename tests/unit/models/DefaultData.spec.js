import DefaultData from 'src/models/DefaultData';
import DefaultConfiguration from 'src/models/DefaultConfiguration';
import { version as CORE_VERSION } from 'package.json';
import ComponentDefinition from 'src/models/ComponentDefinition';
import Component from 'src/models/Component';
import ComponentAttribute from 'src/models/ComponentAttribute';
import ComponentAttributeDefinition from 'src/models/ComponentAttributeDefinition';
import ComponentLink from 'src/models/ComponentLink';
import ComponentLinkDefinition from 'src/models/ComponentLinkDefinition';
import Variable from 'src/models/Variable';

describe('Test class: DefaultData', () => {
  describe('Test constructor', () => {
    it('Check variables instantiation', () => {
      const pluginData = new DefaultData(new DefaultConfiguration());

      expect(pluginData.configuration).toEqual(new DefaultConfiguration());
      expect(pluginData.name).toBeNull();
      expect(pluginData.version).toBeNull();
      expect(pluginData.components).toEqual([]);
      expect(pluginData.variables).toEqual([]);
      expect(pluginData.parseErrors).toEqual([]);
      expect(pluginData.definitions).toEqual({ components: [], links: [] });
      expect(pluginData.eventManager).toEqual(null);
    });

    it('Check passing undefined variables to constructor', () => {
      let pluginData = new DefaultData(new DefaultConfiguration(), {});

      expect(pluginData.configuration).toEqual(new DefaultConfiguration());
      expect(pluginData.name).toBeNull();
      expect(pluginData.version).toBeNull();
      expect(pluginData.components).toEqual([]);
      expect(pluginData.variables).toEqual([]);
      expect(pluginData.parseErrors).toEqual([]);
      expect(pluginData.definitions).toEqual({ components: [], links: [] });
      expect(pluginData.eventManager).toEqual(null);

      pluginData = new DefaultData(new DefaultConfiguration(), { definitions: {} });
      expect(pluginData.definitions).toEqual({ components: [], links: [] });
    });

    it('Check passing all variables to constructor', () => {
      const pluginData = new DefaultData(new DefaultConfiguration(), {
        name: 'name',
        version: 'version',
        components: [0],
        variables: [1],
        parseErrors: [2],
        definitions: {
          components: [3],
          links: [4],
        },
      }, {});

      expect(pluginData.configuration).toEqual(new DefaultConfiguration());
      expect(pluginData.name).toEqual('name');
      expect(pluginData.version).toEqual('version');
      expect(pluginData.components).toEqual([0]);
      expect(pluginData.variables).toEqual([1]);
      expect(pluginData.parseErrors).toEqual([2]);
      expect(pluginData.definitions).toEqual({ components: [3], links: [4] });
      expect(pluginData.eventManager).toEqual({});
    });
  });

  describe('Test getters', () => {
    describe('Test getter: coreVersion', () => {
      it('should be equal to the version in package.json', () => {
        expect(CORE_VERSION).not.toBeNull();
        expect(new DefaultData(new DefaultConfiguration()).coreVersion).toEqual(CORE_VERSION);
      });
    });
  });

  describe('Test method: removeLink', () => {
    it('Should remove default link', () => {
      const pluginData = new DefaultData(new DefaultConfiguration());

      pluginData.components.push(new Component({
        id: 'test',
        name: 'test',
        attributes: [new ComponentAttribute({
          name: 'link',
          value: ['link1'],
          definition: new ComponentAttributeDefinition({
            name: 'link',
            type: 'Link',
          }),
        })],
      }));

      pluginData.removeLink(new ComponentLink({
        source: 'test',
        target: 'link1',
        definition: new ComponentLinkDefinition({ attributeRef: 'link' }),
      }));

      expect(pluginData.components[0].attributes[0].value).toEqual([]);
    });

    it('Should remove reverse link', () => {
      const pluginData = new DefaultData(new DefaultConfiguration());

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

      expect(pluginData.components[0].attributes[0].value).toEqual([]);
    });
  });

  describe('Test method: addComponent', () => {
    it('Should create new component and add it to the components list', () => {
      const pluginData = new DefaultData(new DefaultConfiguration());

      expect(pluginData.components).toEqual([]);

      const definition = new ComponentDefinition();
      const id = pluginData.addComponent(definition);

      expect(pluginData.components).toEqual([
        new Component({
          id,
          name: id,
          definition,
          path: null,
        }),
      ]);
    });

    it('Should create new component and set correct path without folder', () => {
      const pluginData = new DefaultData(new DefaultConfiguration({ defaultFileName: 'test.tf' }));

      expect(pluginData.components).toEqual([]);

      const definition = new ComponentDefinition();
      const id = pluginData.addComponent(definition, 'test.tf');

      expect(pluginData.components).toEqual([
        new Component({
          id,
          name: id,
          definition,
          path: 'test.tf',
        }),
      ]);
    });

    it('Should create new component and set correct path with folder', () => {
      const pluginData = new DefaultData(new DefaultConfiguration({ defaultFileName: 'test.tf' }));

      expect(pluginData.components).toEqual([]);

      const definition = new ComponentDefinition();
      const id = pluginData.addComponent(definition, 'src/test.tf');

      expect(pluginData.components).toEqual([
        new Component({
          id,
          name: id,
          definition,
          path: 'src/test.tf',
        }),
      ]);
    });
  });

  describe('Test method: initLinkDefinitions', () => {
    it('Should init link definitions', () => {
      const pluginData = new DefaultData(new DefaultConfiguration());

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
            new ComponentAttributeDefinition({
              name: 'arrayOfObject',
              type: 'Array',
              itemType: 'Object',
              itemDefinition: [
                new ComponentAttributeDefinition({
                  type: 'Object',
                  definedAttributes: [
                    new ComponentAttributeDefinition({
                      name: 'link4',
                      type: 'Link',
                      linkRef: 'laptop4',
                      linkType: 'Default',
                    }),
                  ],
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
        new ComponentLinkDefinition({
          attributeRef: 'link4',
          sourceRef: 'server',
          targetRef: 'laptop4',
          type: 'Default',
        }),
      ]);
    });
  });

  describe('Test method: getLinks', () => {
    it('Should return all links', () => {
      const pluginData = new DefaultData(new DefaultConfiguration());
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
      const pluginData = new DefaultData(new DefaultConfiguration());

      pluginData.components = [new Component({
        definition: new ComponentDefinition({ type: 'test' }),
      })];
      expect(pluginData.getComponentsByType('unknown')).toEqual([]);
    });

    it('Should return wanted components', () => {
      const pluginData = new DefaultData(new DefaultConfiguration());
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
      const pluginData = new DefaultData(new DefaultConfiguration());

      expect(pluginData.getComponentById('bad')).toBeNull();
    });

    it('Should return the component corresponding to the given id', () => {
      const definition = new ComponentDefinition();
      const pluginData = new DefaultData(new DefaultConfiguration());
      const id = pluginData.addComponent(definition);

      pluginData.addComponent(definition);

      expect(pluginData.getComponentById(id)).toEqual(new Component({
        id,
        name: id,
        definition,
      }));
    });
  });

  describe('Test method: renameComponentId', () => {
    it('Should rename the component id and update all its occurrences in links/references', () => {
      const definition = new ComponentDefinition();
      const pluginData = new DefaultData(new DefaultConfiguration());

      pluginData.components = [
        new Component({
          id: 'server1',
          name: 'server1',
          definition,
        }),
        new Component({
          id: 'gateway1',
          attributes: [new ComponentAttribute({
            name: 'link1',
            value: ['server1'],
            type: 'Array',
            definition: new ComponentDefinition({
              type: 'Link',
            }),
          })],
        }),
        new Component({
          id: 'subnet1',
          name: 'subnet1',
          attributes: [new ComponentAttribute({
            name: 'reference1',
            value: 'server1',
            type: 'String',
            definition: new ComponentDefinition({
              type: 'Reference',
            }),
          })],
        }),
      ];

      pluginData.renameComponentId('server1', 'server2');

      expect(pluginData.components).toEqual([
        new Component({
          id: 'server2',
          name: 'server1',
          definition,
        }),
        new Component({
          id: 'gateway1',
          attributes: [new ComponentAttribute({
            name: 'link1',
            value: ['server2'],
            type: 'Array',
            definition: new ComponentDefinition({
              type: 'Link',
            }),
          })],
        }),
        new Component({
          id: 'subnet1',
          name: 'subnet1',
          attributes: [new ComponentAttribute({
            name: 'reference1',
            value: 'server2',
            type: 'String',
            definition: new ComponentDefinition({
              type: 'Reference',
            }),
          })],
        }),
      ]);
    });
  });

  describe('Test method: removeComponentById', () => {
    it('Should remove the component corresponding to the given id', () => {
      const definition = new ComponentDefinition();
      const pluginData = new DefaultData(new DefaultConfiguration());
      const id1 = pluginData.addComponent(definition);
      const id2 = pluginData.addComponent(definition);

      pluginData.removeComponentById(id1);
      expect(pluginData.components).toEqual([
        new Component({
          id: id2,
          name: id2,
          definition,
        }),
      ]);

      pluginData.removeComponentById(id2);
      expect(pluginData.components).toEqual([]);
    });

    it('Should do nothing on unknown id', () => {
      const definition = new ComponentDefinition();
      const pluginData = new DefaultData(new DefaultConfiguration());
      const id1 = pluginData.addComponent(definition);
      const id2 = pluginData.addComponent(definition);

      pluginData.removeComponentById('unknown');
      expect(pluginData.components).toEqual([
        new Component({
          id: id1,
          name: id1,
          definition,
        }),
        new Component({
          id: id2,
          name: id2,
          definition,
        }),
      ]);
    });

    it('Should remove the sub-component corresponding to the given id', () => {
      const attributeDefinition = new ComponentAttributeDefinition({
        name: 'test',
        type: 'Reference',
        containerRef: 'server',
      });
      const definition = new ComponentDefinition({
        name: 'server',
        type: 'server',
        definedAttributes: [attributeDefinition],
      });
      const pluginData = new DefaultData(new DefaultConfiguration());
      const rootId = pluginData.addComponent(definition);
      const childId = pluginData.addComponent(definition);
      const subChildId = pluginData.addComponent(definition);

      pluginData.getComponentById(childId)
        .setReferenceAttribute(pluginData.getComponentById(rootId));
      pluginData.getComponentById(subChildId)
        .setReferenceAttribute(pluginData.getComponentById(childId));

      pluginData.removeComponentById(subChildId);
      expect(pluginData.components).toEqual([
        new Component({
          id: rootId,
          name: rootId,
          definition,
        }),
        new Component({
          id: childId,
          name: childId,
          attributes: [new ComponentAttribute({
            name: 'test',
            type: 'String',
            value: rootId,
            definition: attributeDefinition,
          })],
          definition,
        }),
      ]);

      pluginData.removeComponentById(childId);
      expect(pluginData.components).toEqual([
        new Component({
          id: rootId,
          name: rootId,
          definition,
        }),
      ]);
    });

    it('Should remove Link attribute of component', () => {
      const definition = new ComponentDefinition();
      const pluginData = new DefaultData(new DefaultConfiguration());
      const rootId = pluginData.addComponent(definition);
      const childId = pluginData.addComponent(definition);
      const subChildId = pluginData.addComponent(definition);
      const otherChildId = pluginData.addComponent(definition);

      const rootAttribute = new ComponentAttribute({
        value: [childId, subChildId],
        definition: new ComponentAttributeDefinition({ type: 'Link' }),
      });

      const childAttribute = new ComponentAttribute({
        value: [subChildId],
        definition: new ComponentAttributeDefinition({ type: 'Link' }),
      });

      const otherChildAttribute = new ComponentAttribute({
        value: ['test'],
        definition: new ComponentAttributeDefinition({ type: 'Link' }),
      });

      pluginData.components[0].attributes.push(rootAttribute);
      pluginData.components[1].attributes.push(childAttribute);
      pluginData.components[3].attributes.push(otherChildAttribute);

      pluginData.removeComponentById(subChildId);
      expect(pluginData.components).toEqual([
        new Component({
          id: rootId,
          name: rootId,
          attributes: [new ComponentAttribute({
            value: [childId],
            definition: new ComponentAttributeDefinition({ type: 'Link' }),
          })],
          definition,
        }),
        new Component({
          id: childId,
          name: childId,
          definition,
          attributes: [new ComponentAttribute({
            value: [],
            definition: new ComponentAttributeDefinition({ type: 'Link' }),
          })],
        }),
        new Component({
          id: otherChildId,
          name: otherChildId,
          attributes: [new ComponentAttribute({
            value: ['test'],
            definition: new ComponentAttributeDefinition({ type: 'Link' }),
          })],
          definition,
        }),
      ]);

      pluginData.removeComponentById(childId);
      expect(pluginData.components).toEqual([
        new Component({
          id: rootId,
          name: rootId,
          definition,
          attributes: [new ComponentAttribute({
            value: [],
            definition: new ComponentAttributeDefinition({ type: 'Link' }),
          })],
        }),
        new Component({
          id: otherChildId,
          name: otherChildId,
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
      const pluginData = new DefaultData(new DefaultConfiguration());
      const rootId = pluginData.addComponent(definition);
      const childId = pluginData.addComponent(definition);

      pluginData.addComponent(definition);
      pluginData.components[1].attributes = [new ComponentAttribute({
        name: 'test',
        value: rootId,
        definition: new ComponentAttributeDefinition({ name: 'test', type: 'Reference' }),
      })];

      pluginData.components[2].attributes = [new ComponentAttribute({
        name: 'test',
        value: childId,
        definition: new ComponentAttributeDefinition({ name: 'test', type: 'Reference' }),
      })];

      pluginData.removeComponentById(rootId);
      expect(pluginData.components).toEqual([]);
    });
  });

  describe('Test method: __moveComponentToIndex', () => {
    let pluginData;

    beforeEach(() => {
      pluginData = new DefaultData(new DefaultConfiguration());
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
      pluginData = new DefaultData(new DefaultConfiguration());
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
      pluginData = new DefaultData(new DefaultConfiguration());
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

  describe('Test method: getWorkflowLinks', () => {
    let pluginData;

    beforeEach(() => {
      pluginData = new DefaultData(new DefaultConfiguration(), {
        components: [
          new Component({
            id: 'workflow1',
            definition: new ComponentDefinition({
              displayType: 'workflowVertical',
            }),
          }),
          new Component({
            id: 'workflow2',
            definition: new ComponentDefinition({
              displayType: 'workflowVertical',
            }),
          }),

          new Component({
            id: 'workflowStep1',
            definition: new ComponentDefinition(),
            attributes: [new ComponentAttribute({
              name: 'containerId',
              value: 'workflow1',
              definition: new ComponentAttributeDefinition({
                type: 'Reference',
              }),
            })],
          }), new Component({
            id: 'workflowStep2',
            definition: new ComponentDefinition(),
            attributes: [new ComponentAttribute({
              name: 'containerId',
              value: 'workflow1',
              definition: new ComponentAttributeDefinition({
                type: 'Reference',
              }),
            })],
          }),
          new Component({
            id: 'workflowStep3',
            definition: new ComponentDefinition(),
            attributes: [new ComponentAttribute({
              name: 'containerId',
              value: 'workflow1',
              definition: new ComponentAttributeDefinition({
                type: 'Reference',
              }),
            }),
            ],
          }),
          new Component({
            id: 'workflowStep4',
            definition: new ComponentDefinition(),
            attributes: [new ComponentAttribute({
              name: 'containerId',
              value: 'workflow2',
              definition: new ComponentAttributeDefinition({
                type: 'Reference',
              }),
            }),
            ],
          }),
          new Component({
            id: 'workflowStep5',
            definition: new ComponentDefinition(),
            attributes: [new ComponentAttribute({
              name: 'containerId',
              value: 'workflow2',
              definition: new ComponentAttributeDefinition({
                type: 'Reference',
              }),
            }),
            ],
          }),
        ],
      });
    });

    it('Should create links between a workflow component\'s children', () => {
      const links = pluginData.getWorkflowLinks();

      expect(links).toEqual([
        new ComponentLink({
          definition: new ComponentLinkDefinition({
            sourceRef: '__workflow',
            attributeRef: '__next',
          }),
          source: 'workflowStep1',
          target: 'workflowStep2',
        }),
        new ComponentLink({
          definition: new ComponentLinkDefinition({
            sourceRef: '__workflow',
            attributeRef: '__next',
          }),
          source: 'workflowStep2',
          target: 'workflowStep3',
        }),
        new ComponentLink({
          definition: new ComponentLinkDefinition({
            sourceRef: '__workflow',
            attributeRef: '__next',
          }),
          source: 'workflowStep4',
          target: 'workflowStep5',
        }),
      ]);
    });

    it('Should do nothing if there is less than 2 steps in a workflow', () => {
      pluginData.components = [
        new Component({
          id: 'workflow1',
          definition: new ComponentDefinition({
            displayType: 'workflowVertical',
          }),
        }),
        new Component({
          id: 'workflow2',
          definition: new ComponentDefinition({
            displayType: 'workflowVertical',
          }),
        }),
        new Component({
          id: 'workflowStep1',
          definition: new ComponentDefinition(),
          attributes: [new ComponentAttribute({
            name: 'containerId',
            value: 'workflow1',
            definition: new ComponentAttributeDefinition({
              type: 'Reference',
            }),
          })],
        }),
      ];

      expect(pluginData.getWorkflowLinks()).toEqual([]);
    });
  });

  describe('Test method: getUsedLinkDefinitions', () => {
    const pluginData = new DefaultData(new DefaultConfiguration());
    const linkDefinition1 = new ComponentAttributeDefinition({
      name: 'link1',
      type: 'Link',
      linkRef: 'server',
    });
    const link1 = new ComponentLinkDefinition({
      sourceRef: 'server',
      targetRef: 'server',
      attributeRef: 'link1',
    });
    const linkDefinition2 = new ComponentAttributeDefinition({
      name: 'link2',
      type: 'Link',
      linkRef: 'server',
    });
    const link2 = new ComponentLinkDefinition({
      sourceRef: 'server',
      targetRef: 'server',
      attributeRef: 'link2',
    });
    const linkDefinition3 = new ComponentAttributeDefinition({
      name: 'link3',
      type: 'Link',
      linkRef: 'server',
      linkType: 'Default',
    });
    const serverDefinition = new ComponentDefinition({
      type: 'server',
      definedAttributes: [
        linkDefinition1,
        linkDefinition2,
        linkDefinition3,
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
          definition: linkDefinition1,
          name: 'link1',
          value: ['server3'],
          type: 'Array',
        })],
      }),
    ];

    it('Should return the link definitions used by the components', () => {
      const usedLinkDefinitions = pluginData.getUsedLinkDefinitions();

      expect(usedLinkDefinitions.length).toEqual(2);
      expect(usedLinkDefinitions[0]).toEqual(link1);
      expect(usedLinkDefinitions[1]).toEqual(link2);
    });
  });

  describe('Test method: emitEvent', () => {
    it('should call event.next with correct data', () => {
      let data;
      const next = jest.fn((d) => {
        data = d;
      });
      const pluginData = new DefaultData(new DefaultConfiguration(), {}, {
        next,
      });

      pluginData.emitEvent({});

      expect(next).toBeCalled();
      expect(data).not.toBeNull();
      expect(data.event).not.toBeNull();
      expect(data.event.id).toEqual(1);
    });

    it('should increment event index on event without id', () => {
      const pluginData = new DefaultData(new DefaultConfiguration(), {}, {
        next: jest.fn(),
      });

      expect(pluginData.__eventIndex).toEqual(0);

      pluginData.emitEvent({});
      expect(pluginData.__eventIndex).toEqual(1);
    });
  });

  describe('Test method: getEventLogById', () => {
    it('should return nothing without event log', () => {
      const pluginData = new DefaultData(new DefaultConfiguration(), {}, {
        next: jest.fn(),
      });

      expect(pluginData.getEventLogById(1)).toBeUndefined();
    });

    it('should return correct event', () => {
      const pluginData = new DefaultData(new DefaultConfiguration(), {}, {
        next: jest.fn(),
      });

      const id = pluginData.emitEvent();
      const event = pluginData.getEventLogById(id);

      expect(event).not.toBeNull();
      expect(event.id).toEqual(id);
    });
  });

  describe('Test method: deleteAllEventsBefore', () => {
    it('Should delete selected event', () => {
      const pluginData = new DefaultData(new DefaultConfiguration(), {}, {
        next: jest.fn(),
      });

      const id1 = pluginData.emitEvent();
      const event1 = pluginData.getEventLogById(id1);
      const id2 = pluginData.emitEvent();
      const event2 = pluginData.getEventLogById(id2);
      const id3 = pluginData.emitEvent();
      const event3 = pluginData.getEventLogById(id3);

      event1.startDate = 1;
      event2.startDate = 2;
      event3.startDate = 3;

      event1.endDate = 1;
      event2.endDate = 2;
      event3.endDate = 3;

      pluginData.deleteAllEventLogsBefore(2);

      expect(pluginData.getEventLogById(id1)).toBeUndefined();
      expect(pluginData.getEventLogById(id2)).toBeUndefined();
      expect(pluginData.getEventLogById(id3)).not.toBeUndefined();
    });
  });

  describe('Test method: getAttributeValue', () => {
    it('Should get the value of a variable attribute', () => {
      const pluginData = new DefaultData();
      const attribute = new ComponentAttribute({
        name: 'test_attribute',
        value: 'test_variable',
      });

      pluginData.variables.push(new Variable({
        name: 'test_variable',
        value: 'test',
      }));

      Object.defineProperty(attribute, 'isVariable', {
        value: () => true,
      });

      expect(pluginData.getAttributeValue(attribute)).toEqual('test');
    });

    it('Should get the value of a non-variable attribute', () => {
      const pluginData = new DefaultData();
      const component = new Component({
        id: 'component1',
        definition: new ComponentDefinition(),
        attributes: [
          new ComponentAttribute({
            name: 'test_attribute',
            value: 'test',
          }),
        ],
      });

      pluginData.components = [component];

      expect(pluginData.getAttributeValue(component.attributes[0])).toEqual('test');
    });
  });

  describe('Test method: getLinkedComponentsIds', () => {
    it('Should get the ID of a single string linked component', () => {
      const pluginData = new DefaultData();
      const component = new Component({
        id: 'test_component',
        definition: new ComponentDefinition(),
        attributes: [
          new ComponentAttribute({
            name: 'test_attribute',
            value: 'test',
          }),
        ],
      });

      pluginData.components = [component];

      expect(pluginData.getLinkedComponentsIds(component.attributes[0])).toEqual(['test']);
    });

    it('Should get the ID of a single-element array linked component', () => {
      const pluginData = new DefaultData();
      const component = new Component({
        id: 'test_component',
        definition: new ComponentDefinition(),
        attributes: [
          new ComponentAttribute({
            name: 'test_attribute',
            value: ['test'],
          }),
        ],
      });

      pluginData.components = [component];

      expect(pluginData.getLinkedComponentsIds(component.attributes[0])).toEqual(['test']);
    });

    it('Should get the ID of a multiple-elements array linked component', () => {
      const pluginData = new DefaultData();
      const component = new Component({
        id: 'test_component',
        definition: new ComponentDefinition(),
        attributes: [
          new ComponentAttribute({
            name: 'test_attribute',
            value: ['test1', 'test2'],
          }),
        ],
      });

      pluginData.components = [component];

      expect(pluginData.getLinkedComponentsIds(component.attributes[0]))
        .toEqual(['test1', 'test2']);
    });

    it('Should get the ID of null value linked component', () => {
      const pluginData = new DefaultData();
      const component = new Component({
        id: 'test_component',
        definition: new ComponentDefinition(),
        attributes: [
          new ComponentAttribute({
            name: 'test_attribute',
            value: null,
          }),
        ],
      });

      pluginData.components = [component];

      expect(pluginData.getLinkedComponentsIds(component.attributes[0])).toEqual([]);
    });
  });

  describe('Test method: getVariableValue', () => {
    it('Should get the value of a variable', () => {
      const pluginData = new DefaultData();
      const variable = new Variable({
        name: 'test_variable',
        value: 'test',
      });

      pluginData.variables = [variable];

      expect(pluginData.getVariableValue(variable.name)).toEqual('test');
    });

    it('Should get null when getting a non-existent variable value', () => {
      const pluginData = new DefaultData();
      const variable = new Variable({
        id: 'test_variable',
        value: 'test',
      });

      pluginData.variables = [variable];

      expect(pluginData.getVariableValue('non-variable')).toBeNull();
    });
  });

  describe('Test method: setVariableValue', () => {
    it('Should set the value of a variable', () => {
      const pluginData = new DefaultData();
      const variable = new Variable({
        name: 'test_variable',
        value: 'test',
      });

      pluginData.variables = [variable];

      expect(pluginData.variables[0].value).toEqual('test');

      pluginData.setVariableValue(variable.name, 'test2');

      expect(pluginData.variables[0].value).toEqual('test2');
    });

    it('Should not set the the value of a non-existent variable', () => {
      const pluginData = new DefaultData();
      const variable = new Variable({
        name: 'test_variable',
        value: 'test',
      });

      pluginData.variables = [variable];

      expect(pluginData.variables[0].value).toEqual('test');

      pluginData.setVariableValue('non-variable', 'test2');

      expect(pluginData.variables[0].value).toEqual('test');
    });
  });
});
