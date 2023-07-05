import ComponentDrawOption from 'src/models/ComponentDrawOption';

describe('Test class: ComponentDrawOption', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const componentDrawOption = new ComponentDrawOption();

      expect(componentDrawOption.x).toBeNull();
      expect(componentDrawOption.y).toBeNull();
      expect(componentDrawOption.width).toBeNull();
      expect(componentDrawOption.height).toBeNull();
      expect(componentDrawOption.needsResizing).toEqual(false);
      expect(componentDrawOption.needsPositioning).toEqual(false);
      expect(componentDrawOption.manuallyResized).toEqual(false);
    });
    it('Check passing undefined variables to constructor', () => {
      const componentDrawOption = new ComponentDrawOption({});

      expect(componentDrawOption.x).toBeNull();
      expect(componentDrawOption.y).toBeNull();
      expect(componentDrawOption.width).toBeNull();
      expect(componentDrawOption.height).toBeNull();
      expect(componentDrawOption.needsResizing).toEqual(false);
      expect(componentDrawOption.needsPositioning).toEqual(false);
      expect(componentDrawOption.manuallyResized).toEqual(false);
    });

    it('Check passing variable to constructor', () => {
      const componentDrawOption = new ComponentDrawOption({
        x: 1,
        y: 2,
        width: 3,
        height: 4,
        needsResizing: true,
        needsPositioning: true,
        manuallyResized: true,
      });

      expect(componentDrawOption.x).toEqual(1);
      expect(componentDrawOption.y).toEqual(2);
      expect(componentDrawOption.width).toEqual(3);
      expect(componentDrawOption.height).toEqual(4);
      expect(componentDrawOption.needsResizing).toEqual(true);
      expect(componentDrawOption.needsPositioning).toEqual(true);
      expect(componentDrawOption.manuallyResized).toEqual(true);
    });
  });
});
