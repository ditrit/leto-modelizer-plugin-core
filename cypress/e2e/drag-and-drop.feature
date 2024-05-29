Feature: Test container drag and drop

  Background:
    Given I clear localstorage
    And   I set viewport size to "1920" px for width and "1080" px for height
    And   I visit the "/"

  Scenario: Components should be draggable
    Then I expect ".component.internal1 .model" to be at position 42,550

    When I drag ".component.internal1" of 250,250
    Then I expect ".component.internal1" is visible
    And  I expect ".component.internal1 .model" to be at position 292,800

  Scenario: Components should not be draggable when read-only
    Then I expect ".component.internal1 .model" to be at position 42,550

    When I click on "#read-only-checkbox"
    When I drag ".component.internal1" of 250,250
    Then I expect ".component.internal1" is visible
    Then I expect ".component.internal1 .model" to be at position 42,550

  Scenario: drag one component into another one, check it has valid parent
    When I drag ".component.network2" onto ".component.network1 .components"
    Then I expect ".component.network2" to have ".component.network1" as parent

  Scenario: drag component outside its container, check it has no parent
    Then I expect ".component.network2" to have ".scene .components" as parent

  Scenario: drag one component into a container then drag the container into another one, check they have valid parent
    When I drag ".component.network2 .resize-button svg" of 50,50
    And  I drag ".component.network2" of 0,-50
    And  I drag ".component.server2" of 250,-25
    Then I expect ".component.server2" to have ".component.network2 .components" as parent

    When I drag ".component.network2" of -250,25
    Then I expect ".component.server2" to have ".component.network2 .components" as parent
    And  I expect ".component.network2" to have ".component.network1 .components" as parent

  Scenario: Dragging root-components component should not move all components but only change translate
    Then I expect ".component.network1 .model" to be at position 30,30
    And  I expect ".component.network2 .model" to be at position 400,150
    And  I expect ".component.external1 .model" to be at position 30,280
    And  I expect ".component.workflow1 .model" to be at position 280,280
    And  I expect ".component.workflow2 .model" to be at position 580,230
    And  I expect ".component.internal1 .model" to be at position 42,550
    And  I expect "transform" of ".scene .components" is "translate(0 0) scale(1)"

    When I drag ".scene .components" of 200,300
    Then I expect ".component.network1 .model" to be at position 30,30
    And  I expect ".component.network2 .model" to be at position 400,150
    And  I expect ".component.external1 .model" to be at position 30,280
    And  I expect ".component.workflow1 .model" to be at position 280,280
    And  I expect ".component.workflow2 .model" to be at position 580,230
    And  I expect ".component.internal1 .model" to be at position 42,550
    And  I expect "transform" of ".scene .components" is "translate(200 300) scale(1)"

  Scenario: Dragging an horizontal workflow steps should re-order them
    Then I expect ".component.wfstep5 .model" to be at position 15,15
    And  I expect ".component.wfstep6 .model" to be at position 295,15
    And  I expect ".component.wfstep7 .model" to be at position 575,15
    And  I expect ".component.wfstep8 .model" to be at position 855,15

    When I drag ".component.wfstep8" of -500,0
    Then I expect ".component.wfstep5 .model" to be at position 15,15
    And  I expect ".component.wfstep6 .model" to be at position 295,15
    And  I expect ".component.wfstep8 .model" to be at position 575,15
    And  I expect ".component.wfstep7 .model" to be at position 855,15

    When I drag ".component.wfstep8" of 300,0
    Then I expect ".component.wfstep5 .model" to be at position 15,15
    And  I expect ".component.wfstep6 .model" to be at position 295,15
    And  I expect ".component.wfstep7 .model" to be at position 575,15
    And  I expect ".component.wfstep8 .model" to be at position 855,15

  Scenario: Dragging a vertical workflow steps should re-order them
    Then I expect ".component.wfstep1 .model" to be at position 15,15
    And  I expect ".component.wfstep2 .model" to be at position 15,115
    And  I expect ".component.wfstep3 .model" to be at position 15,215
    And  I expect ".component.wfstep4 .model" to be at position 15,315

    When I drag ".component.wfstep4" of 0,-200
    Then I expect ".component.wfstep1 .model" to be at position 15,15
    And  I expect ".component.wfstep4 .model" to be at position 15,115
    And  I expect ".component.wfstep2 .model" to be at position 15,215
    And  I expect ".component.wfstep3 .model" to be at position 15,315

    When I drag ".component.wfstep4" of 0,210
    Then I expect ".component.wfstep1 .model" to be at position 15,15
    And  I expect ".component.wfstep2 .model" to be at position 15,115
    And  I expect ".component.wfstep3 .model" to be at position 15,215
    And  I expect ".component.wfstep4 .model" to be at position 15,315

  Scenario: Dragging a component between workflows should properly insert it
    Then I expect ".component.wfstep1 .model" to be at position 15,15
    And  I expect ".component.wfstep2 .model" to be at position 15,115
    And  I expect ".component.wfstep3 .model" to be at position 15,215
    And  I expect ".component.wfstep4 .model" to be at position 15,315
    And  I expect ".component.wfstep5 .model" to be at position 15,15
    And  I expect ".component.wfstep6 .model" to be at position 295,15
    And  I expect ".component.wfstep7 .model" to be at position 575,15
    And  I expect ".component.wfstep8 .model" to be at position 855,15

    When I drag ".component.wfstep3" of 300,-300
    Then I expect ".component.wfstep1 .model" to be at position 15,15
    And  I expect ".component.wfstep2 .model" to be at position 15,115
    And  I expect ".component.wfstep4 .model" to be at position 15,215
    And  I expect ".component.wfstep3 .model" to be at position 15,15
    And  I expect ".component.wfstep5 .model" to be at position 295,15
    And  I expect ".component.wfstep6 .model" to be at position 575,15
    And  I expect ".component.wfstep7 .model" to be at position 855,15
    And  I expect ".component.wfstep8 .model" to be at position 1135,15
