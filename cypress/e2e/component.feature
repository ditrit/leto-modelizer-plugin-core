Feature: Test component behavior

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


    Scenario: Move component should update its position
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentOne" at position "0,0"

        When I move "[data-cy=\"component-one\"]" to "216,412"
        Then I expect "[data-cy=\"component-one\"]" x position is "216"
        And I expect "[data-cy=\"component-one\"]" y position is "412"

    Scenario: Move two components should update their position
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentOne" at position "0,0"

        When I move "[data-cy=\"component-one\"]" to "216,412"
        And I create component "ComponentTwo" at position "0,200"
        And I move "[data-cy=\"component-two\"]" to "580, 780"
        Then I expect "[data-cy=\"component-one\"]" x position is "216"
        And I expect "[data-cy=\"component-one\"]" y position is "412"
        And I expect "[data-cy=\"component-two\"]" x position is "580"
        And I expect "[data-cy=\"component-two\"]" y position is "780"


    Scenario: Move component on top of another component should not be possible
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentOne" at position "0,0"
        And I create component "ComponentTwo" at position "200,200"

        When I move "[data-cy=\"component-two\"]" to "0,0"
        Then I expect "[data-cy=\"component-two\"]" x position is "200"
        And I expect "[data-cy=\"component-two\"]" y position is "200"


    Scenario: Move component inside container should populate the container
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentContainer" at position "0,0" type "container" accepts "container-child"
        And I create component "ComponentThatCanBeContained" at position "200,200" type "container-child"

        When I move "[data-cy=\"component-that-can-be-contained\"]" to "20,20"
        Then I expect "[data-cy=\"component-container\"]" "[data-cy=\"children\"]" contains "ComponentThatCanBeContained"


    Scenario: Move wrong component inside container should not populate the container
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentContainer" at position "0,0" type "container" accepts "container-child"
        And I create component "ComponentThatCannotBeContained" at position "200,200"

        When I move "[data-cy=\"component-that-cannot-be-contained\"]" to "0,0"
        Then I expect "[data-cy=\"component-container\"]" "[data-cy=\"children\"]" contains "EMPTY"
        And I expect "[data-cy=\"component-that-cannot-be-contained\"]" x position is "200"
        And I expect "[data-cy=\"component-that-cannot-be-contained\"]" y position is "200"


    Scenario: Delete component button should remove component from the page
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentOne" at position "0,0"

        When I click on "[data-cy=\"component-one-delete-button\"]"
        Then I expect "[data-cy=\"component-one\"]" does not exist
