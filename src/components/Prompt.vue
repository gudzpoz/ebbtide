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
  <w-overlay @close="this.$emit('cancel')" :model-value="true">
    <w-card :title="title" title-class="blue-light5--bg" bg-color="white">
      <template #actions>
        <w-flex class="justify-space-evenly">
          <w-button bg-color="success" @click="$emit('confirm')">Confirm</w-button>
          <w-button bg-color="error" class="mr2" @click="$emit('cancel')">Cancel</w-button>
        </w-flex>
      </template>
    </w-card>
  </w-overlay>
</template>

<script>
export default {
  name: 'Prompt',
  emits: ['cancel', 'confirm'],
  data () {
    return {
    }
  },
  props: {
    title: String
  }
}
</script>
