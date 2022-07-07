import LetoTypeNode from "src/models/LetoTypeNode";

describe('Test class: LetoTypeNode', () => {

  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const letoTypeNode = new LetoTypeNode();

      expect(letoTypeNode.logoPath).toBeNull();
      expect(letoTypeNode.type).toBeNull();
      expect(letoTypeNode.svgShape).toBeNull();
      expect(letoTypeNode.representation).toBeNull();
      expect(letoTypeNode.attributes).toEqual([]);
    });

    it('Check passing variable to constructor', () => {
      const letoTypeNode = new LetoTypeNode('logoPath', 'type', 'svgShape', 'representation', 'attributes');

      expect(letoTypeNode.logoPath).toEqual('logoPath');
      expect(letoTypeNode.type).toEqual('type');
      expect(letoTypeNode.svgShape).toEqual('svgShape');
      expect(letoTypeNode.representation).toEqual('representation');
      expect(letoTypeNode.attributes).toEqual('attributes');
    });
  });
});