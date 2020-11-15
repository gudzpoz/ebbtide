<!--
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
-->

<template>
<w-app>
  <w-toolbar shadow class="mt0 mb5 py3 no-grow">
    <w-button icon="mdi mdi-menu" text xl class="mr3" @click="drawerShow = true"></w-button>
    <div class="title2 mt1">{{ title }}</div>
    <div class="spacer"></div>
    <w-button v-if="!loggedIn" xl @click="registerForm = true" bg-color="success" class="mr2"><w-icon xl color="white" class="mr3">mdi mdi-account-plus</w-icon>Sign Up</w-button>
    <w-button v-if="!loggedIn" xl @click="loginForm = true" bg-color="info"><w-icon xl color="white" class="mr3">mdi mdi-login</w-icon>Login</w-button>
    <w-button v-if="loggedIn" xl @click="prompt = 'Are you sure to log out?'; logoutPrompt = true" bg-color="warning"><w-icon xl color="white" class="mr3">mdi mdi-logout</w-icon>Log Out</w-button>
  </w-toolbar>
  <w-drawer :model-value="drawerShow"  left @close="drawerShow = false">
    <w-flex class="column mx3 mt3">
      <w-icon xl size="4em" bg-color="info" color="white" class="mb4">mdi mdi-hydro-power</w-icon>
      <w-list :items="items" nav class="fill-width"></w-list>
    </w-flex>
  </w-drawer>
  <div class="mx4 mb6 pb6"><router-view @title="changeTitle"></router-view></div>
  <LoginForm v-if="loginForm" class="absolute" @close="loginForm = false" @logged="loggedIn = true; loginForm = false"></LoginForm>
  <NewUser v-if="registerForm" class="absolute" @close="registerForm = false" @registered="registerForm = false"></NewUser>
  <Prompt v-if="logoutPrompt" :title="prompt" @confirm="logout" @cancel="logoutPrompt = false"></Prompt>
</w-app>
</template>

<script>
import NewUser from './components/NewUser.vue'
import LoginForm from './components/LoginForm.vue'
import Prompt from './components/Prompt.vue'

export default {
  name: 'App',
  data: () => {
    return {
      registerForm: false,
      drawerShow: false,
      title: 'ebbtide',
      loginForm: false,
      logoutPrompt: false,
      loggedIn: false,
      prompt: '',
      items: [
        { label: 'The Whole Known Timeline', route: '/main/all' },
        { label: 'Home Timeline', route: '/main/community/followed' },
        { label: 'Communities', route: '/main/communities' },
        { label: 'Search', route: '/main/search' },
        { label: 'Me', route: '/main/user/me' },
        { label: 'About', route: '/main/about' }
      ]
    }
  },
  created () {
    this.$lotide.updateLoginStatus()
    this.loggedIn = this.$lotide.isLoggedIn()
  },
  methods: {
    changeTitle (title) {
      this.title = title
      document.title = title
    },
    logout () {
      this.prompt = 'Logging Out...'
      this.$lotide.logout().then((response) => {
        if(response) {
          this.loggedIn = false
          this.logoutPrompt = false
        } else {
          this.prompt = 'Logout Failed'
        }
      })
    }
  },
  components: {
    LoginForm: LoginForm,
    Prompt: Prompt,
    NewUser: NewUser,
  },
  watch: {
    $route () {
      this.drawerShow = false
    }
  }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: #2c3e50;
}
</style>
