Feature: Test component creation and selection

    Scenario: Create component should put it on the page
        Given I clear localstorage
        And I visit the "/"

        When I create component "ComponentOne" at position "0,0"
        Then I expect "[data-cy=\"component-one\"]" exists
        And I expect "[data-cy=\"component-one\"]" x position is "0"
        And I expect "[data-cy=\"component-one\"]" y position is "0"


    Scenario: Click on component should select it
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentOne" at position "0,0"

        When I click on "[data-cy=\"component-one\"]"
        Then I expect '[data-cy="component-selected"]' is "ComponentOne"


    Scenario: Click on another component should select it
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentOne" at position "0,0"
        And I create component "ComponentTwo" at position "0,200"
        And I click on "[data-cy=\"component-one\"]"

        When I click on "[data-cy=\"component-two\"]"
        Then I expect '[data-cy="component-selected"]' is "ComponentTwo"


    Scenario: Click on component inside container should select it
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentContainer" at position "0,0" type "container" accepts "container-child"
        And I create component "ComponentThatCanBeContained" at position "200,200" type "container-child"
        And I move "[data-cy=\"component-that-can-be-contained\"]" to "20,20"

        When I click on "[data-cy=\"component-that-can-be-contained\"]"
        Then I expect '[data-cy="component-selected"]' is "ComponentThatCanBeContained"
