import DefaultData from 'src/models/DefaultData';
import { version as CORE_VERSION } from 'package.json';
import ComponentDefinition from 'src/models/ComponentDefinition';
import Component from 'src/models/Component';
import ComponentAttribute from 'src/models/ComponentAttribute';
import ComponentAttributeDefinition from 'src/models/ComponentAttributeDefinition';
import ComponentLink from 'src/models/ComponentLink';

describe('Test class: DefaultData', () => {
  describe('Test constructor', () => {
    it('Check variables instantiation', () => {
      const pluginData = new DefaultData();

      expect(pluginData.name).toBeNull();
      expect(pluginData.version).toBeNull();
      expect(pluginData.components).toEqual([]);
      expect(pluginData.links).toEqual([]);
      expect(pluginData.parseErrors).toEqual([]);
      expect(pluginData.definitions).toEqual({ components: [], links: [] });
    });

    it('Check passing undefined variables to constructor', () => {
      let pluginData = new DefaultData({});

      expect(pluginData.name).toBeNull();
      expect(pluginData.version).toBeNull();
      expect(pluginData.components).toEqual([]);
      expect(pluginData.links).toEqual([]);
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
        links: [1],
        parseErrors: [2],
        definitions: {
          components: [3],
          links: [4],
        },
      });

      expect(pluginData.name).toEqual('name');
      expect(pluginData.version).toEqual('version');
      expect(pluginData.components).toEqual([0]);
      expect(pluginData.links).toEqual([1]);
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

      it('Should remove existing source link', () => {
        const pluginData = new DefaultData();
        pluginData.links.push(new ComponentLink({ source: 'root' }));
        pluginData.links.push(new ComponentLink({ source: 'test' }));

        pluginData.removeComponentById('root');
        expect(pluginData.links).toEqual([new ComponentLink({ source: 'test' })]);
      });

      it('Should remove existing target link', () => {
        const pluginData = new DefaultData();
        pluginData.links.push(new ComponentLink({ target: 'root' }));
        pluginData.links.push(new ComponentLink({ target: 'test' }));

        pluginData.removeComponentById('root');
        expect(pluginData.links).toEqual([new ComponentLink({ target: 'test' })]);
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
