Feature: Test component/link selection
  Background:
    Given I clear localstorage
    And I set viewport size to "1920" px for width and "1080" px for height
    And I visit the "/"

  Scenario Outline: Clicking on a <type> should select it
    When I click on "<selector>"
    Then I expect <type> "<selector>" to have style "outlineColor" set to "rgb(0, 149, 255)"
    And I expect <type> "<selector>" to have style "outlineStyle" set to "solid"
    And I expect <type> "<selector>" to have style "outlineWidth" set to "2px"

    Examples:
      | type      | selector                                   |
      | component | #external1 .template                       |
      | link      | #link-server-laptop_link-server1-external1 |

  Scenario Outline: Clicking again on a <type> should deselect it
    Given I click on "<selector>"

    When I click on "<selector>"
    Then I expect <type> "<selector>" to have style "outline" set to ""

    Examples:
      | type      | selector                                   |
      | component | #external1 .template                       |
      | link      | #link-server-laptop_link-server1-external1 |

  Scenario Outline: Clicking away from a selected <type> should deselect it
    Given I click on "<selector>"

    When I click on "#root"
    Then I expect <type> "<selector>" to have style "outline" set to ""

    Examples:
      | type      | selector                                   |
      | component | #external1 .template                       |
      | link      | #link-server-laptop_link-server1-external1 |

  Scenario Outline: Clicking on a different <type> should select it and deselect the previous one
    Given I click on "<selector1>"

    When I click on "<selector2>"
    Then I expect <type> "<selector1>" to have style "outline" set to ""
    And I expect <type> "<selector2>" to have style "outlineColor" set to "rgb(0, 149, 255)"
    And I expect <type> "<selector2>" to have style "outlineStyle" set to "solid"
    And I expect <type> "<selector2>" to have style "outlineWidth" set to "2px"

    Examples:
      | type      | selector1                                  | selector2                                    |
      | component | #external1 .template                       | #internal1 .template                         |
      | component | #external1 .template                       | #link-laptop-network_link-internal1-network1 |
      | link      | #link-server-laptop_link-server1-external1 | #link-laptop-network_link-internal1-network1 |
      | link      | #link-server-laptop_link-server1-external1 | #external1 .template                         |

  Scenario: Clicking on a component should select it and make action menu appear
    When I click on "#root #external1"
    Then I expect component "#root #external1 .template" to have style "outlineColor" set to "rgb(0, 149, 255)"
    And I expect component "#root #external1 .template" to have style "outlineStyle" set to "solid"
    And I expect component "#root #external1 .template" to have style "outlineWidth" set to "2px"
    And I expect "#action-menu" is visible
    And I expect "#create-link" is visible
    And I expect "#remove-component" is visible

  Scenario: Clicking on a link should select it and make action menu appear
    When I click on "#link-server-laptop_link-server1-external1"
    Then I expect component "#link-server-laptop_link-server1-external1" to have style "outlineColor" set to "rgb(0, 149, 255)"
    And I expect component "#link-server-laptop_link-server1-external1" to have style "outlineStyle" set to "solid"
    And I expect component "#link-server-laptop_link-server1-external1" to have style "outlineWidth" set to "2px"
    And I expect "#action-menu" is visible
    And I expect "#remove-link" is visible

  Scenario: Clicking on a component on read-only should not select it
    When I click on "#read-only-checkbox"
    And  I click on "#root #external1"
    Then I expect "#action-menu" to not exist

  Scenario: Clicking on a link on read-only should not select it
    When I click on "#read-only-checkbox"
    And  I click on "#link-server-laptop_link-server1-external1"
    Then I expect "#action-menu" to not exist
