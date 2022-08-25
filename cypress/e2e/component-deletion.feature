Feature: Test component deletion

    Scenario: Delete component button should remove component from the page
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentOne" at position "0,0"

        When I click on "[data-cy=\"component-one-delete-button\"]"
        Then I expect "[data-cy=\"component-one\"]" does not exist


    Scenario: Delete and recreate component should be possible
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentOne" at position "0,0"
        And I click on "[data-cy=\"component-one-delete-button\"]"

        When I create component "ComponentOne" at position "0,0"
        Then I expect "[data-cy=\"component-one\"]" exists


    Scenario: Delete component inside container should remove it from container children
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentContainer" at position "0,0" type "container" accepts "container-child"
        And I create component "ComponentThatCanBeContained" at position "200,200" type "container-child"
        And I move "[data-cy=\"component-that-can-be-contained\"]" to "20,20"

        When I click on "[data-cy=\"component-that-can-be-contained-delete-button\"]"

        Then I expect "[data-cy=\"component-container\"]" exists
        And I expect "[data-cy=\"component-container\"]" "[data-cy=\"children\"]" contains "EMPTY"
        And I expect "[data-cy=\"component-that-can-be-contained\"]" does not exist


    Scenario: Delete container should remove its children
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentContainer" at position "0,0" type "container" accepts "container-child"
        And I create component "ComponentThatCanBeContained" at position "200,200" type "container-child"
        And I move "[data-cy=\"component-that-can-be-contained\"]" to "20,20"

        When I click on "[data-cy=\"component-container-delete-button\"]"

        Then I expect "[data-cy=\"component-that-can-be-contained\"]" does not exist
        And I expect "[data-cy=\"component-container\"]" does not exist