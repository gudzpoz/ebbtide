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
<h3 class="title2 mb5">{{ title }}</h3>
<span class="caption">by <router-link :to="getAuthorLink(authorId)">{{ author }}</router-link> on {{ time(timeUTC) }}</span>
<div v-if="content" v-html="content"></div>
<div v-else-if="thread && thread.content_text">{{ thread.content_text }}</div>
<NewComment @posted="reload($route.params)"></NewComment>
<w-list :items="replies" class="ml6" column>
  <template #item="{ item }">
    <div column class="mt2">
      <span class="caption">by <router-link :to="getAuthorLink(item.author.id)">{{ item.author.username }}</router-link> on {{ time(item.created) }}</span>
      <div v-if="item.content_html" class="reply" v-html="item.content_html"></div>
      <div v-else-if="item.content_text" class="reply">{{ item.content_text }}</div>
    </div>
  </template>
</w-list>
</template>

<script>
import moment from 'moment'
import NewComment from './NewComment.vue'

export default {
  name: 'Post',
  data () {
    return {
      title: '',
      content: '',
      author: '',
      authorId: '',
      timeUTC: '',
      replies: [],
      thread: null
    }
  },
  methods: {
    time (utc) {
      return moment.utc(utc).fromNow()
    },
    reload (params) {
      var id = Number.parseInt(params.id);
      if(Number.isInteger(id)) {
        fetch(this.apiPath + '/posts/' + id)
          .then((response) => { return response.json() })
          .then((json) => {
            this.title = json.title
            this.content = json.content_html
            this.author = json.author.username
            this.authorId = json.author.id
            this.timeUTC = json.created
            this.replies = json.replies
            this.thread = json
            this.$emit('title', 'Post')
          })
      }
    },
    getAuthorLink (id) {
      return '/main/user/' + id
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
  components: {
    NewComment: NewComment
  }
}
</script>

<style scoped>
.reply {
  font-size: medium;
}
</style>
