Feature: Test rename component id.
  Background:
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"


  Scenario: Rename component should update only its external id.
    Then I expect ".link" appear 8 times on screen
    And  I expect "#link-server-laptop_link-server1-external1" is visible
    And  I expect "#svg-external1" is visible
    # Lets check that the old behavior of renaming (before external id) do not exist anymore
    But  I expect "#link-server-laptop_link-server1-renamed" to not exist
    And  I expect "#svg-renamed" to not exist

    When I select "external1" in "#component-id"
    And  I set on "#rename-input" text "renamed"
    And  I click on "#rename-component"
    Then I expect ".link" appear 8 times on screen
    And  I expect "#svg-external1" is visible
    And  I expect "#link-server-laptop_link-server1-external1" is visible
    And  I expect field '[id="svg-external1"]' contains "externalId: renamed"
    # Lets check that the old behavior of renaming (before external id) do not exist anymore
    But  I expect "#link-server-laptop_link-server1-renamed" to not exist
    And  I expect "#svg-renamed" to not exist
