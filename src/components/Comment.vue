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
<div>
  <span class="caption">by <router-link :to="getAuthorLink(item.author.id)">{{ item.author.username }}</router-link> on {{ time(item.created) }}</span>
  <div v-if="item.content_html" class="reply" v-html="item.content_html"></div>
  <div v-else-if="item.content_text" class="reply">{{ item.content_text }}</div>
  <w-button @click="replying = !replying" icon="mdi mdi-reply-outline" text lg color="info">Reply</w-button>
  <w-button @click="this.$emit('reply', { item: item, reply: reply })" v-if="replying" color="info" class="ml3">Submit</w-button>
  <w-textarea v-if="replying" v-model:model-value="reply">Comment</w-textarea>
  <div class="ml6 column">
    <Comment column class="mt2" v-for="i in item.replies" :key="i.created" :item="i" @reply="passon"></Comment>
  </div>
</div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Comment',
  emits: ['reply'],
  props: {
    item: Object
  },
  methods: {
    time (utc) {
      return moment.utc(utc).fromNow()
    },
    getAuthorLink (id) {
      return '/main/user/' + id
    },
    passon (item) {
      this.$emit('reply', item)
    }
  },
  data () {
    return {
      replying: false,
      reply: ''
    }
  }
}
</script>
