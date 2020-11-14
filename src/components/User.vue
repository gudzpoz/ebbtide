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
<h3 class="title2 mb5">
  <w-icon v-if="json.avatar" :style="'background: url(' + json.avatar.url + '); background-size: cover;'"></w-icon>
  {{ username }}
</h3>
<w-tag v-if="local">Local</w-tag>
<a v-else :href="remote_url">Remote Profile</a>
<span class="caption">{{ username }}@{{ host }}</span>
<br>
<div v-html="description"></div>
</template>

<script>
export default {
  name: 'User',
  emits: ['title'],
  data () {
    return {
      username: '',
      host: '',
      local: false,
      remote_url: '',
      description: '',
      me: false,
      json: {},
    }
  },
  methods: {
    reload () {
      const re = /^\/main\/user\//
      if(re.test(this.$route.path)) {
        var id = Number.parseInt(this.$route.params.id)
        if(this.$route.params.id === 'me' && this.$lotide.isLoggedIn()) {
          this.me = true
          id = Number.parseInt(this.$lotide.getMe().id)
        }
        if(Number.isInteger(id)) {
          this.$lotide.getUser(id).then((json) => {
            if(json) {
              this.username = json.username
              this.host = json.host
              this.local = json.local
              this.remote_url = json.remote_url
              this.description = json.description
              this.json = json
            }
          })
        }
      }
    }
  },
  created () {
    this.$watch(
      () => this.$route.params,
      () => {
        this.reload()
      })
    this.reload()
  }
}
</script>

<style scoped>
.reply {
    font-size: medium;
}
</style>

<style>
</style>
