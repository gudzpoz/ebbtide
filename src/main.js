import { createApp, h } from 'vue'
import App from './App.vue'
import WaveUI from 'wave-ui'
import 'wave-ui/dist/wave-ui.css'
import '@mdi/font/css/materialdesignicons.css'

const VueRouter = require('vue-router')
const config = require('./config.js')

import Communities from './components/Communities.vue'
import Community from './components/Community.vue'
import NewPost from './components/NewPost.vue'
import Post from './components/Post.vue'
import NotFound from './components/NotFound.vue'

const routes = [
  { path: '/', redirect: '/main' },
  { path: '/main', redirect: '/main/communities' },
  { path: '/main/communities', component: Communities },
  { path: '/main/community/:id', component: Community },
  { path: '/main/community/:id/new', component: NewPost },
  { path: '/main/post/:id', component: Post },
  { path: '/404', component: NotFound },
  { path: '/:pathMatch(.*)*', redirect: '/404' }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: routes,
})

const app = createApp({
    render: () => h(App)
})

app.use(router)
app.config.globalProperties.apiPath = config.api;

new WaveUI(app, {
})

app.mount('#app')
