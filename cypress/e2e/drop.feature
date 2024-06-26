Feature: Test drop new component
  Background:
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"

  Scenario: Drop new component in root container
    When I set on "#position-x-input" text "200"
    And  I set on "#position-y-input" text "200"
    And  I click on "#drop-button"
    Then I expect ".component.id_1" is visible
    And  I expect ".component.id_1 .model" to be at position 200,200

  # TODO: not possible at this time, because we can't have a valid event to make the drop on container works.
  @ignore
  Scenario: Drop new component in component container
    When I set on "#position-x-input" text "400"
    And  I set on "#position-y-input" text "400"
    And  I click on "#drop-button"
    Then I expect "#root #id_1" is visible
    And  I expect "#root #id_1" to be at position 30,190
