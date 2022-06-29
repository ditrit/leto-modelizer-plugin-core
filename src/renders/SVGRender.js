import { evaluate } from 'mathjs';

/**
 * Renders the template raw string with the context.
 *
 * @param {String} template Raw string that contains the 'jinja' variables.
 * @param {Object} context Object that contains all the variables to be replace.
 * @returns {String} The rendering template.
 * @example
 * const svg = renderString('<svg id="N{{id}}">...</svg>', { id: 1 });
 * console.log(svg); // Should return '<svg id="1">...</svg>'.
 */
export default function renderString(template, context) {
  return template.replace(/([TN]){{([^}]*)}}/g, (m, op, found) => (op === 'N'
    ? evaluate(found, context)
    : found
      .split(',')
      .map((x) => (context[x] ? context[x] : x))
      .join('')));
}
