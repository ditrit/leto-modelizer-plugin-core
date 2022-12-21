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
    targetCoords.x = targetCoords.x - originCoords.x;
    targetCoords.y = targetCoords.y - originCoords.y;
  } else {
    targetCoords = dropSelector;
  }

  cy.get(dragSelector)
    .realMouseDown()
    .realMouseMove(targetCoords.x, targetCoords.y,  { position: "center" })
    .realMouseUp();
}

