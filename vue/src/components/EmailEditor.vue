<template>
  <div class="email-editor">
    <h2>Email Editor</h2>
    <textarea v-model="content" class="editor-input" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'EmailEditor',
  setup() {
    const content = ref('');
    return { content };
  }
});
</script>

<style scoped>
.email-editor {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.editor-input {
  min-height: 200px;
  padding: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
}
</style>
