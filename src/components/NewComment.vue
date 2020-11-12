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
  <w-textarea v-model:model-value="comment">Comment</w-textarea>
  <w-button @click="post" bg-color="info" class="mt3">Submit</w-button>
</template>

<script>
export default {
  name: 'NewComment',
  data () {
    return {
      comment: ''
    }
  },
  methods: {
    post () {
      var id = Number.parseInt(this.$route.params.id)
      if(!Number.isInteger(id)) {
        return
      }
      fetch(this.apiPath + '/posts/' + id + '/replies', {
        method: 'POST',
        body: JSON.stringify({
          content_text: this.comment
        }),
        headers: {
            Authorization: 'Bearer ' + window.localStorage.getItem('token')
          }
        })
          .then((response) => {
            if(response.status === 200) {
              return response.json()
            } else {
              alert('Server returned ' + response.status)
            }
          })
          .then((json) => {
            if(json) {
              this.$emit('posted')
            }
          })
    }
  }
}
</script>
