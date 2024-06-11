Feature: Test rename component id.
  Background:
    Given I clear localstorage
    And   I set viewport size to "1920" px for width and "1080" px for height
    And   I visit the "/"


  Scenario: Rename component should update only its external id.
    Then I expect ".link" appear 8 times on screen
    And  I expect ".link.server1_to_external1" is visible
    And  I expect ".component.external1 text.type" is "laptop - id: external_id_1"

    When I select "external1" in "#component-id"
    And  I set on "#rename-input" text "renamed"
    And  I click on "#rename-component"
    Then I expect ".link" appear 8 times on screen
    And  I expect ".link.server1_to_external1" is visible
    And  I expect ".component.external1 text.type" is "laptop - id: renamed"
