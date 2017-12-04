import { defineSupportCode } from 'cucumber';

import clearInputField from 'cucumber-boilerplate/src/support/action/clearInputField';
import clickElement from 'cucumber-boilerplate/src/support/action/clickElement';
import closeLastOpenedWindow from 'cucumber-boilerplate/src/support/action/closeLastOpenedWindow';
import deleteCookie from 'cucumber-boilerplate/src/support/action/deleteCookie';
import dragElement from 'cucumber-boilerplate/src/support/action/dragElement';
import focusLastOpenedWindow from 'cucumber-boilerplate/src/support/action/focusLastOpenedWindow';
import handleModal from 'cucumber-boilerplate/src/support/action/handleModal';
import moveToElement from 'cucumber-boilerplate/src/support/action/moveToElement';
import pause from 'cucumber-boilerplate/src/support/action/pause';
import pressButton from 'cucumber-boilerplate/src/support/action/pressButton';
import scroll from 'cucumber-boilerplate/src/support/action/scroll';
import selectOption from 'cucumber-boilerplate/src/support/action/selectOption';
import selectOptionByIndex from 'cucumber-boilerplate/src/support/action/selectOptionByIndex';
import setCookie from 'cucumber-boilerplate/src/support/action/setCookie';
import setInputField from 'cucumber-boilerplate/src/support/action/setInputField';
import setEnvInputField from '../support/action/setEnvInputField';
import setPromptText from 'cucumber-boilerplate/src/support/action/setPromptText';
import submitForm from 'cucumber-boilerplate/src/support/action/submitForm';


defineSupportCode(({ When }) => {
    When(
        /^I (click|doubleclick) on the (link|button|element) "([^"]*)?"$/,
        clickElement
    );

    When(
        /^I (add|set) "([^"]*)?" to the inputfield "([^"]*)?"$/,
        setInputField
    );

    When(
        /^I (add|set) env "([^"]*)?" to the inputfield "([^"]*)?"$/,
        setEnvInputField
    );

    When(
        /^I clear the inputfield "([^"]*)?"$/,
        clearInputField
    );

    When(
        /^I drag element "([^"]*)?" to element "([^"]*)?"$/,
        dragElement
    );

    When(
        /^I submit the form "([^"]*)?"$/,
        submitForm
    );

    When(
        /^I pause for (\d+)ms$/,
        pause
    );

    When(
        /^I set a cookie "([^"]*)?" with the content "([^"]*)?"$/,
        setCookie
    );

    When(
        /^I delete the cookie "([^"]*)?"$/,
        deleteCookie
    );

    When(
        /^I press "([^"]*)?"$/,
        pressButton
    );

    When(
        /^I (accept|dismiss) the (alertbox|confirmbox|prompt)$/,
        handleModal
    );

    When(
        /^I enter "([^"]*)?" into the prompt$/,
        setPromptText
    );

    When(
        /^I scroll to element "([^"]*)?"$/,
        scroll
    );

    When(
        /^I close the last opened (window|tab)$/,
        closeLastOpenedWindow
    );

    When(
        /^I focus the last opened (window|tab)$/,
        focusLastOpenedWindow
    );

    When(
        /^I select the (\d+)(st|nd|rd|th) option for element "([^"]*)?"$/,
        selectOptionByIndex
    );

    When(
        /^I select the option with the (name|value|text) "([^"]*)?" for element "([^"]*)?"$/,
        selectOption
    );

    When(
        /^I move to element "([^"]*)?"(?: with an offset of (\d+),(\d+))*$/,
        moveToElement
    );
});
