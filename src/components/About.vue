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
<w-icon xl size="4em" bg-color="white" color="info" class="mb4">mdi mdi-server</w-icon>
<h3>Server Info</h3>
<div v-if="info">
  <div>{{ info.description }}</div>
  <br>
  <div>
    {{ 'The server is running on ' + info.software.name + ' ' + info.software.version }}
  </div>
</div>
<br class="my6">
<w-icon xl size="4em" bg-color="info" color="white" class="mb4">mdi mdi-hydro-power</w-icon>
<h3>Ebbtide</h3>
A frontend for <a href="https://git.sr.ht/~vpzom/lotide">lotide</a>.
<br>
Licensed under the <a href="https://www.gnu.org/licenses/agpl-3.0.txt">GNU Affero General Public License</a>. You can find the source code here: <a href="https://gitlab.com/gudzpoz/ebbtide">ebbtide</a>.
</template>

<script>
export default {
  name: 'About',
  emits: ['title'],
  data () {
    return {
      info: null
    }
  },
  created () {
    this.$emit('title', 'About')
    this.$lotide.getInstanceInfo().then((json) => {
      console.log(json)
      if(json) {
        this.info = json
        this.hasInfo = true
      }
    })
  }
}
</script>

<style scoped>
a {
    text-decoration: underline;
}
</style>
