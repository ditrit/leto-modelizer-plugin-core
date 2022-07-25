import Component from 'src/models/Component';
import ComponentDrawOption from 'src/models/ComponentDrawOption';
import ComponentDefinition from 'src/models/ComponentDefinition';

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
    });

    it('Check passing variable to constructor', () => {
      const drawOption = new ComponentDrawOption(1.0, 1.0, 1, 1);
      const component = new Component('id', 'name', 'type', drawOption);

      expect(component.id).toEqual('id');
      expect(component.name).toEqual('name');
      expect(component.definition).toEqual('type');
      expect(component.drawOption).toEqual(drawOption);
    });
  });

  describe('Test methods', () => {
    describe('Test method: addChild', () => {
      it('Check passing child in children', () => {
        const componentDefinition = new ComponentDefinition(
          'type',
          'resourceType',
          'icon',
          'svg',
          ['type'],
          'attribute',
          true,
        );
        const child1 = new Component('2', 'child1', componentDefinition, 'drawOption');
        const child2 = new Component('3', 'child2', componentDefinition, 'drawOption');
        const component = new Component('id', 'name', componentDefinition, 'drawOption');
        component.addChild(child1);
        expect(component.children.length).toEqual(1);
        expect(component.children[0]).not.toBeNull();
        expect(component.children[0].id).toEqual('2');
        expect(component.children[0].name).toEqual('child1');

        component.addChild(child2);
        expect(component.children.length).toEqual(2);
        expect(component.children[1]).not.toBeNull();
        expect(component.children[1].id).toEqual('3');
        expect(component.children[1].name).toEqual('child2');
      });
      it('Check not passing child if isContainer is false', () => {
        const componentDefinition = new ComponentDefinition(
          'type',
          'resourceType',
          'icon',
          'svg',
          ['type'],
          'attribute',
          false,
        );
        const parent = new Component('id', 'name', componentDefinition, 'drawOption');
        const child = new Component('2', 'child', componentDefinition, 'drawOption');
        parent.addChild(child);
        expect(parent.children.length).toEqual(0);
      });
      it('Check not passing child if parentType and type not equal', () => {
        const definitionParent = new ComponentDefinition(
          'type1',
          'resourceType',
          'icon',
          'svg',
          ['type2'],
          'attribute',
          true,
        );
        const definitionChild = new ComponentDefinition(
          'type2',
          'resourceType',
          'icon',
          'svg',
          ['type'],
          'attribute',
          true,
        );
        const parent = new Component('id', 'name', definitionParent, 'drawOption');
        const child = new Component('2', 'child', definitionChild, 'drawOption');
        parent.addChild(child);
        child.addChild(parent);
        expect(parent.children.length).toEqual(0);
        expect(child.children.length).toEqual(1);
      });
      it('Check not passing child if it already exists in children', () => {
        const definition = new ComponentDefinition(
          'type',
          'resourceType',
          'icon',
          'svg',
          ['type'],
          'attribute',
          true,
        );
        const parent = new Component('id', 'name', definition, 'drawOption');
        const child = new Component('2', 'child', definition, 'drawOption');
        parent.addChild(child);
        expect(parent.children.length).toEqual(1);
        parent.addChild(child);
        expect(parent.children.length).toEqual(1);
      });
    });
  });
});
