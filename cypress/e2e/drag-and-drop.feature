Feature: Test container drag and drop
  Background:
    Given I clear localstorage
    And I visit the "/"
    
  @ignore
  Scenario: drag one component into an another, check it have valid parent
    Given I set viewport size to "1000" px for width and "660" px for height

    When I drag "#root #external1" onto "#network1 .component-container"
    Then I expect "#external1" to have "#network1" as parent