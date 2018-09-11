import Vue from 'vue'
import _ from 'underscore'

export default {
  install(Vue, options) {
    let t = null
    let isFromYml = false
    try {
      t = require(`./${options.locale}.json`)
    } catch(error) {
      t = require('./en.json')
    }
    if(Object.keys(t.locale.translations).length === 0) {
      isFromYml = true
      t = require('json-loader!yaml-loader!./en.yml')
      t.translations = this._getTranslations(t)
    }
    Vue.prototype.$I18N = (key, placeholder) => {
      let value = t.translations[`txt.apps.select_an_address.globals.${key}`]
      if (!_.isUndefined(placeholder)) {
        let stringPlaceholder = value.match(new RegExp(/(\{{.*?\}})/i))
        if (!_.isNull(stringPlaceholder))  return value.replace(stringPlaceholder[0], placeholder)
      }
      return value
    }
  },

  _getTranslations(t) {
    let translations = {}
    _.each(t.parts, (part) => {
      translations[part.translation.key] = part.translation.value
    })
    return translations
  }
}