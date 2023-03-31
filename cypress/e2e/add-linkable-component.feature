Feature: Test add linkable component.
  Background:
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"

  Scenario: Add linkable component
    Then I expect ".component" appear 16 times on screen
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible
    And I expect "#external1" is visible
    And I expect "#internal1" is visible
    And I expect "#workflow1" is visible
    And I expect "#wfstep1" is visible
    And I expect "#wfstep2" is visible
    And I expect "#wfstep3" is visible
    And I expect "#wfstep4" is visible
    And I expect "#workflow2" is visible
    And I expect "#wfstep5" is visible
    And I expect "#wfstep6" is visible
    And I expect "#wfstep7" is visible
    And I expect "#wfstep8" is visible

    Then I expect ".link" appear 8 times on screen
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible
    And I expect "#link-__workflow-__next-wfstep1-wfstep2" is visible
    And I expect "#link-__workflow-__next-wfstep2-wfstep3" is visible
    And I expect "#link-__workflow-__next-wfstep3-wfstep4" is visible
    And I expect "#link-__workflow-__next-wfstep5-wfstep6" is visible
    And I expect "#link-__workflow-__next-wfstep6-wfstep7" is visible
    And I expect "#link-__workflow-__next-wfstep7-wfstep8" is visible

    When I click on "#server1"
    Then I expect "#create-linkable-component" is visible
    And I expect "#create-linkable-component" is visible

    When I click on "#create-linkable-component"
    Then I expect ".linkable-button" appear 2 times on screen
    And I expect ".linkable-button.network" is visible
    And I expect ".linkable-button.laptop" is visible

    When I click on ".linkable-button.network"

    Then I expect ".component" appear 17 times on screen
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible
    And I expect "#external1" is visible
    And I expect "#internal1" is visible
    And I expect "#workflow1" is visible
    And I expect "#wfstep1" is visible
    And I expect "#wfstep2" is visible
    And I expect "#wfstep3" is visible
    And I expect "#wfstep4" is visible
    And I expect "#workflow2" is visible
    And I expect "#wfstep5" is visible
    And I expect "#wfstep6" is visible
    And I expect "#wfstep7" is visible
    And I expect "#wfstep8" is visible
    And I expect "#network_1" is visible

    Then I expect ".link" appear 9 times on screen
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible
    And I expect "#link-__workflow-__next-wfstep1-wfstep2" is visible
    And I expect "#link-__workflow-__next-wfstep2-wfstep3" is visible
    And I expect "#link-__workflow-__next-wfstep3-wfstep4" is visible
    And I expect "#link-__workflow-__next-wfstep5-wfstep6" is visible
    And I expect "#link-__workflow-__next-wfstep6-wfstep7" is visible
    And I expect "#link-__workflow-__next-wfstep7-wfstep8" is visible
    And I expect "#link-server-network_link-server1-network_1" is visible

    When I click on "#svg-server2"
    Then I expect "#create-linkable-component" is visible
    And I expect "#create-linkable-component" is visible

    When I click on "#create-linkable-component"
    Then I expect ".linkable-button" appear 2 times on screen
    And I expect ".linkable-button.network" is visible
    And I expect ".linkable-button.laptop" is visible

    When I click on ".linkable-button.laptop"

    Then I expect ".component" appear 18 times on screen
    And I expect "#network1" is visible
    And I expect "#network2" is visible
    And I expect "#server1" is visible
    And I expect "#server2" is visible
    And I expect "#external1" is visible
    And I expect "#internal1" is visible
    And I expect "#workflow1" is visible
    And I expect "#wfstep1" is visible
    And I expect "#wfstep2" is visible
    And I expect "#wfstep3" is visible
    And I expect "#wfstep4" is visible
    And I expect "#workflow2" is visible
    And I expect "#wfstep5" is visible
    And I expect "#wfstep6" is visible
    And I expect "#wfstep7" is visible
    And I expect "#wfstep8" is visible
    And I expect "#network_1" is visible
    And I expect "#laptop_1" is visible

    Then I expect ".link" appear 10 times on screen
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible
    And I expect "#link-__workflow-__next-wfstep1-wfstep2" is visible
    And I expect "#link-__workflow-__next-wfstep2-wfstep3" is visible
    And I expect "#link-__workflow-__next-wfstep3-wfstep4" is visible
    And I expect "#link-__workflow-__next-wfstep5-wfstep6" is visible
    And I expect "#link-__workflow-__next-wfstep6-wfstep7" is visible
    And I expect "#link-__workflow-__next-wfstep7-wfstep8" is visible
    And I expect "#link-server-network_link-server1-network_1" is visible
    And I expect "#link-server-laptop_link-server2-laptop_1" is visible
