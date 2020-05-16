import "../game/dialog-pane-with-logo.js";
import { ToastNotification } from "../generic/toast-notification.js";
import { DataService } from "../../services/data.js";

export const RegisterView = {
  data: () => ({
    accepted: false,
    navigateAway: false
  }),

  subscriptions() {
    return {
      player: DataService.getAcceptedLegalTermsStream().do(
        acceptedLegalTerms => {
          if (acceptedLegalTerms && this.navigateAway) {
            window.location = "#/avatar-creator";
          }
        }
      )
    };
  },

  methods: {
    confirm() {
      if (this.accepted) {
        ServerService.request("acceptLegalTerms").then(() => {
          this.navigateAway = true;
          if (!this.player) {
            window.location = "#/avatar-creator";
          }
        });
      } else {
        ToastNotification.notify(
          "You must accept Terms and Conditions, Privacy Policy & Cookie Policy to proceed"
        );
      }
    }
  },

  template: `
<div class="Register">
    <form>
        <dialog-pane-with-logo>
            <p>
                Welcome to Soulforged!<br/>
                Find out more about the game on our
                <a target="_blank" href="https://soulforged.net/pages/#/about">website</a>.
            </p>
            <label class="agree-text">
                <div>
                    <input type="checkbox" v-model="accepted" />
                </div>
                <div>
                    I agree to the 
                    <a target="_blank" href="https://soulforged.net/pages/#/legal/termsAndConditions">Terms and Conditions</a>, 
                    <a target="_blank" href="https://soulforged.net/pages/#/legal/privacyPolicy">Privacy Policy</a> and 
                    <a target="_blank" href="https://soulforged.net/pages/#/legal/cookiePolicy">Cookie Policy</a>.
                </div>
            </label>
            <button @click.prevent="confirm()">Register</button>
        </dialog-pane-with-logo>
    </form>
</div>
`
};
