<template>
<w-spinner v-if="items.length === 0" />
<w-list :items="items" nav class="align-start" @item-select="itemSelect">
  <template #item="{ item }">
    <span class="title3">{{ item.label }}</span>
    <div class="caption ml5">{{ item.host }}</div>
  </template>
</w-list>
</template>

<script>
export default {
  name: 'Communities',
  data () {
    return { items: [] }
  },
  methods: {
    itemSelect (element) {
      this.$emit('title', element.label)
    }
  },
  created () {
    fetch(this.apiPath + '/communities').
      then((response) => {
        return response.json()
      }).
      then((json) => {
        var communities = [];
        for(var item of json) {
          communities.push({
            label: item.name,
            host: item.host,
            route: '/main/community/' + item.id
          })
        }
        this.items = communities
      })
  },
  mounted () {
    this.$emit('title', 'Communities')
  },
  props: {
    msg: String
  }
}
</script>

<style scoped>

</style>
