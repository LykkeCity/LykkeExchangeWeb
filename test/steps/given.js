import { defineSupportCode } from 'cucumber';

import checkContainsAnyText from 'cucumber-boilerplate/src/support/check/checkContainsAnyText';
import checkIsEmpty from 'cucumber-boilerplate/src/support/check/checkIsEmpty';
import checkContainsText from 'cucumber-boilerplate/src/support/check/checkContainsText';
import checkCookieContent from 'cucumber-boilerplate/src/support/check/checkCookieContent';
import checkCookieExists from 'cucumber-boilerplate/src/support/check/checkCookieExists';
import checkDimension from 'cucumber-boilerplate/src/support/check/checkDimension';
import checkElementExists from 'cucumber-boilerplate/src/support/check/checkElementExists';
import checkEqualsText from 'cucumber-boilerplate/src/support/check/checkEqualsText';
import checkModal from 'cucumber-boilerplate/src/support/check/checkModal';
import checkOffset from 'cucumber-boilerplate/src/support/check/checkOffset';
import checkProperty from 'cucumber-boilerplate/src/support/check/checkProperty';
import checkSelected from 'cucumber-boilerplate/src/support/check/checkSelected';
import checkTitle from 'cucumber-boilerplate/src/support/check/checkTitle';
import checkUrl from 'cucumber-boilerplate/src/support/check/checkURL';
import closeAllButFirstTab from 'cucumber-boilerplate/src/support/action/closeAllButFirstTab';
import compareText from 'cucumber-boilerplate/src/support/check/compareText';
import isEnabled from 'cucumber-boilerplate/src/support/check/isEnabled';
import isVisible from 'cucumber-boilerplate/src/support/check/isVisible';
import openWebsite from 'cucumber-boilerplate/src/support/action/openWebsite';
import resizeScreenSize from 'cucumber-boilerplate/src/support/action/resizeScreenSize';


defineSupportCode(({ Given }) => {
    Given(
        /^I open the (url|site) "([^"]*)?"$/,
        openWebsite
    );

    Given(
        /^the element "([^"]*)?" is( not)* visible$/,
        isVisible
    );

    Given(
        /^the element "([^"]*)?" is( not)* enabled$/,
        isEnabled
    );

    Given(
        /^the element "([^"]*)?" is( not)* selected$/,
        checkSelected
    );

    Given(
        /^the checkbox "([^"]*)?" is( not)* checked$/,
        checkSelected
    );

    Given(
        /^there is (an|no) element "([^"]*)?" on the page$/,
        checkElementExists
    );

    Given(
        /^the title is( not)* "([^"]*)?"$/,
        checkTitle
    );

    Given(
        /^the element "([^"]*)?" contains( not)* the same text as element "([^"]*)?"$/,
        compareText
    );

    Given(
        /^the (button|element) "([^"]*)?"( not)* matches the text "([^"]*)?"$/,
        checkEqualsText
    );

    Given(
        /^the (button|element) "([^"]*)?"( not)* contains the text "([^"]*)?"$/,
        checkContainsText
    );

    Given(
        /^the (button|element) "([^"]*)?"( not)* contains any text$/,
        checkContainsAnyText
    );

    Given(
        /^the (button|element) "([^"]*)?" is( not)* empty$/,
        checkIsEmpty
    );

    Given(
        /^the page url is( not)* "([^"]*)?"$/,
        checkUrl
    );

    Given(
        /^the( css)* attribute "([^"]*)?" from element "([^"]*)?" is( not)* "([^"]*)?"$/,
        checkProperty
    );

    Given(
        /^the cookie "([^"]*)?" contains( not)* the value "([^"]*)?"$/,
        checkCookieContent
    );

    Given(
        /^the cookie "([^"]*)?" does( not)* exist$/,
        checkCookieExists
    );

    Given(
        /^the element "([^"]*)?" is( not)* ([\d]+)px (broad|tall)$/,
        checkDimension
    );

    Given(
        /^the element "([^"]*)?" is( not)* positioned at ([\d]+)px on the (x|y) axis$/,
        checkOffset
    );

    Given(
        /^I have a screen that is ([\d]+) by ([\d]+) pixels$/,
        resizeScreenSize
    );

    Given(
        /^I have closed all but the first (window|tab)$/,
        closeAllButFirstTab
    );

    Given(
        /^a (alertbox|confirmbox|prompt) is( not)* opened$/,
        checkModal
    );
});
