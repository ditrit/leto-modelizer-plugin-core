Feature: Test plugin renderer

  Background:
    Given I clear localstorage
    And I visit the "/"

  Scenario: The renderer should be present
    Then I expect "#root>svg" is visible

  Scenario: Components should be loaded in the renderer
    Then I expect ".component" appear 6 times on screen
    And I expect ".component-DefaultModel" appear 4 times on screen
    And I expect ".component-DefaultContainer" appear 2 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible

  Scenario: Components should be properly nested
    Then I expect "#server1" to have "#network1 .component-container" as parent
    And I expect "#server2" to have "#network1 .component-container" as parent

  Scenario: links should be loaded in the renderer
    Then I expect ".link" appear 2 times on screen
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible
