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
<w-spinner v-if="items.length === 0" />
<w-button v-if="id !== null && loggedIn" @click="routeNewPost">New Post</w-button>
<w-list :items="items" nav :hover="false">
  <template #item="{ item }">
    <span class="title3 post-link">{{ item.label }}</span>
  </template>
</w-list>
</template>

<script>
export default {
  name: 'Community',
  data () {
    return {
      items: [],
      id: null
    }
  },
  computed: {
    loggedIn () {
      return !!window.localStorage.getItem('token')
    }
  },
  methods: {
    routeNewPost () {
      this.$router.push('' + this.id + '/new')
    },
    reload (params) {
      var id = Number.parseInt(params.id)
      if(Number.isInteger(id)) {
        this.id = id
        
        fetch(this.apiPath + '/communities/' + id + '/posts')
          .then((response) => {
            return response.json()
          })
          .then((json) => {
            var posts = [];
            for(var item of json) {
              posts.push({
                label: item.title,
                route: '/main/post/' + item.id
              })
            }
            this.items = posts
          })
      }
    }
  },
  created () {
    this.$watch(
      () => this.$route.params,
      (params) => {
        this.reload(params)
      })
    this.reload(this.$route.params)
  },
  props: {
    msg: String
  }
}
</script>

<style scoped>
.post-link {
    text-decoration: underline;
}
.post-link:hover {
    text-decoration: underline;
    color: blue;
}
</style>
