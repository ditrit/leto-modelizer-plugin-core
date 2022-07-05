import LetoObjectNode from "src/models/LetoObjectNode";

describe('Test class: LetoObjectNode', () => {

  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const letoObjectNode = new LetoObjectNode();

      expect(letoObjectNode.svg).toBeNull();
      expect(letoObjectNode.logoPath).toBeNull();
      expect(letoObjectNode.type).toBeNull();
      expect(letoObjectNode.name).toBeNull();
      expect(letoObjectNode.nextNode).toBeNull();
      expect(letoObjectNode.children).toEqual([])
      expect(letoObjectNode.links).toEqual({ inputs: [], outputs: [] });
      expect(letoObjectNode.id).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const letoObjectNode = new LetoObjectNode('logoPath', 'type', 'svg', 'name', 'id');

      expect(letoObjectNode.svg).toEqual('svg');
      expect(letoObjectNode.logoPath).toEqual('logoPath');
      expect(letoObjectNode.type).toEqual('type');
      expect(letoObjectNode.name).toEqual('name');
      expect(letoObjectNode.nextNode).toBeNull();
      expect(letoObjectNode.children).toEqual([])
      expect(letoObjectNode.links).toEqual({ inputs: [], outputs: [] });
      expect(letoObjectNode.id).toEqual('id');
    });
  });

  describe('Test methods', () => {
    describe('Test method: addChild', () => {
      const parent = new LetoObjectNode();
      parent.id = '1';
      const child1 = new LetoObjectNode();
      child1.id = '2';
      const child2 = new LetoObjectNode();
      child2.id = '3';

      expect(parent.children).toEqual([]);

      parent.addChild(child1);
      expect(parent.children.length).toEqual(1);
      expect(parent.children[0]).not.toBeNull();
      expect(parent.children[0].id).toEqual('2');
      expect(parent.children[0].nextNode).toBeNull();

      parent.addChild(child2);
      expect(parent.children.length).toEqual(2);
      expect(parent.children[1]).not.toBeNull();
      expect(parent.children[1].id).toEqual('3');
      expect(parent.children[1].nextNode).toBeNull();
      expect(parent.children[0].nextNode).not.toBeNull();
      expect(parent.children[0].nextNode.id).toEqual('3');
    });
  });
});
