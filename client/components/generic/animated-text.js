Vue.component("animated-text", {
  props: ["text", "mysteryFont"],

  data: () => ({
    clicked: false
  }),

  computed: {
    splitText() {
      if (!this.text) {
        return "";
      }
      let delay = 0;
      return this.text.replace(/(>|^)[^<>]+(<|$)/g, match => {
        let isWord = false;
        let result = match.replace(/([^<>])/g, (letter, _, offset, ...rest) => {
          let pre = "";
          let post = "";
          const isWordTerminating = letter.match(/[^a-zA-Z]/);
          if (!isWordTerminating && !isWord) pre = '<span class="word">';
          if (isWordTerminating && isWord) pre = "</span>";
          if (isWord && offset === match.length - 1) post = "</span>";
          isWord = !isWordTerminating;
          delay = delay + 0.03;
          return `${pre}<span style="animation-delay: ${delay.toFixed(
            2
          )}s">${letter}</span>${post}`;
        });
        if (isWord) {
          result = result.replace(/(<)?$/, "</span>$1");
        }
        return result;
      });
    }
  },

  methods: {
    onClick() {
      this.clicked = true;
    }
  },

  template: `
<div class="plot-text-wrapper" @click="onClick" :class="{ 'show-all': clicked }">
    <slot></slot>
    <div class="plot-text" v-html="splitText" :class="mysteryFont"></div>
</div>
    `
});
