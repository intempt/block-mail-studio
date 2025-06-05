import Vue from 'vue';
import App from './App.vue';
import { createPinia, PiniaVuePlugin } from 'pinia';

Vue.use(PiniaVuePlugin);

const pinia = createPinia();

new Vue({
  pinia,
  render: (h) => h(App)
}).$mount('#app');


// "@tiptap-pro/extension-ai": "^2.17.5",
//     "@tiptap-pro/extension-details": "^2.17.5",
//     "@tiptap-pro/extension-details-content": "^2.17.5",
//     "@tiptap-pro/extension-details-summary": "^2.17.5",
//     "@tiptap-pro/extension-drag-handle": "^2.17.5",
//     "@tiptap-pro/extension-drag-handle-vue-2": "^2.16.5-beta.0",
//     "@tiptap-pro/extension-node-range": "^2.17.5",
//     "@tiptap/core": "^2.11.5",
//     "@tiptap/extension-bubble-menu": "^2.11.5",
//     "@tiptap/extension-collaboration": "^2.11.5",
//     "@tiptap/extension-collaboration-cursor": "^2.11.5",
//     "@tiptap/extension-color": "^2.11.5",
//     "@tiptap/extension-font-family": "^2.11.5",
//     "@tiptap/extension-gapcursor": "^2.11.5",
//     "@tiptap/extension-highlight": "^2.11.5",
//     "@tiptap/extension-image": "^2.11.5",
//     "@tiptap/extension-link": "^2.11.5",
//     "@tiptap/extension-placeholder": "^2.11.5",
//     "@tiptap/extension-subscript": "^2.11.5",
//     "@tiptap/extension-superscript": "^2.11.5",
//     "@tiptap/extension-table": "^2.11.5",
//     "@tiptap/extension-table-cell": "^2.11.5",
//     "@tiptap/extension-table-header": "^2.11.5",
//     "@tiptap/extension-table-row": "^2.11.5",
//     "@tiptap/extension-task-item": "^2.11.5",
//     "@tiptap/extension-task-list": "^2.11.5",
//     "@tiptap/extension-text": "^2.11.5",
//     "@tiptap/extension-text-align": "^2.11.5",
//     "@tiptap/extension-text-style": "^2.11.5",
//     "@tiptap/extension-underline": "^2.11.5",
//     "@tiptap/pm": "^2.11.5",
//     "@tiptap/starter-kit": "^2.11.5",
//     "@tiptap/suggestion": "^2.11.5",
//     "@tiptap/vue-2": "^2.11.5",
