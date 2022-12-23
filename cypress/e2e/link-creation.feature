Feature: Test link creation

  Background:
    Given I clear localstorage
    And I visit the "/"
    And I set viewport size to "1920" px for width and "1080" px for height

  Scenario: Create a valid link should make a link appear
    When I click on "#svg-external1"
    And I click on "#create-link"
    And I click on "#svg-network2"

    Then I expect ".link" appear 3 times on screen
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible
    And I expect "#link-laptop-network_link-external1-network2" is visible

  Scenario: Create a invalid link should not make a link appear
    When I click on "#svg-external1"
    And I click on "#create-link"
    And I click on "#svg-server1"

    Then I expect ".link" appear 2 times on screen
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible

  Scenario: Should be able to create multiple links of the same type on different target id
    When I click on "#svg-server2"
    And I click on "#create-link"
    And I click on "#svg-internal1"

    Then I expect ".link" appear 3 times on screen
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible
    And I expect "#link-server-laptop_link-server2-internal1" is visible

    When I click on "#create-link"
    And I click on "#svg-external1"
    Then I expect ".link" appear 4 times on screen
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible
    And I expect "#link-server-laptop_link-server2-internal1" is visible
    And I expect "#link-server-laptop_link-server2-external1" is visible

  Scenario: Should be able to create multiple links of different types on different target id
    When I click on "#svg-server2"
    And I click on "#create-link"
    And I click on "#svg-internal1"

    Then I expect ".link" appear 3 times on screen
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible
    And I expect "#link-server-laptop_link-server2-internal1" is visible

    When I click on "#create-link"
    And I click on "#svg-network2"

    Then I expect ".link" appear 4 times on screen
    And I expect "#link-server-laptop_link-server1-external1" is visible
    And I expect "#link-laptop-network_link-internal1-network1" is visible
    And I expect "#link-server-laptop_link-server2-internal1" is visible
    And I expect "#link-server-network_link-server2-network2" is visible


