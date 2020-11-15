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
<object v-if="img" :data="img" />
<div v-if="content" v-html="content" class="content"></div>
<div v-else-if="thread && thread.content_text" class="content">{{ thread.content_text }}</div>
<NewComment @posted="reload($route.params)"></NewComment>
<div class="ml6 column">
  <Comment @reply="reply" column class="mt2" v-for="item in replies" :key="item.created" :item="item"></Comment>
</div>
</template>

<script>
import moment from 'moment'
import Comment from './Comment.vue'
import NewComment from './NewComment.vue'

export default {
  name: 'Post',
  emits: ['title'],
  data () {
    return {
      title: '',
      content: '',
      img: null,
      author: '',
      authorId: '',
      timeUTC: '',
      replies: [],
      thread: null
    }
  },
  methods: {
    reply (item) {
      this.$lotide.replyToComment(item.reply, item.item.id, true).then((json) => {
        if(json) {
          this.reload(this.$route.params)
        } else {
          alert('Reply failed.')
        }
      })
    },
    time (utc) {
      return moment.utc(utc).fromNow()
    },
    reload (params) {
      var id = Number.parseInt(params.id)
      if(Number.isInteger(id)) {
        this.$lotide.getPost(id).then((json) => {
          if(json) {
            if(json.href) {
              this.img = json.href
            }
            this.title = json.title
            this.content = json.content_html
            this.author = json.author.username
            this.authorId = json.author.id
            this.timeUTC = json.created
            this.replies = json.replies
            this.thread = json
            this.$emit('title', 'Post')
          }
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
      () => {
        const re = /^\/main\/post\//
        if(re.test(this.$route.path)) {
          this.reload(params)
        }
      })
    this.reload(this.$route.params)
  },
  components: {
    NewComment: NewComment,
    Comment: Comment
  }
}
</script>

<style scoped>
.reply {
    font-size: medium;
}
object {
    max-width: 100%;
    display: block;
}
</style>

<style> 
.content ul, .content ol {
    padding-left: 2em;
}
.content * {
    margin: 0.5em;
}
</style>
