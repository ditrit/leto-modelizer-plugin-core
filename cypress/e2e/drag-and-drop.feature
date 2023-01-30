Feature: Test container drag and drop
  Background:
    Given I clear localstorage
    And I visit the "/"

  Scenario: drag one component into another one, check it has valid parent
    Given I set viewport size to "1000" px for width and "1080" px for height

    When I drag "#network2" onto "#network1 .component-container"
    Then I expect "#network2" to have "#network1" as parent

  Scenario: drag component outside its container, check it has no parent
    Given I set viewport size to "1000" px for width and "1080" px for height

    When I drag "#server2" of 200,200
    Then I expect "#network2" to have "#root" as parent

  Scenario: drag one component into a container then drag the container into another one, check they have valid parent
    Given I set viewport size to "1000" px for width and "1080" px for height

    When I drag "#server2" onto "#network2 .component-container"
    # Move server2 next to the center of network2, to be able to move the network2
    And I drag "#server2" of 0,25
    Then I expect "#svg-server2" to have "#svg-network2 .component-container" as parent

    When I drag "#network2" onto "#network1 .component-container"
    Then I expect "#server2" to have "#network2 .component-container" as parent
    Then I expect "#network2" to have "#network1 .component-container" as parent

  Scenario: Dragging an horizontal workflow steps should re-order them
    Given I set viewport size to "1000" px for width and "1080" px for height
    And I expect "#wfstep5" to be at position 58,566
    And I expect "#wfstep6" to be at position 264,566
    And I expect "#wfstep7" to be at position 469,566
    And I expect "#wfstep8" to be at position 675,566

    When I drag "#wfstep7" of -200,0
    Then I expect "#wfstep5" to be at position 58,566
    And I expect "#wfstep7" to be at position 264,566
    And I expect "#wfstep6" to be at position 469,566
    And I expect "#wfstep8" to be at position 675,566

    When I drag "#wfstep5" of 725,0
    Then I expect "#wfstep5" to be at position 675,566
    And I expect "#wfstep6" to be at position 264,566
    And I expect "#wfstep7" to be at position 58,566
    And I expect "#wfstep8" to be at position 469,566

  Scenario: Dragging a vertical workflow steps should re-order them
    Given I set viewport size to "1000" px for width and "1080" px for height
    And I drag "#root-components" of -200,0
    And I expect "#wfstep1" to be at position 735,223
    And I expect "#wfstep2" to be at position 735,283
    And I expect "#wfstep3" to be at position 735,344
    And I expect "#wfstep4" to be at position 735,404

    When I drag "#wfstep3" of 0,-70
    Then I expect "#wfstep1" to be at position 735,223
    And I expect "#wfstep3" to be at position 735,283
    And I expect "#wfstep2" to be at position 735,344
    And I expect "#wfstep4" to be at position 735,404

    When I drag "#wfstep1" of 0,210
    Then I expect "#wfstep3" to be at position 735,223
    And I expect "#wfstep2" to be at position 735,283
    And I expect "#wfstep4" to be at position 735,344
    And I expect "#wfstep1" to be at position 735,404


  Scenario: Dragging a component between workflows should properly insert it
    Given I set viewport size to "1000" px for width and "1080" px for height
    And I drag "#root-components" of -200,0
    And I expect "#wfstep1" to be at position 735,223
    And I expect "#wfstep2" to be at position 735,283
    And I expect "#wfstep3" to be at position 735,344
    And I expect "#wfstep4" to be at position 735,404
    And I expect "#wfstep7" to be at position 269,566
    And I expect "#wfstep8" to be at position 475,566

    When I drag "#wfstep3" of -350,225
    Then I expect "#wfstep1" to be at position 735,223
    And I expect "#wfstep2" to be at position 735,283
    And I expect "#wfstep4" to be at position 735,344
    And I expect "#wfstep7" to be at position 269,566
    And I expect "#wfstep3" to be at position 475,566
    And I expect "#wfstep8" to be at position 680,566

  Scenario: Emptying and refilling a workflow should work
    Given I set viewport size to "1000" px for width and "1080" px for height
    And I drag "#wfstep5" onto "#root-components"
    And I drag "#wfstep6" onto "#root-components"
    And I drag "#wfstep7" onto "#root-components"
    And I drag "#wfstep8" onto "#root-components"

    When I drag "#wfstep6" onto "#workflow2 .component-container"
    Then I expect "#wfstep6" to have "#workflow2 .component-container" as parent
