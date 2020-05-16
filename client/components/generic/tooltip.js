Vue.component("tooltip", {
  props: ["title"],

  template: `
<a class="tooltip">
    <slot></slot>
    <div class="tooltip-text">{{title}}</div>
</a>
    `
});
