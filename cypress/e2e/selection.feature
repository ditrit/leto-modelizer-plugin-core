Feature: Test component/link selection

  Background:
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"

  Scenario: Clicking on a component should select it and click again should deselect it
    When I click on ".component.network2 .components-background" with "Shift"
    Then I expect component ".component.network2 .model" to have style "outline" set to "deepskyblue solid 2px"
    And I expect component ".component.network2 .model" to have style "outline-offset" set to "2px"

    When I click on ".component.network2 .components-background" with "Shift"
    Then I expect component ".component.network2 .model" to have style "outline" set to ""
    And I expect component ".component.network2 .model" to have style "outline-offset" set to ""

  Scenario: Clicking on a different component should add it to the selection
    When I click on ".component.external1 .model" with "Shift"
    And  I click on ".component.network2 .components-background" with "Shift"
    Then I expect component ".component.external1 .model" to have style "outline" set to "deepskyblue solid 2px"
    And  I expect component ".component.external1 .model" to have style "outline-offset" set to "2px"
    And  I expect component ".component.network2 .model" to have style "outline" set to "deepskyblue solid 2px"
    And  I expect component ".component.network2 .model" to have style "outline-offset" set to "2px"

  Scenario: Clicking on a different component inside a different container should clear selection and set last component selected
    When I click on ".component.external1 .model" with "Shift"
    And  I click on ".component.network2 .components-background" with "Shift"
    Then I expect component ".component.external1 .model" to have style "outline" set to "deepskyblue solid 2px"
    And  I expect component ".component.external1 .model" to have style "outline-offset" set to "2px"
    And  I expect component ".component.network2 .model" to have style "outline" set to "deepskyblue solid 2px"
    And  I expect component ".component.network2 .model" to have style "outline-offset" set to "2px"

    When I click on ".component.server1 .model" with "Shift"
    Then I expect component ".component.external1 .model" to have style "outline" set to ""
    And  I expect component ".component.external1 .model" to have style "outline-offset" set to ""
    And  I expect component ".component.network2 .model" to have style "outline" set to ""
    And  I expect component ".component.network2 .model" to have style "outline-offset" set to ""
    And  I expect component ".component.server1 .model" to have style "outline" set to "deepskyblue solid 2px"
    And  I expect component ".component.server1 .model" to have style "outline-offset" set to "2px"

    When I click on ".component.external1 .model" with "Shift"
    Then I expect component ".component.external1 .model" to have style "outline" set to "deepskyblue solid 2px"
    And  I expect component ".component.external1 .model" to have style "outline-offset" set to "2px"
    And  I expect component ".component.server1 .model" to have style "outline" set to ""
    And  I expect component ".component.server1 .model" to have style "outline-offset" set to ""

  Scenario: Clicking on a component on read-only should not select it
    When I click on "#read-only-checkbox"
    And  I click on ".component.external1 .model" with "Shift"
    Then I expect component ".component.external1 .model" to have style "outline" set to ""
    And  I expect component ".component.external1 .model" to have style "outline-offset" set to ""
