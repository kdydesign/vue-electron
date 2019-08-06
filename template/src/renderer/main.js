import Vue from 'vue'
{{#isEnabled plugins 'axios'}}
import axios from 'axios'
{{/isEnabled}}

import App from './App'
{{#isEnabled plugins 'vue-router'}}
import router from './router'
{{/isEnabled}}
{{#isEnabled plugins 'vuex'}}
import store from './store'
{{/isEnabled}}
{{#isEnabled framework 'vuetify'}}
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
{{/isEnabled}}
{{#isEnabled framework 'quasar'}}
import Quasar from 'quasar'

import 'quasar/dist/quasar.min.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import '@quasar/extras/mdi-v3/mdi-v3.css'
import '@quasar/extras/ionicons-v4/ionicons-v4.css'
import '@quasar/extras/eva-icons/eva-icons.css'
import '@quasar/extras/themify/themify.css'
import '@quasar/extras/animate/fadeIn.css'
import '@quasar/extras/animate/fadeOut.css'

Vue.use(Quasar, {
  config: {
    framework: 'all'
  },
})
{{/isEnabled}}

{{#isEnabled plugins 'vue-electron'}}
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
{{/isEnabled}}
{{#isEnabled plugins 'axios'}}
Vue.http = Vue.prototype.$http = axios
{{/isEnabled}}
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  {{#isEnabled plugins 'vue-router'}}
  router,
  {{/isEnabled}}
  {{#isEnabled plugins 'vuex'}}
  store,
  {{/isEnabled}}
  template: '<App/>'
}).$mount('#app')
