Feature: Test plugin renderer

  Background:
    Given I clear localstorage
    And   I set viewport size to "1920" px for width and "1080" px for height
    And   I visit the "/"

  Scenario: The renderer should be present
    Then I expect "#view-port .scene" is visible

  Scenario: Components should be loaded in the renderer
    Then I expect ".component" appear 16 times on screen
    And  I expect ".component.internal1" is visible
    And  I expect ".component.external1" is visible
    And  I expect ".component.network1" is visible
    And  I expect ".component.network2" is visible
    And  I expect ".component.server1" is visible
    And  I expect ".component.server2" is visible
    And  I expect ".component.workflow1" is visible
    And  I expect ".component.workflow2" is visible
    And  I expect ".component.wfstep1" is visible
    And  I expect ".component.wfstep2" is visible
    And  I expect ".component.wfstep3" is visible
    And  I expect ".component.wfstep4" is visible
    And  I expect ".component.wfstep5" is visible
    And  I expect ".component.wfstep6" is visible
    And  I expect ".component.wfstep7" is visible
    And  I expect ".component.wfstep8" is visible

  Scenario: Components should be properly nested
    Then I expect ".component.server1" to have ".component.container.network1" as parent
    And  I expect ".component.server2" to have ".component.container.network1" as parent

  Scenario: links should be loaded in the renderer
    Then I expect ".link" appear 8 times on screen
    And  I expect ".link.server1_to_external1" is visible
    And  I expect ".link.internal1_to_network1" is visible
    And  I expect ".link.wfstep1_to_wfstep2" is visible
    And  I expect ".link.wfstep2_to_wfstep3" is visible
    And  I expect ".link.wfstep3_to_wfstep4" is visible
    And  I expect ".link.wfstep5_to_wfstep6" is visible
    And  I expect ".link.wfstep6_to_wfstep7" is visible
    And  I expect ".link.wfstep7_to_wfstep8" is visible
