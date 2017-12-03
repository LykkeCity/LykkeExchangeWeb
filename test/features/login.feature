Feature: Login test
    As a User of LykkeWallet
    I want to login with my credentials
    So that I can have access to my wallet

@Pending
Scenario: open URL
    Given I open the url "/"
    Then  I expect that the path is "/login"
    And   I expect that the title is "Lykke Exchange Web"

Scenario: login with valid credentials
    Given I open the url "/"
    When I set "REACT_APP_LOGIN" to the inputfield "#email"
    When  I set "REACT_APP_PASSWORD" to the inputfield "#password"
    When I press "Enter"
    When I pause for 1000ms
    Then I expect that the path is "/wallets/trading"

@Pending
Scenario: login with fake credentials
    Given I open the url "/"
    When I set "not-existing@email.com" to the inputfield "#email"
    When  I set "1234" to the inputfield "#password"
    When I press "Enter"
    When I pause for 1000ms
    Then  I expect that element ".login-form" contains the text "Invalid username or password"
