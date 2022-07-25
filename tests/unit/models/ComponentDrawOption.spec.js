import ComponentDrawOption from "src/models/ComponentDrawOption";

describe('Test class: ComponentDrawOption', () => {

    describe('Test constructor', () => {
      it('Check variable instantiation', () => {
        const componentDrawOption = new ComponentDrawOption();
  
        expect(componentDrawOption.x).toBeNull();
        expect(componentDrawOption.y).toBeNull();
        expect(componentDrawOption.width).toBeNull();
        expect(componentDrawOption.height).toBeNull();
      });
  
      it('Check passing variable to constructor', () => {
        const componentDrawOption = new ComponentDrawOption(1, 2, 3, 4);
  
        expect(componentDrawOption.x).toEqual(1);
        expect(componentDrawOption.y).toEqual(2);
        expect(componentDrawOption.width).toEqual(3);
        expect(componentDrawOption.height).toEqual(4);
      });
    });
  });