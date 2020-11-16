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
  <w-input v-model="title" class="title1" required>Title</w-input>
  <w-button @click="submit" class="my3">
    <w-icon class="mr2">mdi mdi-send</w-icon>
    Send!
  </w-button>
  <textarea id="easymde" />
</div>
</template>

<script>
import EasyMDE from 'easymde'
import 'easymde/dist/easymde.min.css'

var easyMDE;

export default {
  name: 'NewPost',
  data () {
    return {
      title: ''
    }
  },
  methods: {
    submit () {
      var id = Number.parseInt(this.$route.params.id)
      if(this.title && Number.isInteger(id)) {
        this.$lotide.postPost(this.title, easyMDE.value(), id, true).then((json) => {
          if(json) {
            this.$router.push('/main/post/' + json.id)
          } else {
            alert('Post failed.')
          }
        })
      }
    }
  },
  mounted () {
    if(easyMDE) {
      easyMDE.toTextArea()
    }
    easyMDE = new EasyMDE({ element: this.$el.querySelector('#easymde') })
  }
}
</script>

