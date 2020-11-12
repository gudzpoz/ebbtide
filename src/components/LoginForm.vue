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
  <w-overlay @close="this.$emit('close')" :model-value="true">
    <w-card title="Login" title-class="blue-light5--bg" bg-color="white">
      <w-form @submit="submit" @input="error = ''">
        <w-input label="User name" type="text" :validators="[validators.required]" v-model:model-value="user"></w-input>
        <w-input label="Password" type="password" :validators="[validators.required]" v-model:model-value="pass"></w-input>
        <w-flex class="mt3 fill-width">
          <div class="error">{{ error }}</div>
          <w-spinner v-if="logging"></w-spinner>
          <div class="spacer"></div>
          <w-button type="submit">Submit</w-button>
        </w-flex>
      </w-form>
    </w-card>
  </w-overlay>
</template>

<script>
export default {
  name: 'LoginForm',
  data () {
    return {
      validators: {
        required: value => !!value || 'This field is required'
      },
      logging: false,
      error: '',
      user: '',
      pass: ''
    }
  },
  methods: {
    submit () {
      this.logging = true
      fetch(this.apiPath + '/logins', {
        method: 'POST',
        body: JSON.stringify({
          username: this.user,
          password: this.pass
        })
      })
        .then((response) => {
          this.logging = false
          if(response.status === 200) {
            return response.json()
          } else {
            return null
          }
        })
        .then((json) => {
          if(json) {
            window.localStorage.setItem('token', json.token)
            window.localStorage.setItem('username', json.username)
            window.localStorage.setItem('id', json.id)
            this.$emit('logged')
          } else {
            this.error = 'Please try again'
          }
        })
    }
  }
}
</script>
