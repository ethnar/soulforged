import "./quest-notification.js";
import "./node-events.js";

Vue.component("secondary-status", {
  template: `
<div class="secondary-status">
    <tutorial-trigger />
    <quest-notification />
    <node-events />
</div>
    `
});
