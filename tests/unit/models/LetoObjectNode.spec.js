import LetoObjectNode from 'src/models/LetoObjectNode';

describe('Test class: LetoObjectNode', () => {

  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const letoObjectNode = new LetoObjectNode();

      expect(letoObjectNode.letoType).toBeNull();
      expect(letoObjectNode.name).toBeNull();
      expect(letoObjectNode.rightSibling).toBeNull();
      expect(letoObjectNode.contains).toEqual([])
      expect(letoObjectNode.attributesOutputLinks).toEqual([]);
      expect(letoObjectNode.attributesInputLinks).toEqual([]);
      expect(letoObjectNode.id).toBeNull();
      expect(letoObjectNode.x).toEqual(0);
      expect(letoObjectNode.y).toEqual(0);
      expect(letoObjectNode.width).toEqual(0);
      expect(letoObjectNode.height).toEqual(0);
    });

    it('Check passing variable to constructor', () => {
      const letoObjectNode = new LetoObjectNode('letoType', 'name', 'id');

      expect(letoObjectNode.letoType).toEqual('letoType');
      expect(letoObjectNode.name).toEqual('name');
      expect(letoObjectNode.rightSibling).toBeNull();
      expect(letoObjectNode.contains).toEqual([])
      expect(letoObjectNode.attributesOutputLinks).toEqual([]);
      expect(letoObjectNode.attributesInputLinks).toEqual([]);
      expect(letoObjectNode.id).toEqual('id');
      expect(letoObjectNode.x).toEqual(0);
      expect(letoObjectNode.y).toEqual(0);
      expect(letoObjectNode.width).toEqual(0);
      expect(letoObjectNode.height).toEqual(0);
    });
  });

  describe('Test methods', () => {
    describe('Test method: addContent', () => {
      const parent = new LetoObjectNode();
      parent.id = '1';
      const child1 = new LetoObjectNode();
      child1.id = '2';
      const child2 = new LetoObjectNode();
      child2.id = '3';

      expect(parent.contains).toEqual([]);

      parent.addContent(child1);
      expect(parent.contains.length).toEqual(1);
      expect(parent.contains[0]).not.toBeNull();
      expect(parent.contains[0].value.id).toEqual('2');
      expect(parent.contains[0].value.rightSibling).toBeNull();

      parent.addContent(child2);
      expect(parent.contains.length).toEqual(2);
      expect(parent.contains[1]).not.toBeNull();
      expect(parent.contains[1].value.id).toEqual('3');
      expect(parent.contains[1].value.rightSibling).toBeNull();
      expect(parent.contains[0].value.rightSibling).not.toBeNull();
      expect(parent.contains[0].value.rightSibling.id).toEqual('3');
    });
  });
});
