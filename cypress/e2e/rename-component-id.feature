Feature: Test rename component id.
  Background:
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"
    

  Scenario: Rename component should automatically update all the Link attributes targeting the renamed component.
    Then I expect ".link" appear 8 times on screen
    And  I expect "#link-server-laptop_link-server1-external1" is visible
    And  I expect "#svg-external1" is visible
    But  I expect "#link-server-laptop_link-server1-renamed" to not exist
    And  I expect "#svg-renamed" to not exist

    When I select "external1" in "select"
    And  I set on "#rename-input" text "renamed"
    And  I click on "#rename-component"
    Then I expect ".link" appear 8 times on screen
    And  I expect "#svg-renamed" is visible
    And  I expect "#link-server-laptop_link-server1-renamed" is visible
    But  I expect "#svg-external1" to not exist

  Scenario: Rename component should automatically update all the Reference attributes targeting the renamed component.
    Then I expect "#svg-network1" is visible
    And  I expect "#server1" is visible
    And  I expect "#server2" is visible
    But  I expect "#svg-renamed" to not exist

    When I select "network1" in "select"
    And  I set on "#rename-input" text "renamed"
    And  I click on "#rename-component"
    Then I expect "#svg-renamed" is visible
    And  I expect "#server1" is visible
    And  I expect "#server2" is visible
    But  I expect "#svg-network1" to not exist
