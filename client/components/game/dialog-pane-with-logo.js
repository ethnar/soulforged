Vue.component("dialog-pane-with-logo", {
  data: () => ({
    legalText: window.LEGAL_HTML
  }),

  template: `
<div class="dialog-pane-with-logo">
    <div class="main-container-logo">
        <div class="heading">
            <header>Soulforged</header>
            <div class="logo"></div>
        </div>
        <slot></slot>
        <br/>
        <div class="legal" v-html="legalText"></div>
    </div>
</div>
`
});
