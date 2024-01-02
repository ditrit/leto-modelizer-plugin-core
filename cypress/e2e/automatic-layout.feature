Feature: Test automatic layout for the graph
  Background:
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"

  Scenario: Automatic layout should have a (deterministic) given result
    # Initial positions
    Then I expect "#internal1" to be at position 42,666
    And I expect "#network1" to be at position 314,30
    And I expect "#network2" to be at position 736,30
    And I expect "#external1" to be at position 1098,30
    And I expect "#server1" to be at position 30,30
    And I expect "#server2" to be at position 30,110
    And I expect "#workflow1" to be at position 1460,30
    And I expect "#wfstep1" to be at position 30,30
    And I expect "#wfstep2" to be at position 30,110
    And I expect "#wfstep3" to be at position 30,190
    And I expect "#wfstep4" to be at position 30,270
    And I expect "#workflow2" to be at position 30,484
    And I expect "#wfstep5" to be at position 30,30
    And I expect "#wfstep6" to be at position 392,30
    And I expect "#wfstep7" to be at position 754,30
    And I expect "#wfstep8" to be at position 1116,30

    # Rearrange everything
    When I click on "#automatic-layout-children-button"

    Then I expect "#internal1" to be at position 12,782
    And I expect "#network1" to be at position 382,684
    And I expect "#network2" to be at position 12,12
    And I expect "#external1" to be at position 830,782
    And I expect "#server1" to be at position 12,12
    And I expect "#server2" to be at position 12,112
    And I expect "#workflow1" to be at position 382,12
    And I expect "#wfstep1" to be at position 30,30
    And I expect "#wfstep2" to be at position 30,110
    And I expect "#wfstep3" to be at position 30,190
    And I expect "#wfstep4" to be at position 30,270
    And I expect "#workflow2" to be at position 12,468
    And I expect "#wfstep5" to be at position 30,30
    And I expect "#wfstep6" to be at position 392,30
    And I expect "#wfstep7" to be at position 754,30
    And I expect "#wfstep8" to be at position 1116,30



  Scenario: Automatic layout should have a (deterministic) given result when reorganizing a node's children
    # Initial positions
    Then I expect "#internal1" to be at position 42,666
    And I expect "#network1" to be at position 314,30
    And I expect "#network2" to be at position 736,30
    And I expect "#external1" to be at position 1098,30
    And I expect "#server1" to be at position 30,30
    And I expect "#server2" to be at position 30,110
    And I expect "#workflow1" to be at position 1460,30
    And I expect "#wfstep1" to be at position 30,30
    And I expect "#wfstep2" to be at position 30,110
    And I expect "#wfstep3" to be at position 30,190
    And I expect "#wfstep4" to be at position 30,270
    And I expect "#workflow2" to be at position 30,484
    And I expect "#wfstep5" to be at position 30,30
    And I expect "#wfstep6" to be at position 392,30
    And I expect "#wfstep7" to be at position 754,30
    And I expect "#wfstep8" to be at position 1116,30

    # Rearrange children of network1
    When I select "network1" in "#automatic-layout-children-input"
    And I click on "#automatic-layout-children-button"

    Then I expect "#internal1" to be at position 42,666
    And I expect "#network1" to be at position 314,30
    And I expect "#network2" to be at position 736,30
    And I expect "#external1" to be at position 1098,30
    And I expect "#server1" to be at position 12,12
    And I expect "#server2" to be at position 12,112
    And I expect "#workflow1" to be at position 1460,30
    And I expect "#wfstep1" to be at position 30,30
    And I expect "#wfstep2" to be at position 30,110
    And I expect "#wfstep3" to be at position 30,190
    And I expect "#wfstep4" to be at position 30,270
    And I expect "#workflow2" to be at position 30,484
    And I expect "#wfstep5" to be at position 30,30
    And I expect "#wfstep6" to be at position 392,30
    And I expect "#wfstep7" to be at position 754,30
    And I expect "#wfstep8" to be at position 1116,30

  Scenario: New components should be added in free space

    Then I expect "#laptop_1" to not exist
    And I expect "#laptop_2" to not exist
    And I expect "#laptop_3" to not exist
    And I expect "#laptop_4" to not exist
    And I expect "#laptop_5" to not exist
    And I expect "#laptop_6" to not exist
    And I expect "#laptop_7" to not exist
    And I expect "#laptop_8" to not exist
    And I expect "#laptop_9" to not exist
    And I expect "#laptop_10" to not exist
    And I expect "#laptop_11" to not exist
    And I expect "#laptop_12" to not exist
    And I expect "#laptop_13" to not exist
    And I expect "#laptop_14" to not exist
    And I expect "#laptop_15" to not exist
    And I expect "#laptop_16" to not exist
    And I expect "#laptop_17" to not exist
    And I expect "#laptop_18" to not exist

    # 18 times
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"
    When I click on "#add-component-button"


    And I expect "#__shadowRoot" to be at position 0,0
    And I expect "#external1" to be at position 1098,30
    And I expect "#internal1" to be at position 42,666
    And I expect "#id_1" to be at position 510,290
    And I expect "#id_2" to be at position 510,360
    And I expect "#id_3" to be at position 720,180
    And I expect "#id_4" to be at position 850,250
    And I expect "#id_5" to be at position 850,320
    And I expect "#id_6" to be at position 850,390
    And I expect "#id_7" to be at position 1060,180
    And I expect "#id_8" to be at position 1530,450
    And I expect "#id_9" to be at position 1530,520
    And I expect "#id_10" to be at position 1530,590
    And I expect "#id_11" to be at position 1530,660
    And I expect "#id_12" to be at position 1870,30
    And I expect "#id_13" to be at position 1870,100
    And I expect "#id_14" to be at position 1870,170
    And I expect "#id_15" to be at position 1870,240
    And I expect "#id_16" to be at position 1870,310
    And I expect "#id_17" to be at position 1870,380
    And I expect "#id_18" to be at position 1870,450
    And I expect "#network1" to be at position 314,30
    And I expect "#network2" to be at position 736,30
    And I expect "#server1" to be at position 30,30
    And I expect "#server2" to be at position 30,110
    And I expect "#wfstep1" to be at position 30,30
    And I expect "#wfstep2" to be at position 30,110
    And I expect "#wfstep3" to be at position 30,190
    And I expect "#wfstep4" to be at position 30,270
    And I expect "#wfstep5" to be at position 30,30
    And I expect "#wfstep6" to be at position 392,30
    And I expect "#wfstep7" to be at position 754,30
    And I expect "#wfstep8" to be at position 1116,30
    And I expect "#workflow1" to be at position 1460,30
    And I expect "#workflow2" to be at position 30,484
