import "../game/dialog-pane-with-logo.js";

export const LoginView = {
  data: () => ({
    user: "",
    password: ""
  }),

  methods: {
    logIn() {
      window.location = "/api/login";
    }
  },

  template: `
<div class="Login">
    <form>
        <dialog-pane-with-logo>
            <p>
                Welcome to Soulforged!<br/>
                Find out more about the game on our
                <a target="_blank" href="https://soulforged.net/pages/#/about">website</a>.
            </p>
            <button @click.prevent="logIn()">Enter the game!</button>
        </dialog-pane-with-logo>
    </form>
</div>
`
};
