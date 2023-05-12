import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import nunjucks from 'nunjucks';

Then(/^I expect ["'](.*)["'] (?:is|to be) visible$/, (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).should('be.visible');
});

Then(/^I expect ["'](.*)["'] (?:is|to be) not visible$/, (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).should('not.be.visible');
});

Then(/^I expect ["'](.*)["'] (?:to exist|exists)$/, (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).should('exist');
});

Then(/^I expect ["'](.*)["'] to not exist$/, (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).should('not.exist');
});

Then('I expect {string} is {string}', (templateSelector, templateExpectedValue) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  const expectedValue = nunjucks.renderString(templateExpectedValue, cy.context);
  cy.get(selector).contains(expectedValue);
});

Then('I expect field {string} is {string}', (templateSelector, templateExpectedValue) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  const expectedValue = nunjucks.renderString(templateExpectedValue, cy.context);
  cy.get(selector).should('have.value', expectedValue);
});

Then('I expect field {string} is empty', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).should('be.empty');
});

Then('I expect field {string} is {string} as {string}', (templateSelector, templateExpectedValue, templateExpectedType) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  const expectedValue = nunjucks.renderString(templateExpectedValue, cy.context);
  const expectedType = nunjucks.renderString(templateExpectedType, cy.context);
  const translatedTypes = {
    number: 'Number',
    string: '',
  };
  cy.get(selector).should('have.value', expectedValue).and('have.attr', 'type', translatedTypes[expectedType]);
});

Then(/^I expect (?:switch|checkbox) ["'](.*)["'] (?:(?:to be)|is) (checked|unchecked)$/, (templateSelector, templateExpectedSwitchStatus) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  const expectedSwitchStatus = templateExpectedSwitchStatus === 'checked' ? 'true' : 'false';
  cy.get(selector).should('have.attr', 'aria-checked', expectedSwitchStatus);
});

Then('I expect component/field/element/link {string} to have style {string} set to {string}', (templateSelector, templateExpectedStyleAttribute, templateExpectedStyleValue) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  const expectedStyleAttribute = nunjucks.renderString(templateExpectedStyleAttribute, cy.context);
  const expectedStyleValue = nunjucks.renderString(templateExpectedStyleValue, cy.context);
  cy.get(selector).should(($elem) => {
    const element = $elem[0];
    expect(element.style[expectedStyleAttribute]).to.eq(expectedStyleValue);
  });
});

Given('I set viewport size to {string} px for width and {string} px for height', (width, height) => {
  cy.viewport(parseInt(width, 10), parseInt(height, 10));
});

Given('I clear field {string}', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).clear();
});

Given('I set on {string} text/number {string}', (templateSelector, templateValue) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  const value = nunjucks.renderString(templateValue, cy.context);

  cy.get(selector).type(value);
});

// check if element is in the DOM and is interactable
Then(/^I expect ["'](.*)["'] (?:is|to be) interactable$/, (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);

  cy.get(selector).click().should('be.ok');
});

Then('I expect {string} to have {string} as parent', (templateSelector, templateParentSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  const parentSelector = nunjucks.renderString(templateParentSelector, cy.context);

  cy.get(selector).parents(parentSelector).should('exist');
});

Then('I expect {string} to be at position {int},{int}', (templateSelector, x, y) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);

  cy.get(selector).should((element) => {
    expect(Math.trunc(element.position().left)).eq(x);
    expect(Math.trunc(element.position().top)).eq(y);
  });
});

Then('I expect {string} width is {int}', (templateSelector, width) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);

  cy.get(selector).should((element) => {
    expect(Math.trunc(element.width())).eq(width);
  });
});

Then('I expect {string} height is {int}', (templateSelector, height) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);

  cy.get(selector).should((element) => {
    expect(Math.trunc(element.height())).eq(height);
  });
});

Then('I expect {string} appear {int} time(s) on screen', (templateSelector, count) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).should('have.length', count);
});
