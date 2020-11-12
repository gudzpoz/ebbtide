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
  data () {
    return {
    }
  },
  props: {
    title: String
  }
}
</script>
