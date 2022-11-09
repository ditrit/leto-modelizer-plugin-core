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
  });
});
