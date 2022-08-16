import Component from 'src/models/Component';
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

    it('Check passing undefined variables to constructor', () => {
      const component = new Component({});

      expect(component.id).toBeNull();
      expect(component.name).toBeNull();
      expect(component.definition).toBeNull();
      expect(component.drawOption).toBeNull();
      expect(component.attributes).toEqual([]);
      expect(component.children).toEqual([]);
    });

    it('Check passing all variables to constructor', () => {
      const component = new Component({
        id: 'id',
        name: 'name',
        definition: 'definition',
        drawOption: 'drawOption',
        attributes: 'attributes',
        children: 'children',
      });

      expect(component.id).toEqual('id');
      expect(component.name).toEqual('name');
      expect(component.definition).toEqual('definition');
      expect(component.drawOption).toEqual('drawOption');
      expect(component.attributes).toEqual('attributes');
      expect(component.children).toEqual('children');
    });
  });

  describe('Test methods', () => {
    describe('Test method: addChild', () => {
      it('Check passing child in children', () => {
        const componentDefinition = new ComponentDefinition({ isContainer: true, type: 'parent1' });
        const parent = new Component({ id: '1', definition: componentDefinition });
        const child1 = new Component({ id: '2', definition: { parentTypes: ['parent1'] } });
        const child2 = new Component({ id: '3', definition: { parentTypes: ['parent1'] } });
        parent.addChild(child1);
        expect(parent.children.length).toEqual(1);
        expect(parent.children[0]).not.toBeNull();
        expect(parent.children[0].id).toEqual('2');

        parent.addChild(child2);
        expect(parent.children.length).toEqual(2);
        expect(parent.children[1]).not.toBeNull();
        expect(parent.children[1].id).toEqual('3');
      });
      it('Check not passing child if isContainer is false', () => {
        const componentDefinition = new ComponentDefinition({ isContainer: false, type: 'parent1' });
        const parent = new Component({ id: '1', definition: componentDefinition });
        const child = new Component({ id: '2', definition: { parentTypes: ['parent1'] } });
        parent.addChild(child);
        expect(parent.children.length).toEqual(0);
      });
      it('Check not passing child if parentType and type not equal', () => {
        const componentDefinition = new ComponentDefinition({ isContainer: true, type: 'parent1' });
        const parent = new Component({ id: '1', definition: componentDefinition });
        const child = new Component({ id: '2', definition: { parentTypes: ['parent2'] } });
        parent.addChild(child);
        expect(parent.children.length).toEqual(0);
      });
      it('Check not passing child if it already exists in children', () => {
        const componentDefinition = new ComponentDefinition({ isContainer: true, type: 'parent1' });
        const parent = new Component({ id: '1', definition: componentDefinition });
        const child = new Component({ id: '2', definition: { parentTypes: ['parent1'] } });
        parent.addChild(child);
        expect(parent.children.length).toEqual(1);
        parent.addChild(child);
        expect(parent.children.length).toEqual(1);
      });
    });
  });
});
