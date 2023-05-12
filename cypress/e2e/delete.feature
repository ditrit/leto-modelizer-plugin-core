Feature: Test component/link deletion
  Background:
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"

  Scenario: Should be able to delete a component
    Then I expect ".component" appear 16 times on screen
    And I expect ".component-DefaultModel" appear 12 times on screen
    And I expect ".component-DefaultContainer" appear 4 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible
    And I expect "#workflow1" is visible
    And I expect "#wfstep4" is visible
    And I expect "#wfstep3" is visible
    And I expect "#wfstep2" is visible
    And I expect "#wfstep1" is visible
    And I expect "#workflow2" is visible
    And I expect "#wfstep8" is visible
    And I expect "#wfstep7" is visible
    And I expect "#wfstep6" is visible
    And I expect "#wfstep5" is visible
    And I expect "#link-__workflow-__next-wfstep1-wfstep2" is visible
    And I expect "#link-__workflow-__next-wfstep2-wfstep3" is visible
    And I expect "#link-__workflow-__next-wfstep3-wfstep4" is visible
    And I expect "#link-__workflow-__next-wfstep5-wfstep6" is visible
    And I expect "#link-__workflow-__next-wfstep6-wfstep7" is visible
    And I expect "#link-__workflow-__next-wfstep7-wfstep8" is visible

    When I click on "#external1"
    And I click on "#remove-component"
    Then I expect ".component" appear 15 times on screen
    And I expect ".component-DefaultModel" appear 11 times on screen
    And I expect ".component-DefaultContainer" appear 4 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible
    And I expect "#workflow1" is visible
    And I expect "#wfstep4" is visible
    And I expect "#wfstep3" is visible
    And I expect "#wfstep2" is visible
    And I expect "#wfstep1" is visible
    And I expect "#workflow2" is visible
    And I expect "#wfstep8" is visible
    And I expect "#wfstep7" is visible
    And I expect "#wfstep6" is visible
    And I expect "#wfstep5" is visible
    And I expect "#link-__workflow-__next-wfstep1-wfstep2" is visible
    And I expect "#link-__workflow-__next-wfstep2-wfstep3" is visible
    And I expect "#link-__workflow-__next-wfstep3-wfstep4" is visible
    And I expect "#link-__workflow-__next-wfstep5-wfstep6" is visible
    And I expect "#link-__workflow-__next-wfstep6-wfstep7" is visible
    And I expect "#link-__workflow-__next-wfstep7-wfstep8" is visible

  Scenario: Should be able to delete an empty container
    Then I expect ".component" appear 16 times on screen
    And I expect ".component-DefaultModel" appear 12 times on screen
    And I expect ".component-DefaultContainer" appear 4 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible
    And I expect "#workflow1" is visible
    And I expect "#wfstep4" is visible
    And I expect "#wfstep3" is visible
    And I expect "#wfstep2" is visible
    And I expect "#wfstep1" is visible
    And I expect "#workflow2" is visible
    And I expect "#wfstep8" is visible
    And I expect "#wfstep7" is visible
    And I expect "#wfstep6" is visible
    And I expect "#wfstep5" is visible
    And I expect "#link-__workflow-__next-wfstep1-wfstep2" is visible
    And I expect "#link-__workflow-__next-wfstep2-wfstep3" is visible
    And I expect "#link-__workflow-__next-wfstep3-wfstep4" is visible
    And I expect "#link-__workflow-__next-wfstep5-wfstep6" is visible
    And I expect "#link-__workflow-__next-wfstep6-wfstep7" is visible
    And I expect "#link-__workflow-__next-wfstep7-wfstep8" is visible

    When I click on "#network2"
    And I click on "#remove-component"
    Then I expect ".component" appear 15 times on screen
    And I expect ".component-DefaultModel" appear 12 times on screen
    And I expect ".component-DefaultContainer" appear 3 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#external1" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible
    And I expect "#workflow1" is visible
    And I expect "#wfstep4" is visible
    And I expect "#wfstep3" is visible
    And I expect "#wfstep2" is visible
    And I expect "#wfstep1" is visible
    And I expect "#workflow2" is visible
    And I expect "#wfstep8" is visible
    And I expect "#wfstep7" is visible
    And I expect "#wfstep6" is visible
    And I expect "#wfstep5" is visible
    And I expect "#link-__workflow-__next-wfstep1-wfstep2" is visible
    And I expect "#link-__workflow-__next-wfstep2-wfstep3" is visible
    And I expect "#link-__workflow-__next-wfstep3-wfstep4" is visible
    And I expect "#link-__workflow-__next-wfstep5-wfstep6" is visible
    And I expect "#link-__workflow-__next-wfstep6-wfstep7" is visible
    And I expect "#link-__workflow-__next-wfstep7-wfstep8" is visible

  Scenario: Should be able to delete a filled container
    Then I expect ".component" appear 16 times on screen
    And I expect ".component-DefaultModel" appear 12 times on screen
    And I expect ".component-DefaultContainer" appear 4 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible
    And I expect "#workflow1" is visible
    And I expect "#wfstep4" is visible
    And I expect "#wfstep3" is visible
    And I expect "#wfstep2" is visible
    And I expect "#wfstep1" is visible
    And I expect "#workflow2" is visible
    And I expect "#wfstep8" is visible
    And I expect "#wfstep7" is visible
    And I expect "#wfstep6" is visible
    And I expect "#wfstep5" is visible
    And I expect "#link-__workflow-__next-wfstep1-wfstep2" is visible
    And I expect "#link-__workflow-__next-wfstep2-wfstep3" is visible
    And I expect "#link-__workflow-__next-wfstep3-wfstep4" is visible
    And I expect "#link-__workflow-__next-wfstep5-wfstep6" is visible
    And I expect "#link-__workflow-__next-wfstep6-wfstep7" is visible
    And I expect "#link-__workflow-__next-wfstep7-wfstep8" is visible

    When I click on "#icon-network1"
    And I click on "#remove-component"
    Then I expect ".component" appear 13 times on screen
    And I expect ".component-DefaultModel" appear 10 times on screen
    And I expect ".component-DefaultContainer" appear 3 times on screen
    And I expect "#internal1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
    And I expect "#workflow1" is visible
    And I expect "#wfstep4" is visible
    And I expect "#wfstep3" is visible
    And I expect "#wfstep2" is visible
    And I expect "#wfstep1" is visible
    And I expect "#workflow2" is visible
    And I expect "#wfstep8" is visible
    And I expect "#wfstep7" is visible
    And I expect "#wfstep6" is visible
    And I expect "#wfstep5" is visible
    And I expect "#link-__workflow-__next-wfstep1-wfstep2" is visible
    And I expect "#link-__workflow-__next-wfstep2-wfstep3" is visible
    And I expect "#link-__workflow-__next-wfstep3-wfstep4" is visible
    And I expect "#link-__workflow-__next-wfstep5-wfstep6" is visible
    And I expect "#link-__workflow-__next-wfstep6-wfstep7" is visible
    And I expect "#link-__workflow-__next-wfstep7-wfstep8" is visible

  Scenario: Should be able to delete a link
    Then I expect ".link" appear 8 times on screen
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible

    When I click on "#link-server-laptop_link-server1-external1"
    And I click on "#remove-link"
    Then I expect ".link" appear 7 time on screen
    And I expect "#link-laptop-network_link-internal1-network1" is visible

  Scenario: Delete a linked component should also delete the link
    Then I expect ".component" appear 16 times on screen
    And I expect ".component-DefaultModel" appear 12 times on screen
    And I expect ".component-DefaultContainer" appear 4 times on screen
    And I expect ".link" appear 8 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible
    And I expect "#workflow1" is visible
    And I expect "#wfstep4" is visible
    And I expect "#wfstep3" is visible
    And I expect "#wfstep2" is visible
    And I expect "#wfstep1" is visible
    And I expect "#workflow2" is visible
    And I expect "#wfstep8" is visible
    And I expect "#wfstep7" is visible
    And I expect "#wfstep6" is visible
    And I expect "#wfstep5" is visible
    And I expect "#link-__workflow-__next-wfstep1-wfstep2" is visible
    And I expect "#link-__workflow-__next-wfstep2-wfstep3" is visible
    And I expect "#link-__workflow-__next-wfstep3-wfstep4" is visible
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible
    And I expect "#link-__workflow-__next-wfstep5-wfstep6" is visible
    And I expect "#link-__workflow-__next-wfstep6-wfstep7" is visible
    And I expect "#link-__workflow-__next-wfstep7-wfstep8" is visible

    When I click on "#icon-external1"
    And I click on "#remove-component"
    Then I expect ".component" appear 15 times on screen
    And I expect ".component-DefaultModel" appear 11 times on screen
    And I expect ".component-DefaultContainer" appear 4 times on screen
    And I expect ".link" appear 7 time on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible
    And I expect "#workflow1" is visible
    And I expect "#wfstep4" is visible
    And I expect "#wfstep3" is visible
    And I expect "#wfstep2" is visible
    And I expect "#wfstep1" is visible
    And I expect "#workflow2" is visible
    And I expect "#wfstep8" is visible
    And I expect "#wfstep7" is visible
    And I expect "#wfstep6" is visible
    And I expect "#wfstep5" is visible
    And I expect "#link-__workflow-__next-wfstep1-wfstep2" is visible
    And I expect "#link-__workflow-__next-wfstep2-wfstep3" is visible
    And I expect "#link-__workflow-__next-wfstep3-wfstep4" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible
    And I expect "#link-__workflow-__next-wfstep5-wfstep6" is visible
    And I expect "#link-__workflow-__next-wfstep6-wfstep7" is visible
    And I expect "#link-__workflow-__next-wfstep7-wfstep8" is visible

  Scenario: Delete a linked container with a linked component inside should also delete all related links
    Then I expect ".component" appear 16 times on screen
    And I expect ".component-DefaultModel" appear 12 times on screen
    And I expect ".component-DefaultContainer" appear 4 times on screen
    And I expect ".link" appear 8 times on screen
    And I expect "#internal1" is visible
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible
    And I expect "#workflow1" is visible
    And I expect "#wfstep4" is visible
    And I expect "#wfstep3" is visible
    And I expect "#wfstep2" is visible
    And I expect "#wfstep1" is visible
    And I expect "#workflow2" is visible
    And I expect "#wfstep8" is visible
    And I expect "#wfstep7" is visible
    And I expect "#wfstep6" is visible
    And I expect "#wfstep5" is visible
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible
    And I expect "#link-__workflow-__next-wfstep1-wfstep2" is visible
    And I expect "#link-__workflow-__next-wfstep2-wfstep3" is visible
    And I expect "#link-__workflow-__next-wfstep3-wfstep4" is visible
    And I expect "#link-__workflow-__next-wfstep5-wfstep6" is visible
    And I expect "#link-__workflow-__next-wfstep6-wfstep7" is visible
    And I expect "#link-__workflow-__next-wfstep7-wfstep8" is visible

    When I click on "#icon-network1"
    And I click on "#remove-component"
    Then I expect ".component" appear 13 times on screen
    And I expect ".component-DefaultModel" appear 10 times on screen
    And I expect ".component-DefaultContainer" appear 3 time on screen
    And I expect ".link" appear 6 time on screen
    And I expect "#internal1" is visible
    And I expect "#network2" is visible
    And I expect "#external1" is visible
    And I expect "#workflow1" is visible
    And I expect "#wfstep4" is visible
    And I expect "#wfstep3" is visible
    And I expect "#wfstep2" is visible
    And I expect "#wfstep1" is visible
    And I expect "#workflow2" is visible
    And I expect "#wfstep8" is visible
    And I expect "#wfstep7" is visible
    And I expect "#wfstep6" is visible
    And I expect "#wfstep5" is visible
    And I expect "#link-__workflow-__next-wfstep1-wfstep2" is visible
    And I expect "#link-__workflow-__next-wfstep2-wfstep3" is visible
    And I expect "#link-__workflow-__next-wfstep3-wfstep4" is visible
    And I expect "#link-__workflow-__next-wfstep5-wfstep6" is visible
    And I expect "#link-__workflow-__next-wfstep6-wfstep7" is visible
    And I expect "#link-__workflow-__next-wfstep7-wfstep8" is visible

  Scenario: Delete selected component on press delete key
    When I click on "#external1"
    And  I press on "del" key
    Then I expect "#external1" to not exist

  Scenario: Delete selected link on press delete key
    When I click on "#link-server-laptop_link-server1-external1"
    And  I press on "del" key
    Then I expect "#link-server-laptop_link-server1-external1" to not exist
