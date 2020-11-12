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
