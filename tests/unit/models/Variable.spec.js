import Variable from 'src/models/Variable';

describe('Test class: Variable', () => {
  describe('Test constructor', () => {
    it('Check variable instantiation', () => {
      const variable = new Variable();

      expect(variable.name).toBeNull();
      expect(variable.type).toBeNull();
      expect(variable.value).toBeNull();
      expect(variable.category).toBeNull();
    });

    it('Check passing undefined variables to constructor', () => {
      const variable = new Variable({});

      expect(variable.name).toBeNull();
      expect(variable.type).toBeNull();
      expect(variable.value).toBeNull();
      expect(variable.category).toBeNull();
    });

    it('Check passing full variable to constructor', () => {
      const variable = new Variable({
        name: 'test_name',
        type: 'test_type',
        value: 'test_value',
        category: 'test_category',
      });

      expect(variable.name).toEqual('test_name');
      expect(variable.type).toEqual('test_type');
      expect(variable.value).toEqual('test_value');
      expect(variable.category).toEqual('test_category');
    });

    it('Check passing partial variable to constructor', () => {
      const variable = new Variable({
        name: 'test_name',
        value: 'test_value',
      });

      expect(variable.name).toEqual('test_name');
      expect(variable.type).toBeNull();
      expect(variable.value).toEqual('test_value');
      expect(variable.category).toBeNull();
    });

    it('Check passing variable to constructor', () => {
      const variable = new Variable({
        category: 'variable',
      });

      expect(variable.category).toEqual('variable');
    });
  });
});
