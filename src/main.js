import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import VueI18n from 'vue-i18n'
import { messages, dateTimeFormats } from '@/messages'

Vue.config.productionTip = false

Vue.use(VueI18n)

// Create VueI18n instance with options
export const i18n = new VueI18n({
  locale: 'en-CA', // default locale
  messages, // localized strings
  dateTimeFormats // locale-specific date and time formats
})

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App)
}).$mount('#app')
