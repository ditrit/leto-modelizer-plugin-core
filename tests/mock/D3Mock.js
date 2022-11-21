export default function mockD3(jest) {
  const d3 = {};

  [
    'append', 'attr', 'call', 'data', 'drag', 'classed',
    'each', 'enter', 'exit', 'getBBox', 'on', 'linkHorizontal',
    'remove', 'select', 'selectAll', 'style', 'select',
    'text', 'node', 'html', 'transition', 'duration', 'datum',
    'source', 'target', 'join',
  ].forEach((method) => {
    d3[method] = jest.fn(() => d3);
  });

  return d3;
}
