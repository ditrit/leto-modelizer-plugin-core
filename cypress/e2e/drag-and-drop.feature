Feature: Test container drag and drop
  Background:
    Given I clear localstorage
    And I visit the "/"

  Scenario: drag one component into another one, check it has valid parent
    Given I set viewport size to "1000" px for width and "660" px for height

    When I drag "#root #svg-network2" onto "#svg-network1 .component-container"
    Then I expect "#svg-network2" to have "#svg-network1" as parent
