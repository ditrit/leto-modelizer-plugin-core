import { Given, Then } from '@badeball/cypress-cucumber-preprocessor';
import nunjucks from 'nunjucks';

Then('I expect {string} exists', (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  cy.get(selector).should('be.visible');
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

Then('I expect component/field/element {string} to have style {string} set to {string}', (templateSelector, templateExpectedStyleAttribute, templateExpectedStyleValue) => {
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
Then(/^I expect ["'](.*)["'] (?:is|to be) visible$/, (templateSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);

  cy.get(selector).should('be.visible').click().should('be.ok');
});

Then('I expect {string} to have {string} as parent', (templateSelector, templateParentSelector) => {
  const selector = nunjucks.renderString(templateSelector, cy.context);
  const parentSelector = nunjucks.renderString(templateParentSelector, cy.context);

  cy.get(selector).parents(parentSelector).should('exist');
});
