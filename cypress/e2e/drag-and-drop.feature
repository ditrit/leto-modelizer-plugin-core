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
