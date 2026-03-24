import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(ElementPlus)

Sentry.init({
  app,
  dsn: 'https://3147bf2f9671f799dda27fabe4dd1b90@o4511097411796992.ingest.us.sentry.io/4511097883721728',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
})

app.use(createPinia())
app.use(router)

app.mount('#app')
