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
    <span class="title3 post-link">{{ item.title }}</span>
    <span class="caption ml3">{{ time(item.created) }}</span>
    <span class="caption ml3">by <a :href="item.author.id && getAuthorLink(item.author.id)">{{ item.author.username }}</a></span>
    <span class="caption ml3">in <a :href="item.community.id && getCommunityLink(item.community.id)">{{ item.community.name }}</a></span>
  </template>
</w-list>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Community',
  emits: ['title'],
  data () {
    return {
      items: [],
      id: null
    }
  },
  computed: {
    loggedIn () {
      return this.$lotide.isLoggedIn()
    }
  },
  methods: {
    getAuthorLink (id) {
      return '/main/user/' + id
    },
    getCommunityLink (id) {
      return '/main/community/' + id
    },
    time (utc) {
      return moment.utc(utc).fromNow()
    },
    routeNewPost () {
      this.$router.push('' + this.id + '/new')
    },
    reload (params) {
      var id = Number.parseInt(params.id)
      var load = (json) => {
        if(json) {
          json.forEach((item) => { item.route = '/main/post/' + item.id })
          if(json.length === 0) {
            this.items = [{
              title: 'Not any posts here. Post the first post!',
              created: null,
              author: {
                username: 'nobody'
              },
              community: {
                name: 'nowhere'
              }
            }]
          } else {
            this.items = json
          }
        }
      }
      if(Number.isInteger(id)) {
        this.id = id
        this.$lotide.getCommunityPosts(id).then(load)
      } else if(!params.id) {
        this.$lotide.getPosts().then(load)
        this.$emit('title', 'The Whole Known Timeline')
      }
    }
  },
  created () {
    // to be solved: this will continue to probe changes even if the view is unmounted
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
