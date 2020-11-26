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
  <w-input v-model="title" class="title1" required>Enter the title of the post</w-input>
  <w-button @click="submit" class="my3 mr3">
    <w-icon class="mr2">mdi mdi-send</w-icon>
    Send!
  </w-button>
  <input id="file" type="file" />
  <w-transition-expand y>
    <w-alert v-if="uploading" color="info">
      Uploading the file...
    </w-alert>
    <w-alert v-if="failed" color="error">
      Upload Failed.
    </w-alert>
  </w-transition-expand>
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
      uploading: false,
      failed: true,
      title: ''
    }
  },
  methods: {
    post (id) {      
      this.$lotide.postPost(this.title, easyMDE.value(), id, true, this.href).then((json) => {
        if(json) {
          this.$router.push('/main/post/' + json.id)
        } else {
          alert('Post failed.')
        }
      })
    },
    submit () {
      var id = Number.parseInt(this.$route.params.id)
      var input = this.$el.querySelector('#file')
      console.log(input)
      if(this.title && Number.isInteger(id)) {
        if(input.files.length) {
          this.uploading = true
          this.$lotide.uploadImage(input.files[0]).then((mediaId) => {
            this.uploading = false
            if(id) {
              console.log(id)
              this.href = 'local-media://' + mediaId
              this.post(id)
            } else {
              this.failed = true
              setTimeout(() => { this.failed = false }, 2000)
            }
          })
        } else {
          this.href = null
          this.post(id)
        }
        /*  */
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

