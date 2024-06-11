Feature: Test resize

  Background:
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"

  Scenario: Should be able to see all resize button in the diagram
    Then I expect ".component .resize-button" appear 4 times on screen
    And  I expect ".component.network1 .resize-button" to be visible
    And  I expect ".component.network2 .resize-button" to be visible
    And  I expect ".component.workflow1 .resize-button" to be visible
    And  I expect ".component.workflow2 .resize-button" to be visible

  Scenario: Resize container with components to its minimum size
    Then I expect ".component.workflow2 .model" width is 1121
    And  I expect ".component.workflow2 .model" height is 145

    # Verify minimum size
    When I drag ".component.workflow2 .resize-button" of -1500,-200
    Then I expect ".component.workflow2 .model" width is 1124
    And  I expect ".component.workflow2 .model" height is 148

    # Upgrade size
    When I drag ".component.workflow2 .resize-button svg" of 50,50
    Then I expect ".component.workflow2 .model" width is 1170
    And  I expect ".component.workflow2 .model" height is 194

    # Set to minimum size
    When I drag ".component.workflow2 .resize-button" of -1500,-200
    Then I expect ".component.workflow2 .model" width is 1124
    And  I expect ".component.workflow2 .model" height is 148

  Scenario: Resize container without components to its minimum size
    When I drag ".component.network2" of 0,-50
    Then I expect ".component.network2 .model" width is 239
    And  I expect ".component.network2 .model" height is 81

    # Verify minimum size
    When I drag ".component.network2 .resize-button" of -250,-100
    Then I expect ".component.network2 .model" width is 239
    And  I expect ".component.network2 .model" height is 81

    # Upgrade size
    When I drag ".component.network2 .resize-button svg" of 50,50
    Then I expect ".component.network2 .model" width is 285
    And  I expect ".component.network2 .model" height is 127

    # Set to minimum size
    When I drag ".component.network2 .resize-button" of -250,-100
    Then I expect ".component.network2 .model" width is 239
    And  I expect ".component.network2 .model" height is 81
