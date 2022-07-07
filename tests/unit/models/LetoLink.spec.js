import LetoLink from 'src/models/LetoLink';

describe('Test class: LetoLink', () => {

  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const letoLink = new LetoLink();

      expect(letoLink.name).toBeNull();
      expect(letoLink.targetId).toBeNull();
      expect(letoLink.sourceId).toBeNull();
      expect(letoLink.id).toBeNull();
      expect(letoLink.sourceType).toBeNull();
      expect(letoLink.targetType).toBeNull();
      expect(letoLink.representation).toBeNull();
      expect(letoLink.required).toBeNull();
      expect(letoLink.multiple).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const letoLink = new LetoLink(
        'name',
        'targetId',
        'sourceId',
        'id',
        'sourceType',
        'targetType',
        'representation',
        'required',
        'multiple'
      );

      expect(letoLink.name).toEqual('name');
      expect(letoLink.targetId).toEqual('targetId');
      expect(letoLink.sourceId).toEqual('sourceId');
      expect(letoLink.id).toEqual('id');
      expect(letoLink.sourceType).toEqual('sourceType');
      expect(letoLink.targetType).toEqual('targetType');
      expect(letoLink.representation).toEqual('representation');
      expect(letoLink.required).toEqual('required');
      expect(letoLink.multiple).toEqual('multiple');
    });
  });
});