import { defineSupportCode } from 'cucumber';

import setEnvInputField from '../support/action/setEnvInputField';


defineSupportCode(({ When }) => {
    When(
        /^I (add|set) env "([^"]*)?" to the inputfield "([^"]*)?"$/,
        setEnvInputField
    );
});
