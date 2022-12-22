Feature: Test container resizing

  Background:
    Given I clear localstorage
    And I set viewport size to "1000" px for width and "1080" px for height
    And I visit the "/"

  Scenario: Move component inside container should resize it
    Then I expect "#network1" width is 232
    And I expect "#network1" height is 185

    When I drag "#server2" of 10,10
    Then I expect "#network1" width is 242
    And I expect "#network1" height is 195

    When I drag "#server2" of -10,-10
    Then I expect "#network1" width is 232
    And I expect "#network1" height is 185
