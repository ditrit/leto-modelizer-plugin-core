Feature: Test automatic layout for the graph
  Background:
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"

  Scenario: Auomatic layout should have a (deterministic) given result
    # Initial positions
    Then I expect "#__shadowRoot" to be at position 0,0
    And I expect "#external1" to be at position 918,30
    And I expect "#internal1" to be at position 42,666
    And I expect "#network1" to be at position 314,30
    And I expect "#network2" to be at position 646,30
    And I expect "#server1" to be at position 30,30
    And I expect "#server2" to be at position 30,110
    And I expect "#wfstep1" to be at position 30,30
    And I expect "#wfstep2" to be at position 30,110
    And I expect "#wfstep3" to be at position 30,190
    And I expect "#wfstep4" to be at position 30,270
    And I expect "#wfstep5" to be at position 30,30
    And I expect "#wfstep6" to be at position 302,30
    And I expect "#wfstep7" to be at position 574,30
    And I expect "#wfstep8" to be at position 846,30
    And I expect "#workflow1" to be at position 1190,30
    And I expect "#workflow2" to be at position 30,484

    # Rearrange children of network1
    When I click on "#automatic-layout-children-button"
    And I expect "#__shadowRoot" to be at position 0,0
    And I expect "#external1" to be at position 918,30
    And I expect "#internal1" to be at position 42,666
    And I expect "#network1" to be at position 314,30
    And I expect "#network2" to be at position 646,30
    And I expect "#server1" to be at position 12,12
    And I expect "#server2" to be at position 12,112
    And I expect "#wfstep1" to be at position 30,30
    And I expect "#wfstep2" to be at position 30,110
    And I expect "#wfstep3" to be at position 30,190
    And I expect "#wfstep4" to be at position 30,270
    And I expect "#wfstep5" to be at position 30,30
    And I expect "#wfstep6" to be at position 302,30
    And I expect "#wfstep7" to be at position 574,30
    And I expect "#wfstep8" to be at position 846,30
    And I expect "#workflow1" to be at position 1190,30
    And I expect "#workflow2" to be at position 30,484

    # Rearrange everything
    When I click on "#automatic-layout-button"
    And I expect "#__shadowRoot" to be at position 0,0
    And I expect "#external1" to be at position 620,783
    And I expect "#internal1" to be at position 12,783
    And I expect "#network1" to be at position 292,684
    And I expect "#network2" to be at position 12,12
    And I expect "#server1" to be at position 12,12
    And I expect "#server2" to be at position 12,112
    And I expect "#wfstep1" to be at position 30,30
    And I expect "#wfstep2" to be at position 30,110
    And I expect "#wfstep3" to be at position 30,190
    And I expect "#wfstep4" to be at position 30,270
    And I expect "#wfstep5" to be at position 30,30
    And I expect "#wfstep6" to be at position 302,30
    And I expect "#wfstep7" to be at position 574,30
    And I expect "#wfstep8" to be at position 846,30
    And I expect "#workflow1" to be at position 292,12
    And I expect "#workflow2" to be at position 12,468
