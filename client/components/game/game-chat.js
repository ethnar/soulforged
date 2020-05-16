import { ServerService } from "../../services/server.js";
import { ContentFrameService } from "../../services/content-frame.js";

const leftPad = n => (`${n}`.length === 2 ? n : `0${n}`);

Vue.component("game-chat", {
  props: ["persistent"],

  data: () => ({
    message: "",
    messages: [],
    colorCache: {},
    timeCutoff: 0,
    timeCutoffPermanent: 0
  }),

  created() {
    this.focusTimeouts = [];

    this.timeCutoff = +localStorage.getItem("chat-notification-cutoff") || 0;
    this.timeCutoffPermanent = this.timeCutoff;
    window.addEventListener("focus", this.onFocus.bind(this), false);
    window.addEventListener("blur", this.cancelCutoffs.bind(this), false);
  },

  destroyed() {
    window.removeEventListener("focus", this.onFocus.bind(this), false);
    window.removeEventListener("blur", this.cancelCutoffs.bind(this), false);
  },

  subscriptions() {
    return {
      isDungeon: ServerService.getIsDungeonStream(),
      reset: ServerService.getResetStream().do(() => {
        this.messages = [];
        this.sending = false;
        this.initialLoad();
      }),
      newMessages: ServerService.getChatMessageStream().do(data => {
        this.messages = [data, ...this.messages];
        if (this.focused) {
          this.updateLatestSeen();
        }
      })
    };
  },

  methods: {
    scheduleCutoff(targetCutoff, inTime = 5000) {
      const timeout = setTimeout(() => {
        this.timeCutoff = Math.max(this.timeCutoff, targetCutoff);
        localStorage.setItem("chat-notification-cutoff", this.timeCutoff);
        const idx = this.focusTimeouts.indexOf(timeout);
        if (idx !== -1) {
          this.focusTimeouts.splice(idx, 1);
        }
      }, inTime);
      const timeoutPermanent = setTimeout(() => {
        this.timeCutoffPermanent = Math.max(
          this.timeCutoffPermanent,
          targetCutoff
        );
        const idx = this.focusTimeouts.indexOf(timeoutPermanent);
        if (idx !== -1) {
          this.focusTimeouts.splice(idx, 1);
        }
      }, inTime + 1100);
      this.focusTimeouts.push(timeout);
      this.focusTimeouts.push(timeoutPermanent);
    },

    onFocus() {
      this.focused = true;
      this.updateLatestSeen();
    },

    cancelCutoffs() {
      this.focused = false;
      this.focusTimeouts.forEach(timeout => clearTimeout(timeout));
      this.focusTimeouts = [];
    },

    scrollToBottom() {
      setTimeout(() => {
        if (this.$refs.messagesContainer) {
          this.$refs.messagesContainer.scrollTop = 900000;
        }
      });
    },

    initialLoad() {
      return ServerService.request("get-chat-messages").then(messages => {
        this.messages = [...messages, ...this.messages].reverse();
        this.messages.sort((a, b) => {
          return b.when - a.when;
        });
        this.updateLatestSeen();
      });
    },

    formatTime(milliseconds) {
      const shift = new Date().getTimezoneOffset() * 60 * 1000;
      const localMilliseconds = milliseconds - shift;
      const s = Math.floor(localMilliseconds / 1000) % 60;
      const m = Math.floor(localMilliseconds / 60000) % 60;
      const h = Math.floor(localMilliseconds / 3600000) % 24;
      return `${h}:${leftPad(m)}:${leftPad(s)}`;
    },

    updateLatestSeen(delay) {
      if (isNaN(delay)) {
        delay = this.isDungeon ? 4000 : 10000;
      }
      this.scheduleCutoff(
        (this.messages && this.messages[0] && this.messages[0].when) || 0,
        delay
      );
      this.scrollToBottom();
    },

    getPlayerColor(name) {
      if (!this.colorCache[name]) {
        this.colorCache[name] =
          (name || "")
            .toLowerCase()
            .split("")
            .reduce((acc, l) => acc + acc + l.charCodeAt(0), 0) % 360;
      }
      return this.colorCache[name];
    },

    onClick() {
      if (!this.persistent) {
        this.updateLatestSeen(0);
        ContentFrameService.triggerShowPanel("log");
      }
    }
  },

  computed: {
    sortedMessages() {
      if (this.persistent) {
        return [...this.messages].reverse();
      }
      return this.messages;
    }
  },

  template: `
<div class="game-chat" :class="{ persistent: persistent }">
    <div class="messages-container" ref="messagesContainer" @click="onClick()">
        <div v-for="message in sortedMessages" class="message-line" :class="{ visible: persistent || (message.when > timeCutoff), gone: !persistent && (message.when <= timeCutoffPermanent) }">  
            <span class="timestamp">[{{formatTime(message.when)}}]</span> <span class="author" v-show="message.who" :style="{ filter: 'hue-rotate(' + getPlayerColor(message.who) + 'deg) saturate(' + (getPlayerColor(message.who) % 5 + 1) + ')' }">{{message.who}}:</span> <span class="message-text" :class="[{ anon: !message.who }, 'level-' + message.level]" v-html="message.message"></span>
        </div>
    </div>
</div>
`
});
