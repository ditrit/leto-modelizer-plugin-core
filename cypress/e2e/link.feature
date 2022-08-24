Feature: Test links between components

    Scenario: Link two components should save their link information
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentOne" at position "0,0" link-groups "toto"
        And I create component "ComponentTwo" at position "200,200" link-groups "toto"

        When I link "[data-cy=\"component-one\"]" and "[data-cy=\"component-two\"]"

        Then I expect "[data-cy=\"component-one\"]" "[data-cy=\"links\"]" contains "ComponentTwo"
        And I expect "[data-cy=\"component-two\"]" "[data-cy=\"links\"]" contains "ComponentOne"


    Scenario: Link two incompatible components should not be possible
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentOne" at position "0,0" link-groups "toto"
        And I create component "ComponentTwo" at position "200,200" link-groups "tata"

        When I link "[data-cy=\"component-one\"]" and "[data-cy=\"component-two\"]"

        Then I expect "[data-cy=\"component-one\"]" "[data-cy=\"links\"]" contains "EMPTY"
        And I expect "[data-cy=\"component-two\"]" "[data-cy=\"links\"]" contains "EMPTY"


    Scenario: Unlink two components should update their link information
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentOne" at position "0,0" link-groups "toto"
        And I create component "ComponentTwo" at position "200,200" link-groups "toto"
        And I link "[data-cy=\"component-one\"]" and "[data-cy=\"component-two\"]"

        When I unlink "[data-cy=\"component-one\"]" and "[data-cy=\"component-two\"]"

        Then I expect "[data-cy=\"component-one\"]" "[data-cy=\"links\"]" contains "EMPTY"
        And I expect "[data-cy=\"component-two\"]" "[data-cy=\"links\"]" contains "EMPTY"


    Scenario: Multiple links between components should be possible
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentOne" at position "0,0" link-groups "toto"
        And I create component "ComponentTwo" at position "200,200" link-groups "toto"
        And I create component "ComponentThree" at position "400,400" link-groups "toto"

        When I link "[data-cy=\"component-one\"]" and "[data-cy=\"component-two\"]"
        And I link "[data-cy=\"component-two\"]" and "[data-cy=\"component-three\"]"
        And I link "[data-cy=\"component-three\"]" and "[data-cy=\"component-one\"]"

        Then I expect "[data-cy=\"component-one\"]" "[data-cy=\"links\"]" contains "ComponentTwo,ComponentThree"
        And I expect "[data-cy=\"component-two\"]" "[data-cy=\"links\"]" contains "ComponentOne,ComponentThree"
        And I expect "[data-cy=\"component-three\"]" "[data-cy=\"links\"]" contains "ComponentOne,ComponentTwo"


    Scenario: Multiple links between components having multiple link types should be possible
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentOne" at position "0,0" link-groups "toto,titi"
        And I create component "ComponentTwo" at position "200,200" link-groups "toto,tata"
        And I create component "ComponentThree" at position "400,400" link-groups "tata"
        And I create component "ComponentFour" at position "400,400" link-groups "titi,tata"

        When I link "[data-cy=\"component-one\"]" and "[data-cy=\"component-two\"]"
        And I link "[data-cy=\"component-two\"]" and "[data-cy=\"component-three\"]"
        And I link "[data-cy=\"component-three\"]" and "[data-cy=\"component-four\"]"
        And I link "[data-cy=\"component-one\"]" and "[data-cy=\"component-four\"]"
        And I link "[data-cy=\"component-two\"]" and "[data-cy=\"component-four\"]"

        Then I expect "[data-cy=\"component-one\"]" "[data-cy=\"links\"]" contains "ComponentTwo,ComponentFour"
        And I expect "[data-cy=\"component-two\"]" "[data-cy=\"links\"]" contains "ComponentOne,ComponentThree,ComponentFour"
        And I expect "[data-cy=\"component-three\"]" "[data-cy=\"links\"]" contains "ComponentTwo,ComponentFour"
        And I expect "[data-cy=\"component-four\"]" "[data-cy=\"links\"]" contains "ComponentOne,ComponentTwo,ComponentThree"


    Scenario: Link between two components should be saved on component move
        Given I clear localstorage
        And I visit the "/"
        And I create component "ComponentOne" at position "0,0" link-groups "toto"
        And I create component "ComponentTwo" at position "200,200" link-groups "toto"
        And I link "[data-cy=\"component-one\"]" and "[data-cy=\"component-two\"]"

        When I move "[data-cy=\"component-one\"]" to "400,400"

        Then I expect "[data-cy=\"component-one\"]" "[data-cy=\"links\"]" contains "ComponentTwo"
        And I expect "[data-cy=\"component-two\"]" "[data-cy=\"links\"]" contains "ComponentOne"
