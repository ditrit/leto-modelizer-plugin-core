Feature: Test component/link deletion

  Background:
    Given I clear localstorage
    And I visit the "/"

  Scenario: Should be able to delete a component
    Then I expect ".component" appear 6 times on screen
    And I expect ".component-DefaultModel" appear 4 times on screen
    And I expect ".component-DefaultContainer" appear 2 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible

    When I click on "#external1"
    And I click on "#remove-component"
    Then I expect ".component" appear 5 times on screen
    And I expect ".component-DefaultModel" appear 3 times on screen
    And I expect ".component-DefaultContainer" appear 2 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible

  Scenario: Should be able to delete an empty container
    Then I expect ".component" appear 6 times on screen
    And I expect ".component-DefaultModel" appear 4 times on screen
    And I expect ".component-DefaultContainer" appear 2 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible

    When I click on "#network2"
    And I click on "#remove-component"
    Then I expect ".component" appear 5 times on screen
    And I expect ".component-DefaultModel" appear 4 times on screen
    And I expect ".component-DefaultContainer" appear 1 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#external1" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible

  Scenario: Should be able to delete a filled container
    Then I expect ".component" appear 6 times on screen
    And I expect ".component-DefaultModel" appear 4 times on screen
    And I expect ".component-DefaultContainer" appear 2 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible

    When I click on "top" of "#network1"
    And I click on "#remove-component"
    Then I expect ".component" appear 3 times on screen
    And I expect ".component-DefaultModel" appear 2 times on screen
    And I expect ".component-DefaultContainer" appear 1 times on screen
    And I expect "#internal1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible

  Scenario: Should be able to delete a link
    Then I expect ".link" appear 2 times on screen
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible

    When I click on "#link-server-laptop_link-server1-external1"
    And I click on "#remove-link"
    Then I expect ".link" appear 1 time on screen
    And I expect "#link-laptop-network_link-internal1-network1" is visible

  Scenario: Delete a linked component should also delete the link
    Then I expect ".component" appear 6 times on screen
    And I expect ".component-DefaultModel" appear 4 times on screen
    And I expect ".component-DefaultContainer" appear 2 times on screen
    And I expect ".link" appear 2 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible

    When I click on "top" of "#external1"
    And I click on "#remove-component"
    Then I expect ".component" appear 5 times on screen
    And I expect ".component-DefaultModel" appear 3 times on screen
    And I expect ".component-DefaultContainer" appear 2 times on screen
    And I expect ".link" appear 1 time on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible

  Scenario: Delete a linked container with a linked component inside should also delete all related links
    Then I expect ".component" appear 6 times on screen
    And I expect ".component-DefaultModel" appear 4 times on screen
    And I expect ".component-DefaultContainer" appear 2 times on screen
    And I expect ".link" appear 2 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible

    When I click on "top" of "#network1"
    And I click on "#remove-component"
    Then I expect ".component" appear 3 times on screen
    And I expect ".component-DefaultModel" appear 2 times on screen
    And I expect ".component-DefaultContainer" appear 1 time on screen
    And I expect ".link" appear 0 time on screen
    And I expect "#internal1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
