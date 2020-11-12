<template>
  <editor />
</template>

<script>
/*
  Thank github.com/Fubinator for the adaption to Vue 3.0
  See: https://github.com/nhn/tui.editor/issues/1226#issuecomment-709318502
*/

import { onMounted, ref, h } from "vue"
import Editor from "@toast-ui/editor"
import "codemirror/lib/codemirror.css"
import "@toast-ui/editor/dist/toastui-editor.css"

// workaround for now
var globalEditor = null

export default {
  name: 'NewPost',
  props: {
    modelValue: {
      type: String,
      required: false,
      default: ""
    }
  },
  mounted () {
    globalEditor.eventManager.listen('submit', () => {
      var id = Number.parseInt(this.$route.params.id)
      var title = prompt('Please enter a title for the post:')
      if(title && Number.isInteger(id)) {
        fetch(this.apiPath + '/posts', {
          method: 'POST',
          body: JSON.stringify({
            community: id,
            title: title,
            content_markdown: globalEditor.getMarkdown()
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
              this.$router.push('/main/post/' + json.id)
            }
          })
      }
    })
  },
  setup(_, { emit }) {
    const editor = ref()
    
    onMounted(() => {
      var e = new Editor({
        usageStatistics: false,
        el: editor.value,
        height: "500px",
        initialEditType: "markdown",
        previewStyle: "tab",
        events: {
          change: () => emit("update:modelValue", e.getMarkdown())
        }
      })
      const toolbar = e.getUI().getToolbar()
      e.eventManager.addEventType('submit')
      globalEditor = e
      toolbar.insertItem(0, {
        type: 'button',
        options: {
          className: 'mdi mdi-send',
          event: 'submit',
          tooltip: 'Submit the post',
          style: 'color: blue; background: none; padding: 0; border: 1.5px solid; border-radius: 50%;'
        }
      })
    })
    return () => {
      return h("div", { ref: editor })
    }
  }
}
</script>

