Feature: Test component movement
  Background:
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"

  Scenario: Components should be draggable
    Then I expect "#root #svg-external1" to be at position 919,95

    When I drag "#root #svg-external1" of 25,25
    Then I expect "#root #svg-external1" is visible
    And I expect "#root #svg-external1" to be at position 944,122
