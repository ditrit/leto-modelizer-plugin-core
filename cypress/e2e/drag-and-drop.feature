Feature: Test container drag and drop
  Background:
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"

  Scenario: Components should be draggable
    Then I expect "#root #svg-external1" to be at position 919,164

    When I drag "#root #svg-external1" of 25,25
    Then I expect "#root #svg-external1" is visible
    And  I expect "#root #svg-external1" to be at position 944,189

  Scenario: Components should not be draggable when read-only
    Then I expect "#root #svg-external1" to be at position 919,164

    When I click on "#read-only-checkbox"
    And  I drag "#root #svg-external1" of 25,25
    Then I expect "#root #svg-external1" is visible
    And  I expect "#root #svg-external1" to be at position 1001,172

  Scenario: drag one component into another one, check it has valid parent
    When I drag "#network2" onto "#network1 .component-container"
    Then I expect "#network2" to have "#network1" as parent

  Scenario: drag component outside its container, check it has no parent
    When I drag "#server2" of 200,200
    Then I expect "#network2" to have "#root" as parent

  Scenario: drag one component into a container then drag the container into another one, check they have valid parent
    When I drag "#server2" onto "#network2 .component-container"
    # Move server2 next to the center of network2, to be able to move the network2
    And I drag "#server2" of 0,25
    Then I expect "#svg-server2" to have "#svg-network2 .component-container" as parent

    When I drag "#network2" onto "#network1 .component-container"
    Then I expect "#server2" to have "#network2 .component-container" as parent
    Then I expect "#network2" to have "#network1 .component-container" as parent

  Scenario: Dragging root-components component should move all components
    Then I expect "#network1" to be at position 315,164
    And I expect "#network2" to be at position 647,164
    And I expect "#external1" to be at position 919,164
    And I expect "#workflow1" to be at position 1191,164
    And I expect "#workflow2" to be at position 31,618
    And I expect "#internal1" to be at position 43,800

    When I drag "#root-components" of 200,300
    Then I expect "#network1" to be at position 514,465
    And I expect "#network2" to be at position 846,465
    And I expect "#external1" to be at position 1118,465
    And I expect "#workflow1" to be at position 1390,465
    And I expect "#workflow2" to be at position 230,919
    And I expect "#internal1" to be at position 242,1101


  Scenario: Dragging an horizontal workflow steps should re-order them
    Then I expect "#wfstep5" to be at position 67,698
    And I expect "#wfstep6" to be at position 339,698
    And I expect "#wfstep7" to be at position 611,698
    And I expect "#wfstep8" to be at position 883,698

    When I drag "#wfstep7" of -250,0
    Then I expect "#wfstep5" to be at position 67,698
    And I expect "#wfstep7" to be at position 339,698
    And I expect "#wfstep6" to be at position 611,698
    And I expect "#wfstep8" to be at position 883,698

    When I drag "#wfstep5" of 725,0
    Then I expect "#wfstep5" to be at position 611,698
    And I expect "#wfstep6" to be at position 339,698
    And I expect "#wfstep7" to be at position 67,698
    And I expect "#wfstep8" to be at position 883,698

  Scenario: Dragging a vertical workflow steps should re-order them
    Then I expect "#wfstep1" to be at position 1227,244
    And I expect "#wfstep2" to be at position 1227,324
    And I expect "#wfstep3" to be at position 1227,404
    And I expect "#wfstep4" to be at position 1227,484

    When I drag "#wfstep3" of 0,-70
    Then I expect "#wfstep1" to be at position 1227,244
    And I expect "#wfstep2" to be at position 1227,404
    And I expect "#wfstep3" to be at position 1227,324
    And I expect "#wfstep4" to be at position 1227,484

    When I drag "#wfstep1" of 0,210
    Then I expect "#wfstep1" to be at position 1227,404
    And I expect "#wfstep2" to be at position 1227,324
    And I expect "#wfstep3" to be at position 1227,244
    And I expect "#wfstep4" to be at position 1227,484


  Scenario: Dragging a component between workflows should properly insert it
    And I expect "#wfstep1" to be at position 1227,244
    And I expect "#wfstep2" to be at position 1227,324
    And I expect "#wfstep3" to be at position 1227,404
    And I expect "#wfstep4" to be at position 1227,484
    And I expect "#wfstep5" to be at position 67,698
    And I expect "#wfstep6" to be at position 339,698
    And I expect "#wfstep7" to be at position 611,698
    And I expect "#wfstep8" to be at position 883,698

    When I drag "#wfstep3" of -200,300
    And I expect "#wfstep1" to be at position 1227,244
    And I expect "#wfstep2" to be at position 1227,324
    And I expect "#wfstep3" to be at position 1155,698
    And I expect "#wfstep4" to be at position 1227,404
    And I expect "#wfstep5" to be at position 67,698
    And I expect "#wfstep6" to be at position 339,698
    And I expect "#wfstep7" to be at position 611,698
    And I expect "#wfstep8" to be at position 883,698

  Scenario: Emptying and refilling a workflow should work
    And I drag "#wfstep5" onto "#root-components"
    And I drag "#wfstep6" onto "#root-components"
    And I drag "#wfstep7" onto "#root-components"
    And I drag "#wfstep8" onto "#root-components"

    When I drag "#wfstep6" onto "#workflow2 .component-container"
    Then I expect "#wfstep6" to have "#workflow2 .component-container" as parent
