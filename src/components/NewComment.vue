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
