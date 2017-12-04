import * as numeral from 'numeral';
import 'numeral/locales';
import * as React from 'react';

// TODO: consider using format.js as intl provider
const knownLocales = [
  'bg',
  'chs',
  'cs',
  'da-dk',
  'de-ch',
  'de',
  'en-au',
  'en-gb',
  'en-za',
  'es-es',
  'es',
  'et',
  'fi',
  'fr-ca',
  'fr-ch',
  'fr',
  'hu',
  'it',
  'ja',
  'lv',
  'nl-be',
  'nl-nl',
  'no',
  'pl',
  'pt-br',
  'pt-pt',
  'ru-ua',
  'ru',
  'sk',
  'sl',
  'th',
  'tr',
  'uk-ua',
  'vi'
];

numeral.zeroFormat('0.00');
const lang =
  (window.navigator.languages && window.navigator.languages[0]) ||
  (window.navigator as any).userLanguage ||
  window.navigator.language;

numeral.locale(knownLocales.find(x => x.toLowerCase() === lang.toLowerCase()));

interface NumberFormatProps {
  value: number;
  format?: string;
}

export const NumberFormat: React.SFC<NumberFormatProps> = ({
  value,
  format = '0,0[.]00'
}) => <span>{numeral(value).format(format)}</span>;
