/**
 * simulate a user dragging and dropping an element
 * @param {string} dragSelector - the element to drag
 * @param {string | object} dropSelector - where to drop the element,
 * either a set of coordinates or another element's selector
 */
export function drag(dragSelector, dropSelector) {
  const draggable = Cypress.$(dragSelector)[0];
  const originCoords = draggable.getBoundingClientRect();

  let targetCoords;

  if (typeof dropSelector === 'string') {
    const droppable = Cypress.$(dropSelector)[0];
    targetCoords = droppable.getBoundingClientRect();
    targetCoords.x += targetCoords.width * 0.1;
    targetCoords.y += targetCoords.height * 0.1;
  } else {
    targetCoords = dropSelector;
  }

  cy.window().then((win) => {
    draggable.dispatchEvent(
      new MouseEvent(
        'mousedown',
        { clientX: originCoords.x, clientY: originCoords.y, view: win },
      ),
    );
    draggable.dispatchEvent(new MouseEvent('mousemove', {
      view: win,
      clientX: targetCoords.x,
      clientY: targetCoords.y,
    }));
    draggable.dispatchEvent(new MouseEvent('mouseup', { view: win }));
  });
}
