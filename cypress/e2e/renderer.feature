Feature: Test plugin renderer

  Background:
    Given I clear localstorage
    And I visit the "/"

  Scenario: The renderer should be present
    Then I expect "#root>svg" is visible

  Scenario: Components should be loaded in the renderer
    Then I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible

  Scenario: Components should be properly nested
    Then I expect "#server1" to have "#network1 .component-container" as parent
    And I expect "#server2" to have "#network1 .component-container" as parent
