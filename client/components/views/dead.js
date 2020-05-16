import { ServerService } from "../../services/server.js";

export const DeadView = {
  subscriptions() {
    return {
      dead: ServerService.getDeadStream()
        .do(data => {
          if (!data.dead) {
            window.location.hash = "/main";
          }
        })
        .map(
          data =>
            console.log(data) || {
              ...data,
              reasonShort: (data.reason || "").replace("You died", "")
            }
        )
    };
  },

  methods: {
    continueAfterDeath() {
      this.$router.push(`avatar-creator`);
      console.log("reload2");
      window.location.reload();
    }
  },

  template: `
<div class="dead-frame">
    <div class="dead-text-wrapper">
        <div class="dead-text">
            <div class="you-died">You died</div>
            <div class="reason" v-if="dead">
                {{dead.reasonShort}}
            </div>
            <button @click="continueAfterDeath()">Continue</button>
        </div>
    </div>
</div>
    `
};
