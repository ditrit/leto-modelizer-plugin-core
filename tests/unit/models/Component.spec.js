import Component from 'src/models/Component';
import ComponentAttribute from 'src/models/ComponentAttribute';
import ComponentDefinition from 'src/models/ComponentDefinition';
import ComponentAttributeDefinition from 'src/models/ComponentAttributeDefinition';
import ComponentLink from 'src/models/ComponentLink';
import ComponentLinkDefinition from 'src/models/ComponentLinkDefinition';
import ComponentDrawOption from 'src/models/ComponentDrawOption';
import ParserLog from 'src/models/ParserLog';

describe('Test class: Component', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const component = new Component();

      expect(component.id).toBeNull();
      expect(component.externalId).toBeNull();
      expect(component.__class).toEqual('Component');
      expect(component.name).toBeNull();
      expect(component.definition).toBeNull();
      expect(component.drawOption).toEqual(new ComponentDrawOption());
      expect(component.attributes).toEqual([]);
      expect(component.path).toBeNull();
    });

    it('Check passing undefined variables to constructor', () => {
      const component = new Component({});

      expect(component.id).toBeNull();
      expect(component.externalId).toBeNull();
      expect(component.__class).toEqual('Component');
      expect(component.name).toBeNull();
      expect(component.definition).toBeNull();
      expect(component.drawOption).not.toBeNull();
      expect(component.attributes).toEqual([]);
      expect(component.path).toBeNull();
    });

    it('Check passing all variables to constructor', () => {
      const component = new Component({
        id: 'id',
        name: 'name',
        definition: 'definition',
        drawOption: 'drawOption',
        attributes: 'attributes',
        path: 'path',
      });

      expect(component.id).toEqual('id');
      expect(component.externalId).toEqual('id');
      expect(component.__class).toEqual('Component');
      expect(component.name).toEqual('name');
      expect(component.definition).toEqual('definition');
      expect(component.drawOption).toEqual('drawOption');
      expect(component.attributes).toEqual('attributes');
      expect(component.path).toEqual('path');
    });

    it('Check passing all variables to constructor with specific externalId', () => {
      const component = new Component({
        id: 'id',
        externalId: 'externalId',
        name: 'name',
        definition: 'definition',
        drawOption: 'drawOption',
        attributes: 'attributes',
        path: 'path',
      });

      expect(component.id).toEqual('id');
      expect(component.externalId).toEqual('externalId');
      expect(component.__class).toEqual('Component');
      expect(component.name).toEqual('name');
      expect(component.definition).toEqual('definition');
      expect(component.drawOption).toEqual('drawOption');
      expect(component.attributes).toEqual('attributes');
      expect(component.path).toEqual('path');
    });
  });

  describe('Test methods', () => {
    describe('Test method: setExternalId', () => {
      it('should correctly set the externalId', () => {
        const component = new Component({
          id: 'id',
          externalId: 'externalId',
        });

        expect(component.externalId).toEqual('externalId');
        component.setExternalId('newExternalId');
        expect(component.externalId).toEqual('newExternalId');
      });
    });

    describe('Test method: getConfigurationKey', () => {
      it('should correctly get the configuration key', () => {
        const component = new Component({
          id: 'id',
          externalId: 'externalId',
        });

        expect(component.getConfigurationKey()).toEqual('id');
      });
    });

    describe('Test method: canContain', () => {
      it('should be false on non-container component', () => {
        const component = new Component({
          definition: new ComponentDefinition({ isContainer: false }),
        });

        expect(component.canContain('type')).toEqual(false);
      });

      it('should be false on container and without valid type', () => {
        const component = new Component({
          definition: new ComponentDefinition({ isContainer: true }),
        });

        component.definition.childrenTypes.push('valid');

        expect(component.canContain('invalid')).toEqual(false);
      });

      it('should be true on container and with valid type', () => {
        const component = new Component({
          definition: new ComponentDefinition({ isContainer: true }),
        });

        component.definition.childrenTypes.push('valid');

        expect(component.canContain('valid')).toEqual(true);
      });
    });

    describe('Test method: setReferenceAttribute', () => {
      it('should not set attribute if there is no container attribute definition', () => {
        const component = new Component({
          definition: new ComponentDefinition({}),
        });

        component.setReferenceAttribute(new Component({
          definition: new ComponentDefinition({
            type: 'container',
          }),
        }));
        expect(component.attributes).toEqual([]);
      });

      it('should create attribute if container attribute does not exist', () => {
        const component = new Component({
          attributes: [],
          definition: new ComponentDefinition({
            definedAttributes: [
              new ComponentAttributeDefinition({
                name: 'container',
                type: 'Reference',
                containerRef: 'container',
              }),
            ],
          }),
        });

        component.setReferenceAttribute(new Component({
          id: 'containerId',
          definition: new ComponentDefinition({
            type: 'container',
          }),
        }));

        expect(component.attributes.length).toEqual(1);
        expect(component.attributes[0]).toMatchObject({
          name: 'container',
          value: 'containerId',
        });
        expect(component.attributes[0].definition).not.toBeNull();
      });

      it('should update attribute if container attribute already exits', () => {
        const component = new Component({
          attributes: [
            new ComponentAttribute({
              name: 'container',
              definition: new ComponentAttributeDefinition({
                name: 'container',
                type: 'Reference',
                containerRef: 'container',
              }),
              value: 'test',
            }),
          ],
          definition: new ComponentDefinition({
            definedAttributes: [
              new ComponentAttributeDefinition({
                name: 'container',
                type: 'Reference',
                containerRef: 'container',
              }),
            ],
          }),
        });

        component.setReferenceAttribute(new Component({
          id: 'containerId',
          definition: new ComponentDefinition({
            type: 'container',
          }),
        }));

        expect(component.attributes.length).toEqual(1);
        expect(component.attributes[0]).toMatchObject({
          name: 'container',
          value: 'containerId',
        });
        expect(component.attributes[0].definition).not.toBeNull();
      });

      it('should not raise error when there are attributes without definition', () => {
        const component = new Component({
          attributes: [
            new ComponentAttribute({
              name: 'attributeWithNullDef',
              type: 'String',
            }),
          ],
          definition: new ComponentDefinition({
            definedAttributes: [
              new ComponentAttributeDefinition({
                name: 'container',
                type: 'Reference',
                containerRef: 'container',
              }),
            ],
          }),
        });

        component.setReferenceAttribute(new Component({
          id: 'containerId',
          definition: new ComponentDefinition({
            type: 'container',
          }),
        }));

        expect(component.attributes.length).toEqual(2);
        expect(component.attributes[1]).toMatchObject({
          name: 'container',
          value: 'containerId',
        });
        expect(component.attributes[0].definition).toBeNull();
        expect(component.attributes[1].definition).not.toBeNull();
      });
    });

    describe('Test method: removeAllReferenceAttributes', () => {
      it('Should remove existing attribute', () => {
        const component = new Component({
          attributes: [
            new ComponentAttribute({
              name: 'container',
              definition: new ComponentAttributeDefinition({
                name: 'container',
                type: 'Reference',
                containerRef: 'container',
              }),
              value: 'containerId',
            }),
          ],
          definition: new ComponentDefinition({
            definedAttributes: [
              new ComponentAttributeDefinition({
                name: 'container',
                type: 'Reference',
                containerRef: 'container',
              }),
            ],
          }),
        });

        component.removeAllReferenceAttributes(new Component({
          id: 'containerId',
          definition: new ComponentDefinition({
            type: 'container',
          }),
        }));

        expect(component.attributes.length).toEqual(0);
      });

      it('Should do nothing if attribute does not exist', () => {
        const component = new Component({
          attributes: [
            new ComponentAttribute({
              name: 'test',
              definition: new ComponentAttributeDefinition({
                name: 'container',
                type: 'test',
                containerRef: 'container',
              }),
              value: 'containerId',
            }),
            new ComponentAttribute({
              name: 'container2',
              definition: new ComponentAttributeDefinition({
                name: 'container2',
                type: 'Reference',
                containerRef: 'container2',
              }),
              value: 'containerId',
            }),
          ],
        });

        component.removeAllReferenceAttributes(new Component({
          id: 'containerId',
          definition: new ComponentDefinition({
            type: 'container',
          }),
        }));

        expect(component.attributes.length).toEqual(2);
        expect(component.attributes[0]).toMatchObject({
          name: 'test',
          value: 'containerId',
        });
        expect(component.attributes[1]).toMatchObject({
          name: 'container2',
          value: 'containerId',
        });
      });

      it('Should do nothing if attribute does not exist', () => {
        const component = new Component({
          attributes: [
            new ComponentAttribute({
              name: 'test',
              definition: new ComponentAttributeDefinition({
                name: 'container',
                type: 'test',
                containerRef: 'container',
              }),
              value: 'containerId',
            }),
            new ComponentAttribute({
              name: 'container2',
              definition: new ComponentAttributeDefinition({
                name: 'container2',
                type: 'Reference',
                containerRef: 'container2',
              }),
              value: 'containerId',
            }),
          ],
        });

        component.removeAllReferenceAttributes(new Component({
          id: 'containerId',
          definition: new ComponentDefinition({
            type: 'container',
          }),
        }));

        expect(component.attributes.length).toEqual(2);
        expect(component.attributes[0]).toMatchObject({
          name: 'test',
          value: 'containerId',
        });
        expect(component.attributes[1]).toMatchObject({
          name: 'container2',
          value: 'containerId',
        });
      });

      it('Should remove all container attributes', () => {
        const component = new Component({
          attributes: [
            new ComponentAttribute({
              name: 'container',
              definition: new ComponentAttributeDefinition({
                name: 'container',
                type: 'Reference',
                containerRef: 'container',
              }),
              value: 'containerId',
            }),
            new ComponentAttribute({
              name: 'name',
              definition: new ComponentAttributeDefinition({
                name: 'container',
                type: 'String',
              }),
              value: 'test',
            }),
          ],
        });

        component.removeAllReferenceAttributes();

        expect(component.attributes.length).toEqual(1);
        expect(component.attributes[0]).toMatchObject({
          name: 'name',
          value: 'test',
        });
      });
    });

    describe('Test method: __createNestedAttributes', () => {
      it('Should do nothing without any definition', () => {
        const component = new Component({
          definition: new ComponentDefinition({
            name: 'Component',
          }),
        });

        const currentAttributes = component.__createNestedAttributes([]);

        expect(component.attributes).toEqual([]);
        expect(currentAttributes).toEqual([]);
      });

      it('Should create root attribute if it doesn\'t exists', () => {
        const rootAttributeDefinition = new ComponentAttributeDefinition({
          name: 'root',
          type: 'Object',
        });
        const component = new Component({
          definition: new ComponentDefinition({
            name: 'Component',
            definedAttributes: [rootAttributeDefinition],
          }),
        });
        const expectedAttribute = new ComponentAttribute({
          name: 'root',
          type: 'Object',
          value: [],
          definition: rootAttributeDefinition,
        });

        const currentAttributes = component.__createNestedAttributes([rootAttributeDefinition]);

        expect(component.attributes).toEqual([expectedAttribute]);
        expect(currentAttributes).toEqual([]);
      });

      it('Should create root and sub attribute if there is none', () => {
        const subRootAttributeDefinition = new ComponentAttributeDefinition({
          name: 'sub-root',
          type: 'Object',
        });
        const rootAttributeDefinition = new ComponentAttributeDefinition({
          name: 'root',
          type: 'Object',
          definedAttributes: [subRootAttributeDefinition],
        });
        const component = new Component({
          definition: new ComponentDefinition({
            name: 'Component',
            definedAttributes: [rootAttributeDefinition],
          }),
        });
        const expectedSubRootAttribute = new ComponentAttribute({
          name: 'sub-root',
          type: 'Object',
          value: [],
          definition: subRootAttributeDefinition,
        });
        const expectedRootAttribute = new ComponentAttribute({
          name: 'root',
          type: 'Object',
          value: [expectedSubRootAttribute],
          definition: rootAttributeDefinition,
        });

        const currentAttributes = component.__createNestedAttributes([
          subRootAttributeDefinition,
          rootAttributeDefinition,
        ]);

        expect(component.attributes).toEqual([expectedRootAttribute]);
        expect(currentAttributes).toEqual([]);
      });

      it('Should create sub attribute if only root exists', () => {
        const subRootAttributeDefinition = new ComponentAttributeDefinition({
          name: 'sub-root',
          type: 'Object',
        });
        const rootAttributeDefinition = new ComponentAttributeDefinition({
          name: 'root',
          type: 'Object',
          definedAttributes: [subRootAttributeDefinition],
        });
        const rootAttribute = new ComponentAttribute({
          name: 'root',
          type: 'Object',
          value: [],
          definition: rootAttributeDefinition,
        });
        const component = new Component({
          definition: new ComponentDefinition({
            name: 'Component',
            definedAttributes: [rootAttributeDefinition],
          }),
          attributes: [rootAttribute],
        });
        const expectedSubRootAttribute = new ComponentAttribute({
          name: 'sub-root',
          type: 'Object',
          value: [],
          definition: subRootAttributeDefinition,
        });
        const expectedRootAttribute = new ComponentAttribute({
          name: 'root',
          type: 'Object',
          value: [expectedSubRootAttribute],
          definition: rootAttributeDefinition,
        });

        const currentAttributes = component.__createNestedAttributes([
          subRootAttributeDefinition,
          rootAttributeDefinition,
        ]);

        expect(component.attributes).toEqual([expectedRootAttribute]);
        expect(currentAttributes).toEqual([]);
      });
    });

    describe('Test method: setLinkAttribute', () => {
      it('Should update existing link attribute with new value', () => {
        const link = new ComponentLink({
          source: 'source01',
          target: 'target01',
          definition: { attributeRef: 'name01' },
        });
        const component = new Component({
          attributes: [
            new ComponentAttribute({
              definition: new ComponentAttributeDefinition({
                type: 'Link',
                name: 'name01',
              }),
              value: [],
            }),
          ],
          definition: new ComponentDefinition({
            definedAttributes: [
              new ComponentAttributeDefinition({ name: 'name01', type: 'Link' }),
            ],
          }),
        });

        component.setLinkAttribute(link);
        expect(component.attributes[0].value).toEqual(['target01']);
      });

      it('Should add new attribute with new link', () => {
        const link = new ComponentLink({
          source: 'source02',
          target: 'target02',
          definition: { attributeRef: 'name01' },
        });
        const component = new Component({
          attributes: [],
          definition: new ComponentDefinition({
            definedAttributes: [
              new ComponentAttributeDefinition({ name: 'name01', type: 'Link' }),
            ],
          }),
        });

        component.setLinkAttribute(link);
        expect(component.attributes.length).toEqual(1);
        expect(component.attributes[0].definition.name).toEqual('name01');
        expect(component.attributes[0].value).toEqual(['target02']);
      });

      it('Should add all parent attributes with new link', () => {
        const link = new ComponentLink({
          source: 'source02',
          target: 'target02',
          definition: { attributeRef: 'name01' },
        });
        const component = new Component({
          attributes: [],
          definition: new ComponentDefinition({
            definedAttributes: [
              new ComponentAttributeDefinition({
                name: 'Object1',
                type: 'Object',
                definedAttributes: [new ComponentAttributeDefinition({
                  name: 'Object2',
                  type: 'Object',
                  definedAttributes: [new ComponentAttributeDefinition({
                    name: 'name01',
                    type: 'Link',
                  })],
                })],
              }),
            ],
          }),
        });

        component.setLinkAttribute(link);

        expect(component.attributes.length).toEqual(1);
        expect(component.attributes[0].definition.name).toEqual('Object1');
        expect(component.attributes[0].value.length).toEqual(1);
        expect(component.attributes[0].value[0].definition.name).toEqual('Object2');
        expect(component.attributes[0].value[0].value.length).toEqual(1);
        expect(component.attributes[0].value[0].value[0].value).toEqual(['target02']);
      });

      it('Should do nothing if attribute already exists', () => {
        const link = new ComponentLink({
          source: 'source03',
          target: 'target03',
          definition: { attributeRef: 'name03' },
        });
        const component = new Component({
          attributes: [
            new ComponentAttribute({
              definition: new ComponentAttributeDefinition({
                type: 'Link',
                name: 'name03',
              }),
              value: ['target03'],
            }),
          ],
          definition: new ComponentDefinition({
            definedAttributes: [
              new ComponentAttributeDefinition({ name: 'name03', type: 'Link' }),
            ],
          }),
        });

        component.setLinkAttribute(link);
        expect(component.attributes.length).toEqual(1);
        expect(component.attributes[0].definition.name).toEqual('name03');
        expect(component.attributes[0].value).toEqual(['target03']);
      });
    });

    describe('Test method: removeLinkAttribute', () => {
      it('Should do nothing without link in attributes', () => {
        const component = new Component();

        component.removeLinkAttribute('test', 'unknown');
        component.removeLinkAttribute('test', 'other');
        expect(component.attributes).toEqual([]);

        const attribute = new ComponentAttribute({
          name: 'other',
          value: 'test',
          type: 'String',
          definition: new ComponentAttributeDefinition({
            name: 'other',
            type: 'String',
          }),
        });

        component.attributes.push(attribute);
        component.removeLinkAttribute('test', 'unknown');
        component.removeLinkAttribute('test', 'other');
        expect(component.attributes).toEqual([attribute]);
      });

      it('Should do nothing on unknown id', () => {
        const component = new Component();

        component.attributes.push(new ComponentAttribute({
          name: 'link',
          value: ['other'],
          type: 'Array',
          definition: new ComponentAttributeDefinition({
            name: 'other',
            type: 'Link',
          }),
        }));

        component.removeLinkAttribute('test', 'link');
        expect(component.attributes).toEqual([new ComponentAttribute({
          name: 'link',
          value: ['other'],
          type: 'Array',
          definition: new ComponentAttributeDefinition({
            name: 'other',
            type: 'Link',
          }),
        })]);
      });

      it('Should remove value corresponding to the given id in links array', () => {
        const component = new Component();

        component.attributes.push(new ComponentAttribute({
          name: 'link',
          value: ['test', 'other'],
          type: 'Array',
          definition: new ComponentAttributeDefinition({
            name: 'other',
            type: 'Link',
          }),
        }));

        component.removeLinkAttribute('test', 'link');
        expect(component.attributes).toEqual([new ComponentAttribute({
          name: 'link',
          value: ['other'],
          type: 'Array',
          definition: new ComponentAttributeDefinition({
            name: 'other',
            type: 'Link',
          }),
        })]);
      });

      it(
        'Should remove value from given attribute then the attribute itself if it\'s empty.',
        () => {
          const component = new Component();

          component.attributes.push(new ComponentAttribute({
            name: 'link',
            value: ['test'],
            type: 'Array',
            definition: new ComponentAttributeDefinition({
              name: 'link',
              type: 'Link',
            }),
          }));

          component.removeLinkAttribute('test', 'link');
          expect(component.attributes[0].value).toEqual([]);
        },
      );

      it('Should remove value corresponding to the given id in links array', () => {
        const component = new Component();

        component.attributes.push(new ComponentAttribute({
          name: 'link',
          value: ['test', 'other'],
          type: 'Array',
          definition: new ComponentAttributeDefinition({
            name: 'link',
            type: 'Link',
          }),
        }));

        component.removeLinkAttribute('test', 'link');
        expect(component.attributes).toEqual([new ComponentAttribute({
          name: 'link',
          value: ['other'],
          type: 'Array',
          definition: new ComponentAttributeDefinition({
            name: 'link',
            type: 'Link',
          }),
        })]);
      });

      it('Should remove the given ComponentLink id in the value array.', () => {
        const component = new Component();

        component.attributes.push(new ComponentAttribute({
          name: 'link',
          value: ['test'],
          type: 'Array',
          definition: new ComponentAttributeDefinition({
            name: 'link',
            type: 'Link',
          }),
        }));

        component.removeLinkAttribute('test', 'link');
        expect(component.attributes[0].value).toEqual([]);
      });

      it('Should remove the given ComponentLink id in sub attribute.', () => {
        const component = new Component();

        component.attributes.push(new ComponentAttribute({
          name: 'object',
          value: [new ComponentAttribute({
            name: 'link',
            value: ['test'],
            type: 'Array',
            definition: new ComponentAttributeDefinition({
              name: 'link',
              type: 'Link',
            }),
          })],
          type: 'Object',
          definition: new ComponentAttributeDefinition({
            name: 'object',
            type: 'Object',
            definition: new ComponentAttributeDefinition({
              name: 'link',
              type: 'Link',
            }),
          }),
        }));

        component.removeLinkAttribute('test', 'link');

        expect(component.attributes).toEqual([
          new ComponentAttribute({
            name: 'object',
            value: [new ComponentAttribute({
              name: 'link',
              value: [],
              type: 'Array',
              definition: new ComponentAttributeDefinition({
                name: 'link',
                type: 'Link',
              }),
            })],
            type: 'Object',
            definition: new ComponentAttributeDefinition({
              name: 'object',
              type: 'Object',
              definition: new ComponentAttributeDefinition({
                name: 'link',
                type: 'Link',
              }),
            }),
          }),
        ]);
      });
    });

    describe('Test: method, __getLinkAttribute', () => {
      it('Should retrieve nothing without definition', () => {
        const component = new Component({
          definition: new ComponentDefinition(),
        });
        const parents = [];
        const attributeDefinition = component.__getLinkAttribute(
          parents,
          component.definition.definedAttributes,
          new ComponentLink({
            definition: new ComponentLinkDefinition({
              attributeRef: 'link',
            }),
          }),
        );

        expect(parents).toEqual([]);
        expect(attributeDefinition).toBeNull();
      });

      it('Should retrieve root link', () => {
        const rootAttributeDefinition = new ComponentAttributeDefinition({
          name: 'link',
          type: 'Link',
        });
        const component = new Component({
          definition: new ComponentDefinition({
            definedAttributes: [rootAttributeDefinition],
          }),
        });
        const parents = [];
        const attributeDefinition = component.__getLinkAttribute(
          parents,
          component.definition.definedAttributes,
          new ComponentLink({
            definition: new ComponentLinkDefinition({
              attributeRef: 'link',
            }),
          }),
        );

        expect(attributeDefinition).toEqual(rootAttributeDefinition);
        expect(parents).toEqual([]);
      });

      it('Should retrieve sub link', () => {
        const subRootAttributeDefinition = new ComponentAttributeDefinition({
          name: 'link',
          type: 'Link',
        });
        const rootAttributeDefinition = new ComponentAttributeDefinition({
          name: 'root',
          type: 'Object',
          definedAttributes: [subRootAttributeDefinition],
        });
        const component = new Component({
          definition: new ComponentDefinition({
            definedAttributes: [
              new ComponentAttributeDefinition({
                name: 'rootWithoutWantedLink',
                type: 'Object',
                definedAttributes: [new ComponentAttributeDefinition({
                  name: 'notLink',
                  type: 'String',
                }), new ComponentAttributeDefinition({
                  name: 'notWantedLink',
                  type: 'Link',
                })],
              }),
              rootAttributeDefinition,
            ],
          }),
        });
        const parents = [];
        const attributeDefinition = component.__getLinkAttribute(
          parents,
          component.definition.definedAttributes,
          new ComponentLink({
            definition: new ComponentLinkDefinition({
              attributeRef: 'link',
            }),
          }),
        );

        expect(attributeDefinition).toEqual(subRootAttributeDefinition);
        expect(parents).toEqual([rootAttributeDefinition]);
      });
    });

    describe('Test method: getAttributeByName', () => {
      const component = new Component();
      const subAttribute = new ComponentAttribute({
        name: 'sub',
        value: 'test',
      });
      const rootAttribute = new ComponentAttribute({
        name: 'root',
        type: 'Object',
        value: [subAttribute],
      });

      component.attributes.push(rootAttribute);

      it('Should return null on unknown attribute', () => {
        expect(component.getAttributeByName('unknown')).toBeNull();
      });

      it('Should return root attribute on asking root attribute', () => {
        expect(component.getAttributeByName('root')).toEqual(rootAttribute);
      });

      it('Should return sub attribute on asking sub attribute', () => {
        expect(component.getAttributeByName('sub')).toEqual(subAttribute);
      });
    });

    describe('Test method: getAttributesByType', () => {
      const component = new Component();

      const attribute1 = new ComponentAttribute({
        name: 'attribute1',
        type: 'String',
        value: 'ref_1',
        definition: new ComponentAttributeDefinition({ name: 'attribute1', type: 'Reference' }),
      });
      const attribute2 = new ComponentAttribute({
        name: 'attribute2',
        type: 'Link',
        value: 'link_1',
        definition: new ComponentAttributeDefinition({ name: 'attribute2', type: 'Link' }),
      });
      const subAttribute = new ComponentAttribute({
        name: 'sub',
        type: 'Object',
        value: [attribute2],
        definition: new ComponentAttributeDefinition({ name: 'sub', type: 'Object' }),
      });
      const rootAttribute = new ComponentAttribute({
        name: 'root',
        type: 'Object',
        value: [subAttribute],
        definition: new ComponentAttributeDefinition({ name: 'root', type: 'Object' }),
      });

      component.attributes.push(attribute1);
      component.attributes.push(rootAttribute);

      it('Should return an empty array on unknown attribute types', () => {
        const result = component.getAttributesByType('unknownType');

        expect(result).toEqual([]);
      });

      it('Should return an empty array if no matching attribute types are found', () => {
        const result = component.getAttributesByType('Number');

        expect(result).toEqual([]);
      });

      it('Should search in sub-attributes and return attributes Object type', () => {
        const result = component.getAttributesByType('Object');

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('sub');
        expect(result[1].name).toBe('root');
      });
    });

    describe('Test method: getContainerId', () => {
      it('Should return null if there is no attributes', () => {
        expect(new Component().getContainerId()).toBeNull();
      });

      it('Should return null if there is no reference attributes', () => {
        expect(new Component({
          attributes: [new ComponentAttribute({
            name: 'test',
          })],
        }).getContainerId()).toBeNull();
      });

      it('Should return id if there is a reference attribute', () => {
        expect(new Component({
          attributes: [new ComponentAttribute({
            name: 'test',
            value: 'test',
            definition: new ComponentAttributeDefinition({
              type: 'Reference',
            }),
          })],
        }).getContainerId()).toEqual('test');
      });
    });

    describe('Test method: getDefinedAttributesByType', () => {
      const attributeDefinitionLink1 = new ComponentAttributeDefinition({
        name: 'attribute-link1',
        type: 'Link',
      });
      const attributeDefinitionLink2 = new ComponentAttributeDefinition({
        name: 'attribute-link2',
        type: 'Link',
      });
      const attributeDefinitionArray = new ComponentAttributeDefinition({
        name: 'attribute-array',
        type: 'Array',
      });
      const attributeDefinitionBoolean = new ComponentAttributeDefinition({
        name: 'attribute-boolean',
        type: 'Boolean',
      });
      const attributeDefinitionObject = new ComponentAttributeDefinition({
        name: 'attribute-object',
        type: 'Object',
        definedAttributes: [attributeDefinitionBoolean],
      });
      const component = new Component({
        definition: {
          definedAttributes: [
            attributeDefinitionLink1,
            attributeDefinitionLink2,
            attributeDefinitionArray,
            attributeDefinitionObject,
          ],
        },
      });

      it('Should return an array of defined attributes by type', () => {
        const definitionLink = component.getDefinedAttributesByType('Link');
        const definitionArray = component.getDefinedAttributesByType('Array');
        const definitionString = component.getDefinedAttributesByType('String');
        const definitionObject = component.getDefinedAttributesByType('Object');
        const definitionBoolean = component.getDefinedAttributesByType('Boolean');

        expect(definitionLink).toEqual([attributeDefinitionLink1, attributeDefinitionLink2]);
        expect(definitionArray).toEqual([attributeDefinitionArray]);
        expect(definitionString).toEqual([]);
        expect(definitionObject).toEqual([attributeDefinitionObject]);
        expect(definitionBoolean).toEqual([attributeDefinitionBoolean]);
      });
    });
  });

  describe('Test method: getErrors', () => {
    it('should not set error without attribute', () => {
      const component = new Component({
        definition: new ComponentDefinition(),
        id: 'id',
        attributes: [],
      });

      expect(component.getErrors()).toEqual([]);
    });

    it('should not set error with valid attribute', () => {
      const component = new Component({
        definition: new ComponentDefinition(),
        id: 'id',
        attributes: [new ComponentAttribute({
          definition: new ComponentAttributeDefinition({
            type: 'Number',
          }),
          name: 'test',
          type: 'Number',
          value: 1,
        })],
      });

      expect(component.getErrors()).toEqual([]);
    });

    it('should set error with invalid attribute', () => {
      const component = new Component({
        definition: new ComponentDefinition(),
        id: 'id',
        attributes: [new ComponentAttribute({
          definition: new ComponentAttributeDefinition({
            type: 'Number',
          }),
          name: 'test',
          type: 'Number',
          value: 'bad',
        })],
      });

      expect(component.getErrors()).toEqual([new ParserLog({
        componentId: 'id',
        attribute: 'test',
        severity: ParserLog.SEVERITY_ERROR,
        message: 'parser.error.notNumber',
      })]);
    });
  });

  describe('Test method: validateDefinition', () => {
    it('should not set warning with definition', () => {
      const component = new Component({
        definition: new ComponentDefinition(),
      });

      expect(component.validateDefinition()).toEqual([]);
    });

    it('should set warning without definition', () => {
      const component = new Component({
        id: 'id',
      });

      expect(component.validateDefinition()).toEqual([new ParserLog({
        componentId: 'id',
        severity: ParserLog.SEVERITY_WARNING,
        message: 'parser.warning.noComponentDefinition',
      })]);
    });
  });
});
