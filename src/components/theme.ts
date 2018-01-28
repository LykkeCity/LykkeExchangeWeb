import {parseToRgb, rgba} from 'polished';

export interface ThemeInterface {
  color: {
    primary: string;
    green: string;
    violet: string;
    red: string;
    secondary: string;
    yellow: string;
    active: string;
    white: string;
    light: string;
    text: string;
    dark: string;
    gray: string;
    grayLight: string;
    gray25: string;
    gray5: string;
    grayDark: string;
    border: string;
    disabled: string;
    mask: string;
    socialButton: string;
  };

  borderRadius: string;

  boxShadowValue: string;
  boxShadowPopup: string;
  boxShadowModal: string;

  ff: string;

  fwBlack: number;
  fwExtra: number;
  fwBold: number;
  fwSemi: number;
  fwRegular: number;
  fwLight: number;
  fwThin: number;

  transitionDefault: string;
  transitionAll: string;

  mainFontSize: string;

  screenMobileTiny: string;
  screenMobile: string;
  screenMobileOld: string;
  screenLandscape: string;
  screenTablet: string;
  screenDesktop: string;
}

const base = {
  color: {
    primary: '#0DA7FC',
    // tslint:disable-next-line:object-literal-sort-keys
    green: '#13B72A',
    violet: '#ab00ff',
    red: '#FF3E2E',
    secondary: '#3F4D60',
    yellow: '#FFAE2C',
    active: '#039df2',
    white: '#fff',
    light: '#f8f7ef',
    text: '#333333',
    dark: '#272723',
    gray: '#909c9e',
    grayLight: '#b2b8bf',
    gray25: '#CFD2D7',
    gray5: '#F5F6F7',
    grayDark: '#8c94a0',
    border: '#e1e1e1',
    disabled: '#EBEDEF'
  },

  borderRadius: '4px',

  boxShadowValue: '0 8px 40px 0',
  // tslint:disable-next-line:object-literal-sort-keys
  boxShadowPopup:
    '0 5px 5px 0 rgba(63,77,96,0.05), 0 8px 50px 0 rgba(63,77,96,0.40)',

  ff: `"Proxima Nova", "Segoe UI", "Roboto", "Droid Sans", "Helvetica Neue", "Arial", "sans-serif"`,

  fwBlack: 900,
  fwExtra: 800,
  fwBold: 700,
  fwSemi: 600,
  fwRegular: 400,
  fwLight: 300,
  fwThin: 200,

  transitionDefault: '.3s ease',

  mainFontSize: '24px',

  screenMobileTiny: '480px',
  screenMobile: '543px',
  screenMobileOld: '640px',
  screenLandscape: '767px',
  screenTablet: '991px',
  screenDesktop: '1199px'
};

const maskColor = rgba({...parseToRgb(base.color.secondary), alpha: 0.35});
const socialButtonColor = rgba({
  ...parseToRgb(base.color.secondary),
  alpha: 0.8
});

const theme: ThemeInterface = {
  ...base,
  boxShadowModal: `${base.boxShadowValue} rgba(140,147,160,0.60)`,
  color: {
    ...base.color,
    mask: maskColor,
    socialButton: socialButtonColor
  },
  transitionAll: `all ${base.transitionDefault}`
};

export interface Theme {
  theme?: ThemeInterface;
}

export default theme;
