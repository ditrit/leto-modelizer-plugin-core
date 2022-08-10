export default function mockD3(jest) {
  const d3 = {};
  [
    'append', 'attr', 'call', 'data', 'drag',
    'each', 'enter', 'exit', 'getBBox', 'on',
    'remove', 'select', 'selectAll', 'style', 'select',
    'text', 'node',
  ].forEach((method) => {
    d3[method] = jest.fn(() => d3);
  });

  return d3;
}