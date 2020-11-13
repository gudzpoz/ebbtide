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
    <w-form @submit="submit">
      <w-input label="User name" type="text" :validators="[validators.required]" v-model:model-value="user"></w-input>
      <w-input label="Password" type="password" v-model:model-value="pass"></w-input>
      <w-input label="Password Again" type="password" v-model:model-value="passAgain"></w-input>
      <w-input label="E-Mail (optional)" type="text" v-model:model-value="mail"></w-input>
      <w-flex class="mt3 fill-width">
        <div class="error">{{ error }}</div>
        <w-spinner v-if="registering"></w-spinner>
        <div class="spacer"></div>
        <w-button type="submit">Submit</w-button>
      </w-flex>
    </w-form>
  </w-card>
</w-overlay>
</template>

<script>
export default {
  name: 'NewUser',
  emits: ['registered', 'close'],
  data () {
    return {
      validators: {
        required: value => !!value || 'This field is required'
      },
      mail: '',
      registering: false,
      error: '',
      user: '',
      pass: '',
      passAgain: ''
    }
  },
  methods: {
    validate () {
      if(this.user) {
        if(this.pass && this.pass === this.passAgain) {
          if(this.mail) {
            const mail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if(mail.test(this.mail.toLowerCase())) {
              return true
            } else {
              this.error = 'Invalid Email!'
            }
          } else {
            return true
          }
        } else {
          this.error = 'Password not matching!'
        }
      }
      return false
    },
    submit () {
      this.registering = true
      if(this.validate()) {
        this.$lotide.register(this.user, this.pass, this.mail).then((response) => {
          this.registering = false
          if(response) {
            this.$emit('registered')
          } else {
            this.error = 'Please try again'
          }
        })
      } else {
        this.registering = false
      }
    }
  }
}
</script>
