/*
    Ebbtide - A frontend for lotide
    Copyright (C) 2020  gudzpoz

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { createApp, h } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import WaveUI from 'wave-ui'
import 'wave-ui/dist/wave-ui.css'
import '@mdi/font/css/materialdesignicons.css'
import LotideApi from './plugins/lotide-api.js'

const VueRouter = require('vue-router')
const config = require('./config.js')

import Communities from './components/Communities.vue'
import Community from './components/Community.vue'
import NewPost from './components/NewPost.vue'
import Post from './components/Post.vue'
import About from './components/About.vue'
import NotFound from './components/NotFound.vue'

const routes = [
  { path: '/', redirect: '/main' },
  { path: '/main', redirect: '/main/communities' },
  { path: '/main/communities', component: Communities },
  { path: '/main/all', component: Community },
  { path: '/main/community/:id', component: Community },
  { path: '/main/community/:id/new', component: NewPost },
  { path: '/main/post/:id', component: Post },
  { path: '/main/about', component: About },
  { path: '/main/404', component: NotFound },
  { path: '/:pathMatch(.*)*', redirect: '/main/404' }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes: routes,
})

const app = createApp({
    render: () => h(App)
})

const i18n = createI18n({
  locale: window.navigator.language,
  fallbackLocale: 'en',
  messages: {}
})

app.use(router)
app.use(LotideApi, { apiPath: config.api })
app.use(i18n)
app.config.globalProperties.apiPath = config.api;

new WaveUI(app, {
})

app.mount('#app')
