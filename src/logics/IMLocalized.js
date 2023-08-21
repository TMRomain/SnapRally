import memoize from 'lodash.memoize'; // Use for caching/memoize for better performance
import i18n from 'i18n-js';
import * as RNLocalize  from 'react-native-localize';
import { I18nManager } from 'react-native';


export const translationGetters = {
    'fr-FR': () => require('../translations/fr.json'),
    'fr-CA': () => require('../translations/fr.json'),
  };

  export const IMLocalized = memoize(
    (key, config) =>
      i18n.t(key, config).includes('missing') ? key : i18n.t(key, config),
    (key, config) => (config ? key + JSON.stringify(config) : key),
  );
  export const init = () => {
    let localize = RNLocalize.getLocales()[0];
    let localeLanguageTag = localize.languageTag;
    let isRTL = localize.isRTL;
    console.log(localize);
    console.log(localeLanguageTag);
    console.log(isRTL);
    IMLocalized.cache.clear();
    // update layout direction
    I18nManager.forceRTL(isRTL);
    // set i18n-js config
    i18n.translations = {
      [localeLanguageTag]: translationGetters[localeLanguageTag](),
    };
    i18n.locale = localeLanguageTag;
  };