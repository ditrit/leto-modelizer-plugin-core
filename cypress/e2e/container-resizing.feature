Feature: Test container resizing
  Background:
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"

  Scenario: Move component inside container should resize it
    Then I expect "#network1" width is 308
    And  I expect "#network1" height is 246

    When I drag "#server2" of 10,10
    Then I expect "#network1" width is 306
    And  I expect "#network1" height is 256

    When I drag "#server2" of -10,-10
    Then I expect "#network1" width is 296
    And  I expect "#network1" height is 246
  
  Scenario: Resize component container manually
    Then I expect '#network1' width is 308
    And  I expect '#network1' height is 246

    When I click on '#network1' at 10,10
    Then I expect "#resizer" is visible

    When I drag '#resizer' of 50,100
    Then I expect '#network1' width is 358
    And  I expect '#network1' height is 345

    # To test if the component retains its new size after drag.
    When I drag '#network1' of 10,10
    Then I expect '#network1' width is 358
    And  I expect '#network1' height is 345
