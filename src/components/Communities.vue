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
  emits: ['title'],
  data () {
    return { items: [] }
  },
  methods: {
    itemSelect (element) {
      this.$emit('title', element.label)
    }
  },
  created () {
    this.$lotide.getCommunities().then((json) => {
      if(json) {
        var communities = [];
        for(var item of json) {
          communities.push({
            label: item.name,
            host: item.host,
            route: '/main/community/' + item.id
          })
        }
        this.items = communities
      }
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
