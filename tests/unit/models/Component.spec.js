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
      expect(component.__class).toEqual('Component');
      expect(component.name).toEqual('name');
      expect(component.definition).toEqual('definition');
      expect(component.drawOption).toEqual('drawOption');
      expect(component.attributes).toEqual('attributes');
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
        'Should remove value from given attribute then the attribute itself if it\'s empty.',
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

      it('Should remove the given ComponentLink id in the value array.', () => {
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

    describe('Test method: hasError', () => {
      describe('Test not required attribute with no value', () => {
        const attributeDefinition = new ComponentAttributeDefinition({
          name: 'attribute-string',
          type: 'String',
        });

        it('Should return false if the attribute is not required', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-string',
            type: 'String',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError())
            .toEqual(false);
        });
      });

      describe('Test required attribute', () => {
        const attributeDefinition = new ComponentAttributeDefinition({
          name: 'attribute-string',
          type: 'String',
          required: true,
        });

        it('Should return false if the required attribute is provided', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-string',
            value: 'string',
            type: 'String',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(false);
        });

        it('Should return true if the required attribute isn\'t provided', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-strong',
            value: 'strong',
            type: 'String',
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(true);
        });

        it('Should return true if the value is empty', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-string',
            type: 'String',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(true);
        });

        it('Should not fail on Object type attribute', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-object',
            value: {},
            type: 'Array',
          });

          let error = null;

          try {
            new Component({
              attributes: [attribute],
              definition: {
                definedAttributes: [new ComponentAttributeDefinition({
                  name: 'attribute-object',
                  type: 'Object',
                  required: true,
                })],
              },
            }).hasError();
          } catch (e) {
            error = e;
          }
          expect(error).toBeNull();
        });

        it('Should not fail on Array type attribute', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-array',
            value: [],
            type: 'Array',
          });

          let error = null;

          try {
            new Component({
              attributes: [attribute],
              definition: {
                definedAttributes: [new ComponentAttributeDefinition({
                  name: 'attribute-array',
                  type: 'Array',
                  required: true,
                })],
              },
            }).hasError();
          } catch (e) {
            error = e;
          }
          expect(error).toBeNull();
        });

        it('Should not fail on Number type attribute', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-number',
            value: 1,
            type: 'Number',
          });

          let error = null;

          try {
            new Component({
              attributes: [attribute],
              definition: {
                definedAttributes: [new ComponentAttributeDefinition({
                  name: 'attribute-number',
                  type: 'Number',
                  required: true,
                })],
              },
            }).hasError();
          } catch (e) {
            error = e;
          }
          expect(error).toBeNull();
        });

        it('Should not fail on Boolean type attribute', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-boolean',
            value: true,
            type: 'Boolean',
          });

          let error = null;

          try {
            new Component({
              attributes: [attribute],
              definition: {
                definedAttributes: [new ComponentAttributeDefinition({
                  name: 'attribute-boolean',
                  type: 'Boolean',
                  required: true,
                })],
              },
            }).hasError();
          } catch (e) {
            error = e;
          }
          expect(error).toBeNull();
        });

        it('Should not fail on String type attribute', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-string',
            value: '',
            type: 'String',
          });

          let error = null;

          try {
            new Component({
              attributes: [attribute],
              definition: {
                definedAttributes: [new ComponentAttributeDefinition({
                  name: 'attribute-string',
                  type: 'String',
                  required: true,
                })],
              },
            }).hasError();
          } catch (e) {
            error = e;
          }
          expect(error).toBeNull();
        });
      });

      describe('Test String attribute', () => {
        const attributeDefinition = new ComponentAttributeDefinition({
          name: 'attribute-string',
          type: 'String',
          rules: {
            min: 5,
            max: 10,
            regex: /^[a-z]+$/,
          },
        });

        it('Should return false if the "values" rule includes the attribute\'s value', () => {
          const attributeDefinitionValue = new ComponentAttributeDefinition({
            name: 'attribute-string',
            type: 'String',
            rules: { values: ['test'] },
          });

          const attribute = new ComponentAttribute({
            name: 'attribute-string',
            value: 'test',
            type: 'String',
            definition: attributeDefinitionValue,
          });

          expect(new Component({
            attributes: [attribute],
            definition: { definedAttributes: [attributeDefinitionValue] },
          }).hasError()).toEqual(false);
        });

        it(
          'Should return true if the "values" rule doesn\'t include the attribute\'s value',
          () => {
            const attributeDefinitionValue = new ComponentAttributeDefinition({
              name: 'attribute-string',
              type: 'String',
              rules: {
                values: ['test'],
              },
            });

            const attribute = new ComponentAttribute({
              name: 'attribute-string',
              value: 'string',
              type: 'String',
              definition: attributeDefinitionValue,
            });

            expect(new Component({
              attributes: [attribute],
              definition: {
                definedAttributes: [attributeDefinitionValue],
              },
            }).hasError()).toEqual(true);
          },
        );

        it('Should return true if attribute\'s value is smaller than the "min" rule', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-string',
            value: 'str',
            type: 'String',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(true);
        });

        it('Should return true if attribute\'s value is bigger than the "max" rule', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-string',
            value: 'stringifies',
            type: 'String',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(true);
        });

        it(
          'Should return true if the attribute\'s value doesn\'t match the "regex" rule',
          () => {
            const attribute = new ComponentAttribute({
              name: 'attribute-string',
              value: 'String',
              type: 'String',
              definition: attributeDefinition,
            });

            expect(new Component({
              attributes: [attribute],
              definition: {
                definedAttributes: [attributeDefinition],
              },
            }).hasError()).toEqual(true);
          },
        );

        it('Should return true if value type isn\'t string', () => {
          const attributeDefinitionType = new ComponentAttributeDefinition({
            name: 'attribute-string',
            type: 'String',
          });

          const attribute = new ComponentAttribute({
            name: 'attribute-string',
            value: 1,
            type: 'String',
            definition: attributeDefinitionType,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinitionType],
            },
          }).hasError()).toEqual(true);
        });
      });

      describe('Test Boolean attribute', () => {
        it('Should return false if value type is a boolean', () => {
          const attributeDefinition = new ComponentAttributeDefinition({
            name: 'attribute-boolean',
            type: 'Boolean',
          });

          const attribute = new ComponentAttribute({
            name: 'attribute-boolean',
            value: false,
            type: 'Boolean',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: { definedAttributes: [attributeDefinition] },
          }).hasError()).toEqual(false);
        });

        it('Should return true if value type isn\'t boolean', () => {
          const attributeDefinition = new ComponentAttributeDefinition({
            name: 'attribute-boolean',
            type: 'Boolean',
          });

          const attribute = new ComponentAttribute({
            name: 'attribute-boolean',
            value: 'string',
            type: 'Boolean',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: { definedAttributes: [attributeDefinition] },
          }).hasError()).toEqual(true);
        });
      });

      describe('Test Number attribute', () => {
        const attributeDefinition = new ComponentAttributeDefinition({
          name: 'attribute-number',
          type: 'Number',
          rules: {
            min: 5,
            max: 10,
          },
        });

        it('Should return false if the "values" rule includes the attribute\'s value', () => {
          const attributeDefinitionValue = new ComponentAttributeDefinition({
            name: 'attribute-number',
            type: 'Number',
            rules: { values: [0, 1] },
          });

          const attribute = new ComponentAttribute({
            name: 'attribute-number',
            value: 1,
            type: 'Number',
            definition: attributeDefinitionValue,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinitionValue],
            },
          }).hasError()).toEqual(false);
        });

        it(
          'Should return true if the "values" rule doesn\'t include the attribute\'s value',
          () => {
            const attributeDefinitionValue = new ComponentAttributeDefinition({
              name: 'attribute-number',
              type: 'Number',
              rules: { values: [0, 1] },
            });

            const attribute = new ComponentAttribute({
              name: 'attribute-number',
              value: 2,
              type: 'Number',
              definition: attributeDefinitionValue,
            });

            expect(new Component({
              attributes: [attribute],
              definition: {
                definedAttributes: [attributeDefinitionValue],
              },
            }).hasError()).toEqual(true);
          },
        );

        it('Should return true if attribute\'s value is smaller than the "min" rule', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-number',
            value: 4,
            type: 'Number',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(true);
        });

        it('Should return true if attribute\'s value is bigger than the "max" rule', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-number',
            value: 11,
            type: 'Number',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(true);
        });

        it('Should return true if value type isn\'t number', () => {
          const attributeDefinitionType = new ComponentAttributeDefinition({
            name: 'attribute-number',
            type: 'Number',
          });

          const attribute = new ComponentAttribute({
            name: 'attribute-number',
            value: 'number',
            type: 'Number',
            definition: attributeDefinitionType,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinitionType],
            },
          }).hasError()).toEqual(true);
        });
      });

      describe('Test Object attribute', () => {
        const attributeDefinition = new ComponentAttributeDefinition({
          name: 'attribute-object',
          type: 'Object',
        });

        it('Should return false if value type is an object', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-object',
            value: [{}],
            type: 'Array',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(false);
        });

        it('Should return true if value type isn\'t an object', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-object',
            value: 'object',
            type: 'Array',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(true);
        });

        it('Should return false if the "values" rule includes the attribute\'s value', () => {
          const value1 = [{ test: 'test1' }];
          const value2 = [{ test: 'test2' }];
          const attributeDefinitionValue = new ComponentAttributeDefinition({
            name: 'attribute-object',
            type: 'Object',
            rules: { values: [value1, value2] },
          });

          const attribute = new ComponentAttribute({
            name: 'attribute-object',
            value: value2,
            type: 'Array',
            definition: attributeDefinitionValue,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinitionValue],
            },
          }).hasError()).toEqual(false);
        });

        it(
          'Should return true if the "values" rule doesn\'t include the attribute\'s value',
          () => {
            const value1 = [{ test: 'test1' }];
            const value2 = [{ test: 'test2' }];
            const attributeDefinitionValue = new ComponentAttributeDefinition({
              name: 'attribute-object',
              type: 'Object',
              rules: { values: [value1, value2] },
            });

            const attribute = new ComponentAttribute({
              name: 'attribute-object',
              value: [{}, {}],
              type: 'Array',
              definition: attributeDefinitionValue,
            });

            expect(new Component({
              attributes: [attribute],
              definition: {
                definedAttributes: [attributeDefinitionValue],
              },
            }).hasError()).toEqual(true);
          },
        );
      });

      describe('Test Array attribute', () => {
        const attributeDefinition = new ComponentAttributeDefinition({
          name: 'attribute-array',
          type: 'Array',
          rules: {
            min: 2,
            max: 5,
          },
        });

        it('Should return false if value type is an array', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-array',
            value: [1, 2, 3],
            type: 'Array',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(false);
        });

        it('Should return true if value type isn\'t an array', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-array',
            value: 'array',
            type: 'Array',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(true);
        });

        it('Should return true if array length is smaller than "min" rule', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-array',
            value: [1],
            type: 'Array',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(true);
        });

        it('Should return true if array length is bigger than "max" rule', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-array',
            value: [1, 2, 3, 4, 5, 6],
            type: 'Array',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(true);
        });

        it('Should return false if the "values" rule includes the attribute\'s value', () => {
          const value1 = ['test1'];
          const value2 = ['test2'];
          const attributeDefinitionValue = new ComponentAttributeDefinition({
            name: 'attribute-array',
            type: 'Array',
            rules: { values: [value1, value2] },
          });

          const attribute = new ComponentAttribute({
            name: 'attribute-array',
            value: value1,
            type: 'Array',
            definition: attributeDefinitionValue,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinitionValue],
            },
          }).hasError()).toEqual(false);
        });

        it(
          'Should return true if the "values" rule doesn\'t include the attribute\'s value',
          () => {
            const attributeDefinitionValue = new ComponentAttributeDefinition({
              name: 'attribute-array',
              type: 'Array',
              rules: { values: [['test1'], ['test2']] },
            });

            const attribute = new ComponentAttribute({
              name: 'attribute-array',
              value: ['test3'],
              type: 'Array',
              definition: attributeDefinitionValue,
            });

            expect(new Component({
              attributes: [attribute],
              definition: {
                definedAttributes: [attributeDefinitionValue],
              },
            }).hasError()).toEqual(true);
          },
        );
      });

      describe('Test Reference attribute', () => {
        const attributeDefinition = new ComponentAttributeDefinition({
          name: 'attribute-reference',
          type: 'Reference',
          rules: {
            min: 2,
            max: 4,
          },
        });

        it('Should return false if the "values" rule does include the attribute\'s value', () => {
          const attributeDefinitionValue = new ComponentAttributeDefinition({
            name: 'attribute-reference',
            type: 'Reference',
            rules: { values: ['reference00'] },
          });

          const attribute = new ComponentAttribute({
            name: 'attribute-reference',
            value: 'reference00',
            type: 'String',
            definition: attributeDefinitionValue,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinitionValue],
            },
          }).hasError()).toEqual(false);
        });

        it(
          'Should return true if the "values" rule doesn\'t include the attribute\'s value',
          () => {
            const attributeDefinitionValue = new ComponentAttributeDefinition({
              name: 'attribute-reference',
              type: 'Reference',
              rules: { values: ['reference00'] },
            });

            const attribute = new ComponentAttribute({
              name: 'attribute-reference',
              value: 'reference01',
              type: 'String',
              definition: attributeDefinitionValue,
            });

            expect(new Component({
              attributes: [attribute],
              definition: {
                definedAttributes: [attributeDefinitionValue],
              },
            }).hasError()).toEqual(true);
          },
        );

        it('Should return true if attribute\'s value is smaller than the "min" rule', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-reference',
            value: 'r',
            type: 'String',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(true);
        });

        it('Should return true if attribute\'s value is bigger than the "max" rule', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-reference',
            value: 'reference',
            type: 'String',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(true);
        });

        it('Should return true if value type isn\'t string', () => {
          const attributeDefinitionType = new ComponentAttributeDefinition({
            name: 'attribute-reference',
            type: 'Reference',
          });

          const attribute = new ComponentAttribute({
            name: 'attribute-reference',
            value: [1, 2, 3],
            type: 'String',
            definition: attributeDefinitionType,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinitionType],
            },
          }).hasError()).toEqual(true);
        });
      });

      describe('Test Link attribute', () => {
        const attributeDefinition = new ComponentAttributeDefinition({
          name: 'attribute-link',
          type: 'Link',
          rules: {
            min: 2,
            max: 4,
          },
        });

        it('Should return false if the "values" rule does include the attribute\'s value', () => {
          const links = ['link'];
          const attributeDefinitionValue = new ComponentAttributeDefinition({
            name: 'attribute-link',
            type: 'Link',
            rules: { values: [links] },
          });

          const attribute = new ComponentAttribute({
            name: 'attribute-link',
            value: links,
            type: 'Array',
            definition: attributeDefinitionValue,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinitionValue],
            },
          }).hasError()).toEqual(false);
        });

        it(
          'Should return true if the "values" rule doesn\'t include the attribute\'s value',
          () => {
            const attributeDefinitionValue = new ComponentAttributeDefinition({
              name: 'attribute-link',
              type: 'Link',
              rules: { values: [['link1']] },
            });

            const attribute = new ComponentAttribute({
              name: 'attribute-link',
              value: ['link2'],
              type: 'Array',
              definition: attributeDefinitionValue,
            });

            expect(new Component({
              attributes: [attribute],
              definition: {
                definedAttributes: [attributeDefinitionValue],
              },
            }).hasError()).toEqual(true);
          },
        );

        it('Should return true if attribute\'s value is smaller than the "min" rule', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-link',
            value: ['link1'],
            type: 'Array',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(true);
        });

        it('Should return true if attribute\'s value is bigger than the "max" rule', () => {
          const attribute = new ComponentAttribute({
            name: 'attribute-link',
            value: ['link0', 'link1', 'link2', 'link3', 'link4'],
            type: 'Array',
            definition: attributeDefinition,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinition],
            },
          }).hasError()).toEqual(true);
        });

        it('Should return true if value type isn\'t array', () => {
          const attributeDefinitionType = new ComponentAttributeDefinition({
            name: 'attribute-link',
            type: 'Link',
          });

          const attribute = new ComponentAttribute({
            name: 'attribute-link',
            value: 1,
            type: 'Array',
            definition: attributeDefinitionType,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinitionType],
            },
          }).hasError()).toEqual(true);
        });
      });

      describe('Test definition type is wrong', () => {
        it('Should return true if definition type is wrong', () => {
          const attributeDefinitionType = new ComponentAttributeDefinition({
            name: 'attribute-link',
            type: 'WrongType',
          });

          const attribute = new ComponentAttribute({
            name: 'attribute-link',
            value: 1,
            type: 'Array',
            definition: attributeDefinitionType,
          });

          expect(new Component({
            attributes: [attribute],
            definition: {
              definedAttributes: [attributeDefinitionType],
            },
          }).hasError()).toEqual(true);
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
        const component = new Component({
          definition: {
            definedAttributes: [
              attributeDefinitionLink1,
              attributeDefinitionLink2,
              attributeDefinitionArray,
            ],
          },
        });

        it('Should return an array of defined attributes by type', () => {
          const definitionLink = component.getDefinedAttributesByType('Link');
          const definitionArray = component.getDefinedAttributesByType('Array');
          const definitionString = component.getDefinedAttributesByType('String');

          expect(definitionLink).toEqual([attributeDefinitionLink1, attributeDefinitionLink2]);
          expect(definitionArray).toEqual([attributeDefinitionArray]);
          expect(definitionString).toEqual([]);
        });
      });
    });
  });
});
