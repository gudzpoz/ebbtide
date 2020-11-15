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
<w-card v-if="description" class="thinner mb5"><pre>{{ description }}</pre></w-card>
<w-button v-if="id !== null && loggedIn" @click="routeNewPost">New Post</w-button>
<w-button v-if="id !== null && loggedIn" @click="followCommunity" class="ml5">{{ follow && follow.accepted ? 'Unfollow' : 'Follow' }}</w-button>
<w-list :items="items" nav :hover="false" class="mt4">
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
      description: null,
      follow: null,
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
    followCommunity () {
      if(this.follow && this.follow.accepted) {
        this.$lotide.unfollowCommunity(this.id)
        this.follow = null
      } else {
        this.$lotide.followCommunity(this.id)
        this.follow = { accepted: true }
      }
    },
    reload () {
      var params = this.$route.params
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
        this.$lotide.getCommunity(id).then((json) => {
          this.description = json.description
          if(this.$lotide.isLoggedIn() && json.your_follow) {
            this.follow = json.your_follow
          }
        })
      } else if(!params.id) {
        this.id = null
        this.description = null
        this.follow = null
        this.$lotide.getPosts().then(load)
        this.$emit('title', 'The Whole Known Timeline')
      } else if(params.id === 'followed') {
        this.id = null
        this.description = null
        this.follow = null
        this.$lotide.getFollowingPosts().then(load)
        this.$emit('title', 'Posts From Followed Communities')
      }
    }
  },
  created () {
    // to be solved: this will continue to probe changes even if the view is unmounted
    this.$watch(
      () => this.$route.params,
      () => {
        const re = /^(\/main\/all)|(\/main\/community\/)/
        if(re.test(this.$route.path)) {
          this.reload()
        }
      })
    this.reload()
  },
  props: {
    msg: String
  }
}
</script>

<style scoped>
.thinner {
    max-width: 35em;
}
pre {
    white-space: pre-wrap;
}
.post-link:empty::before {
    content: "untitled";
    opacity: 0.25;
}
.post-link {
    text-decoration: underline;
}
.post-link:hover {
    text-decoration: underline;
    color: blue;
}
</style>
