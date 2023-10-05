import Vue from 'vue'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import vuetify from './plugins/vuetify'
import '@/styles/styles.scss'

const app = new Vue({
  vuetify,
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')

export default app
