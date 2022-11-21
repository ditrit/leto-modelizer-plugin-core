Feature: Test component selection

  Background:
    Given I clear localstorage
    And I visit the "/"


  Scenario: Clicking on a component should select it
    When I click on "#root #external1"
    Then I expect component "#root #external1" to have style "outlineColor" set to "rgb(0, 149, 255)"
    And I expect component "#root #external1" to have style "outlineStyle" set to "solid"
    And I expect component "#root #external1" to have style "outlineWidth" set to "2px"

  Scenario: Clicking again on a component should deselect it
    Given I click on "#root #external1"

    When I click on "#root #external1"
    Then I expect component "#root #external1" to have style "outline" set to ""


  Scenario: Clicking away from a selected component should deselect it
    Given I click on "#root #external1"

    When I click on "#root"
    Then I expect component "#root #external1" to have style "outline" set to ""


  Scenario: Clicking on a different component should select it and deselect the previous one
    Given I click on "#root #external1"

    When I click on "#root #internal1"
    Then I expect component "#root #external1" to have style "outline" set to ""
    And I expect component "#root #internal1" to have style "outlineColor" set to "rgb(0, 149, 255)"
    And I expect component "#root #internal1" to have style "outlineStyle" set to "solid"
    And I expect component "#root #internal1" to have style "outlineWidth" set to "2px"
