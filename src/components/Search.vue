<template>
<w-button @click="search">Search!</w-button>
<w-input type="text" v-model:model-value="key" class="mb3">Look up a User or a Community</w-input>
<div>{{ error }}</div>
<h4 v-show="results.length">Possible results:</h4>
<ul>
  <li v-for="item in results" :key="item.id"><router-link :to="getLink(item.type, item.id)"><w-tag class="mr2">{{ item.type }}</w-tag>{{ item.name }}</router-link></li>
</ul>
</template>

<script>
export default {
  name: 'Search',
  emits: ['title'],
  data () {
    return {
      key: '',
      error: '',
      results: [],
    }
  },
  methods: {
    getLink (type, id) {
      if(type === 'community') {
        return '/main/community/' + id
      } else if(type === 'user') {
        return '/main/user/' + id
      } else {
        return ''
      }
    },
    search () {
      this.error = ''
      this.$lotide.lookup(this.key).then((json) => {
        if(json) {
          this.results = json
          for(var i in json) {
            json[i].name = ''
            var wrap = (i) => {
              this.$lotide.getName(json[i].type, json[i].id).then((name) => {
                if(name) {
                  this.results[i].name = name
                }
              })
            }
            wrap(i)
          }
        } else {
          this.error = 'Not Found'
        }
      })
    }
  },
  created () {
    this.$emit('title', 'Search')
  }
}
</script>
