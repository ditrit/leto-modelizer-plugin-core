Feature: Test automatic layout for the graph

  Background:
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"

  Scenario: Automatic layout should have a (deterministic) given result
    # Initial positions
    Then I expect ".component.internal1 .model" to be at position 42,550
    And  I expect ".component.network1 .model" to be at position 30,30
    And  I expect ".component.network2 .model" to be at position 400,150
    And  I expect ".component.external1 .model" to be at position 30,280
    And  I expect ".component.server1 .model" to be at position 15,15
    And  I expect ".component.server2 .model" to be at position 15,115
    And  I expect ".component.workflow1 .model" to be at position 280,280
    And  I expect ".component.wfstep1 .model" to be at position 15,15
    And  I expect ".component.wfstep2 .model" to be at position 15,115
    And  I expect ".component.wfstep3 .model" to be at position 15,215
    And  I expect ".component.wfstep4 .model" to be at position 15,315
    And  I expect ".component.workflow2 .model" to be at position 580,230
    And  I expect ".component.wfstep5 .model" to be at position 15,15
    And  I expect ".component.wfstep6 .model" to be at position 295,15
    And  I expect ".component.wfstep7 .model" to be at position 575,15
    And  I expect ".component.wfstep8 .model" to be at position 855,15

    When I click on "#automatic-layout-button"
    Then I expect ".component.internal1 .model" to be at position 30,30
    And I expect ".component.network1 .model" to be at position 30,130
    And I expect ".component.network2 .model" to be at position 280,30
    And I expect ".component.external1 .model" to be at position 330,130
    And I expect ".component.server1 .model" to be at position 15,15
    And I expect ".component.server2 .model" to be at position 15,115
    And I expect ".component.workflow1 .model" to be at position 330,230
    And I expect ".component.wfstep1 .model" to be at position 15,15
    And I expect ".component.wfstep2 .model" to be at position 15,115
    And I expect ".component.wfstep3 .model" to be at position 15,215
    And I expect ".component.wfstep4 .model" to be at position 15,315
    And I expect ".component.workflow2 .model" to be at position 580,30
    And I expect ".component.wfstep5 .model" to be at position 15,15
    And I expect ".component.wfstep6 .model" to be at position 295,15
    And I expect ".component.wfstep7 .model" to be at position 575,15
    And I expect ".component.wfstep8 .model" to be at position 855,15

  Scenario: New components should be added in free space
    Then I expect ".component.laptop_1" to not exist
    And  I expect ".component.laptop_2" to not exist
    And  I expect ".component.laptop_3" to not exist
    And  I expect ".component.laptop_4" to not exist
    And  I expect ".component.laptop_5" to not exist

    When I click on "#add-component-button"
    And  I click on "#add-component-button"
    And  I click on "#add-component-button"
    And  I click on "#add-component-button"
    And  I click on "#add-component-button"

    Then I expect ".component.id_1 .model" to be at position 330,30
    And  I expect ".component.id_2 .model" to be at position 30,380
    And  I expect ".component.id_3 .model" to be at position 30,480
    And  I expect ".component.id_4 .model" to be at position 580,30
    And  I expect ".component.id_5 .model" to be at position 580,380

