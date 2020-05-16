Vue.component("toggle-filter-button", {
  props: ["value"],

  data: () => ({
    on: false
  }),

  template: `
<div class="toggle-filter-button interactable" @click="on = !on;$emit('input', on)">
    <div class="icon">
    </div>
</div>
    `
});
