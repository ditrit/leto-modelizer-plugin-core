Feature: Test component movement

  Background:
    Given I clear localstorage
    And I visit the "/"

  Scenario: Components should be draggable
    Given I set viewport size to "1000" px for width and "660" px for height
    And I expect "#root #svg-external1" to be at position 702,163

    When I drag "#root #svg-external1" of 25,25
    Then I expect "#root #svg-external1" is visible
    And I expect "#root #svg-external1" to be at position 727,188
