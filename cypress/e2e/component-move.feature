Feature: Test component move

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


    Scenario: Move component inside container should populate the container and resize it
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentContainer" at position "0,0" type "container" accepts "container-child"
        And I create component "ComponentThatCanBeContained" at position "200,200" type "container-child"

        When I move "[data-cy=\"component-that-can-be-contained\"]" to "20,20"

        Then I expect "[data-cy=\"component-container\"]" "[data-cy=\"children\"]" contains "ComponentThatCanBeContained"
        And I expect "[data-cy=\"component-container\"]" height is "200"


    Scenario: Move two components inside container should populate the container and resize it
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentContainer" at position "0,0" type "container" accepts "container-child"
        And I create component "ComponentThatCanBeContainedOne" at position "200,200" type "container-child"
        And I create component "ComponentThatCanBeContainedTwo" at position "400,400" type "container-child"

        When I move "[data-cy=\"component-that-can-be-contained-one\"]" to "20,20"
        And I move "[data-cy=\"component-that-can-be-contained-two\"]" to "20,20"

        Then I expect "[data-cy=\"component-container\"]" "[data-cy=\"children\"]" contains "ComponentThatCanBeContainedOne,ComponentThatCanBeContainedTwo"
        And I expect "[data-cy=\"component-container\"]" height is "300"


    Scenario: Move component outside container should remove it from container children
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentContainer" at position "0,0" type "container" accepts "container-child"
        And I create component "ComponentThatCanBeContained" at position "200,200" type "container-child"
        And I move "[data-cy=\"component-that-can-be-contained\"]" to "20,20"

        When I move "[data-cy=\"component-that-can-be-contained\"]" to "400,400"

        Then I expect "[data-cy=\"component-container\"]" "[data-cy=\"children\"]" contains "EMPTY"
        And I expect "[data-cy=\"component-container\"]" x position is "400"
        And I expect "[data-cy=\"component-container\"]" y position is "400"


    Scenario: Move wrong component inside container should not populate the container
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentContainer" at position "0,0" type "container" accepts "container-child"
        And I create component "ComponentThatCannotBeContained" at position "200,200"

        When I move "[data-cy=\"component-that-cannot-be-contained\"]" to "20,20"

        Then I expect "[data-cy=\"component-container\"]" "[data-cy=\"children\"]" contains "EMPTY"
        And I expect "[data-cy=\"component-that-cannot-be-contained\"]" x position is "200"
        And I expect "[data-cy=\"component-that-cannot-be-contained\"]" y position is "200"
