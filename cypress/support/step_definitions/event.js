import { When } from '@badeball/cypress-cucumber-preprocessor';
import nunjucks from 'nunjucks';

When('I click on {string}', (selector) => cy.get(selector).click());

When('I drag {string} onto {string}', (templateOriginSelector, templateDestinationSelector) => {
  const originSelector = nunjucks.renderString(templateOriginSelector, cy.context);
  const destinationSelector = nunjucks.renderString(templateDestinationSelector, cy.context);

  cy.drag(originSelector, destinationSelector);
});

When('I drag {string} to {int},{int}', (templateSelector, x, y) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);

  cy.drag(selector, { x, y });
});
