Feature: Test component movement

  Background:
    Given I clear localstorage
    And I visit the "/"

  @ignore
  Scenario: Components should be draggable
    Given I set viewport size to "1000" px for width and "660" px for height
    And I expect "svg#root svg#external1" to be at position 366,181

    When I drag "svg#root svg#external1" to 500,500
    Then I expect "svg#root svg#external1" is visible
    And I expect "svg#root svg#external1" to be at position 500,500
