import App from './App.vue'
import Vue from 'vue'
import zaf from '@/libs/ZAFClient'
import I18N from '@/translations'

Vue.config.productionTip = process.env.VUE_APP_IS_PRODUCTION === 'true'

const vm = new Vue({
  render: h => h(App)
})

zaf.init()
zaf.client.on('app.registered', async (data) => {
  await zaf.setCurrentUser()
  zaf.setTicketId(data.context.ticketId)
  zaf.getAppLocation(data.context.location)
  Vue.use(I18N, { locale: zaf.currentUser.locale })
  vm.$mount('#app')
})