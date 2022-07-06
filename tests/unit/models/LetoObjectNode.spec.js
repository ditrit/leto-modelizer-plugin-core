import LetoObjectNode from "src/models/LetoObjectNode";

describe('Test class: LetoObjectNode', () => {

  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const letoObjectNode = new LetoObjectNode();

      expect(letoObjectNode.letoType).toBeNull();
      expect(letoObjectNode.name).toBeNull();
      expect(letoObjectNode.rightSibling).toBeNull();
      expect(letoObjectNode.contains).toEqual([])
      expect(letoObjectNode.attributes_output_links).toEqual([]);
      expect(letoObjectNode.attributes_input_links).toEqual([]);
      expect(letoObjectNode.id).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const letoObjectNode = new LetoObjectNode('letoType', 'name', 'id');

      expect(letoObjectNode.letoType).toEqual('letoType');
      expect(letoObjectNode.name).toEqual('name');
      expect(letoObjectNode.rightSibling).toBeNull();
      expect(letoObjectNode.contains).toEqual([])
      expect(letoObjectNode.attributes_output_links).toEqual([]);
      expect(letoObjectNode.attributes_input_links).toEqual([]);
      expect(letoObjectNode.id).toEqual('id');
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
      expect(parent.contains[0].value.nextNode).toBeNull();

      parent.addContent(child2);
      expect(parent.contains.length).toEqual(2);
      expect(parent.contains[1]).not.toBeNull();
      expect(parent.contains[1].value.id).toEqual('3');
      expect(parent.contains[1].value.nextNode).toBeNull();
      expect(parent.contains[0].value.nextNode).not.toBeNull();
      expect(parent.contains[0].value.nextNode.id).toEqual('3');
    });
    describe('Test method: addOutputLink, removeOutputLink', () => {
      const parent = new LetoObjectNode();
      const link = {
        targetId : "1",
        sourceId : "2",
        id : "1_to_2"
      };
      expect(parent.attributes_output_links).toEqual([]);

      parent.addOutputLink(link);
      expect(parent.attributes_output_links.length).toEqual(1);
      expect(parent.attributes_output_links[0]).not.toBeNull();
      expect(parent.attributes_output_links[0].id).toEqual("1_to_2");

      parent.removeOutputLink("1_to_2");
      expect(parent.attributes_output_links.length).toEqual(0);
      expect(parent.attributes_output_links[0]).toBeNull();
    });
    describe('Test method: addInputLink, removeInputLink', () => {
      const parent = new LetoObjectNode();
      const link = {
        targetId : "1",
        sourceId : "2",
        id : "1_to_2"
      };
      expect(parent.attributes_input_links).toEqual([]);

      parent.addInputLink(link);
      expect(parent.attributes_input_links.length).toEqual(1);
      expect(parent.attributes_input_links[0]).not.toBeNull();
      expect(parent.attributes_input_links[0].id).toEqual("1_to_2");

      parent.removeInputLink("1_to_2");
      expect(parent.attributes_input_links.length).toEqual(0);
      expect(parent.attributes_input_links[0]).toBeNull();
    });
  });
});
