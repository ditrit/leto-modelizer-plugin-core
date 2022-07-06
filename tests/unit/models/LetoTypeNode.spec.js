import LetoTypeNode from "src/models/LetoTypeNode";

describe('Test class: LetoTypeNode', () => {

  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const letoTypeNode = new LetoTypeNode();

      expect(letoTypeNode.logoPath).toBeNull();
      expect(letoTypeNode.type).toBeNull();
      expect(letoTypeNode.svgShape).toBeNull();
      expect(letoTypeNode.representation).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const letoObjectNode = new LetoObjectNode('logoPath', 'type', 'svgShape', 'representation');

      expect(letoObjectNode.logoPath).toEqual('logoPath');
      expect(letoObjectNode.type).toEqual('type');
      expect(letoObjectNode.svgShape).toEqual('svgShape');
      expect(letoObjectNode.representation).toEqual('representation');
    });
  });
});