import "./equipment-selector.js";
import { ServerService } from "../../services/server.js";

Vue.component("tool-selector", {
  template: `
<equipment-selector equipment-slot="Tool" class="tool-selector" />
`
});
