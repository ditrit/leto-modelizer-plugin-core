Feature: Test resize when draw on read-only
  Scenario: Should be able to see all the diagram
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"

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

    When I click on "#read-only-checkbox"
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
