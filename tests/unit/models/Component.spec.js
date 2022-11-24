import Component from 'src/models/Component';
import ComponentAttribute from 'src/models/ComponentAttribute';
import ComponentDefinition from 'src/models/ComponentDefinition';
import ComponentAttributeDefinition from 'src/models/ComponentAttributeDefinition';
import ComponentLink from 'src/models/ComponentLink';

describe('Test class: Component', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const component = new Component();

      expect(component.id).toBeNull();
      expect(component.__class).toEqual('Component');
      expect(component.name).toBeNull();
      expect(component.definition).toBeNull();
      expect(component.drawOption).toBeNull();
      expect(component.attributes).toEqual([]);
      expect(component.children).toEqual([]);
      expect(component.path).toBeNull();
    });

    it('Check passing undefined variables to constructor', () => {
      const component = new Component({});

      expect(component.id).toBeNull();
      expect(component.__class).toEqual('Component');
      expect(component.name).toBeNull();
      expect(component.definition).toBeNull();
      expect(component.drawOption).toBeNull();
      expect(component.attributes).toEqual([]);
      expect(component.children).toEqual([]);
      expect(component.path).toBeNull();
    });

    it('Check passing all variables to constructor', () => {
      const component = new Component({
        id: 'id',
        name: 'name',
        definition: 'definition',
        drawOption: 'drawOption',
        attributes: 'attributes',
        children: 'children',
        path: 'path',
      });

      expect(component.id).toEqual('id');
      expect(component.__class).toEqual('Component');
      expect(component.name).toEqual('name');
      expect(component.definition).toEqual('definition');
      expect(component.drawOption).toEqual('drawOption');
      expect(component.attributes).toEqual('attributes');
      expect(component.children).toEqual('children');
      expect(component.path).toEqual('path');
    });
  });

  describe('Test methods', () => {
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
        expect(component.attributes[0]).toMatchObject({ name: 'container', value: 'containerId' });
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
        expect(component.attributes[0]).toMatchObject({ name: 'container', value: 'containerId' });
        expect(component.attributes[0].definition).not.toBeNull();
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

        expect(component.attributes.length)
          .toEqual(0);
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
        expect(component.attributes[0]).toMatchObject({ name: 'test', value: 'containerId' });
        expect(component.attributes[1]).toMatchObject({ name: 'container2', value: 'containerId' });
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

        expect(component.attributes.length)
          .toEqual(2);
        expect(component.attributes[0]).toMatchObject({ name: 'test', value: 'containerId' });
        expect(component.attributes[1]).toMatchObject({ name: 'container2', value: 'containerId' });
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

        expect(component.attributes.length)
          .toEqual(1);
        expect(component.attributes[0]).toMatchObject({ name: 'name', value: 'test' });
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
              new ComponentAttributeDefinition({ name: 'name01' }),
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
              new ComponentAttributeDefinition({ name: 'name01' }),
            ],
          }),
        });

        component.setLinkAttribute(link);
        expect(component.attributes.length).toEqual(1);
        expect(component.attributes[0].definition.name).toEqual('name01');
        expect(component.attributes[0].value).toEqual(['target02']);
      });

      it('Should do nothing when attribute already exists', () => {
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
              new ComponentAttributeDefinition({ name: 'name03' }),
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
          type: 'String',
          definition: new ComponentAttributeDefinition({
            name: 'other',
            type: 'Link',
          }),
        }));

        component.removeLinkAttribute('test', 'link');
        expect(component.attributes).toEqual([new ComponentAttribute({
          name: 'link',
          value: ['other'],
          type: 'String',
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
          type: 'String',
          definition: new ComponentAttributeDefinition({
            name: 'other',
            type: 'Link',
          }),
        }));

        component.removeLinkAttribute('test', 'link');
        expect(component.attributes).toEqual([new ComponentAttribute({
          name: 'link',
          value: ['other'],
          type: 'String',
          definition: new ComponentAttributeDefinition({
            name: 'other',
            type: 'Link',
          }),
        })]);
      });

      it(
        'Should remove value corresponding to the given id then the attribute if array is empty',
        () => {
          const component = new Component();

          component.attributes.push(new ComponentAttribute({
            name: 'link',
            value: ['test'],
            type: 'String',
            definition: new ComponentAttributeDefinition({
              name: 'other',
              type: 'Link',
            }),
          }));

          component.removeLinkAttribute('test', 'link');
          expect(component.attributes).toEqual([]);
        },
      );

      it('Should remove value corresponding to the given id in links array', () => {
        const component = new Component();

        component.attributes.push(new ComponentAttribute({
          name: 'link',
          value: ['test', 'other'],
          type: 'String',
          definition: new ComponentAttributeDefinition({
            name: 'other',
            type: 'Link',
          }),
        }));

        component.removeLinkAttribute('test');
        expect(component.attributes).toEqual([new ComponentAttribute({
          name: 'link',
          value: ['other'],
          type: 'String',
          definition: new ComponentAttributeDefinition({
            name: 'other',
            type: 'Link',
          }),
        })]);
      });

      it(
        'Should remove value corresponding to the given id then the attribute if array is empty',
        () => {
          const component = new Component();

          component.attributes.push(new ComponentAttribute({
            name: 'link',
            value: ['test'],
            type: 'String',
            definition: new ComponentAttributeDefinition({
              name: 'other',
              type: 'Link',
            }),
          }));

          component.removeLinkAttribute('test');
          expect(component.attributes).toEqual([]);
        },
      );
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
  });
});
