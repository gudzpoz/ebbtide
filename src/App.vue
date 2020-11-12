<template>
<w-app>
  <w-toolbar shadow class="mt0 mb5 py3 no-grow">
    <w-button icon="mdi mdi-menu" text xl class="mr3" @click="drawerShow = true"></w-button>
    <div class="title2 mt1">{{ title }}</div>
    <div class="spacer"></div>
    <w-button v-if="!loggedIn" xl icon="mdi mdi-login" class="ml2" @click="loginForm = true" bg-color="info">Login</w-button>
    <w-button v-if="loggedIn" text xl icon="mdi mdi-logout" class="ml2" @click="prompt = 'Are you sure to log out?'; logoutPrompt = true" bg-color="warning">Log Out</w-button>
  </w-toolbar>
  <w-drawer :model-value="drawerShow"  left @close="drawerShow = false">
    <w-list :items="items" nav class="fill-width"></w-list>
  </w-drawer>
  <div class="mx4"><router-view @title="changeTitle"></router-view></div>
  <LoginForm v-if="loginForm" class="absolute" @close="loginForm = false" @logged="loggedin = true"></LoginForm>
  <Prompt v-if="logoutPrompt" :title="prompt" @confirm="logout" @cancel="logoutPrompt = false"></Prompt>
</w-app>
</template>

<script>
import LoginForm from './components/LoginForm.vue'
import Prompt from './components/Prompt.vue'

export default {
  name: 'App',
  data: () => {
    return {
      drawerShow: false,
      title: 'ebbtide',
      loginForm: false,
      logoutPrompt: false,
      loggedIn: false,
      prompt: '',
      items: [
        { label: 'Communities', route: '/main' },
        { label: 'Me', route: '/main/user' }
      ]
    }
  },
  created () {
    if(window.localStorage.getItem('token')) {
      this.loggedIn = true
    }
  },
  methods: {
    changeTitle (title) {
      this.title = title
      document.title = title
    },
    logout () {
      this.prompt = 'Logging Out...'
      fetch(this.apiPath + '/logins/~current', {
        method: 'DELETE'
      })
        .then((response) => {
          if(response.status === 204) {
            this.loggedIn = false
            this.logoutPrompt = false
            window.localStorage.removeItem('token')
            window.localStorage.removeItem('username')
            window.localStorage.removeItem('id')
          } else {
            this.prompt = 'Server returned ' + response.status
          }
        })
    }
  },
  components: {
    LoginForm: LoginForm,
    Prompt: Prompt
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
