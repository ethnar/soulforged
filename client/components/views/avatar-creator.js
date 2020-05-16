import { ServerService } from "../../services/server.js";
import "../game/player-avatar.js";
import "../game/perks.js";
import { ToastNotification } from "../generic/toast-notification.js";

Vue.component("option-selector", {
  props: ["optionName", "options", "value"],

  mounted() {
    this.$emit("input", Math.floor(Math.random() * this.options));
  },

  methods: {
    prev() {
      this.$emit("input", (this.value + this.options - 1) % this.options);
    },

    next() {
      this.$emit("input", (this.value + this.options + 1) % this.options);
    }
  },

  template: `
<div class="option-selector">
    <div class="prev">
        <button @click="prev();">&lt;</button>
    </div>
    <div class="label">{{optionName}}</div>
    <div class="next">
        <button @click="next();">&gt;</button>
    </div>
</div>
    `
});

export const AvatarCreatorView = {
  data: () => ({
    name: "",
    hairColor: 4,
    skinColor: 1,
    hairStyle: 9,
    raceIdx: 0,
    LOOKS: window.LOOKS
  }),

  methods: {
    goToGame() {
      window.location.hash = "/main";
    },

    createAvatar() {
      ServerService.createAvatar(
        this.name,
        {
          hairColor: this.hairColor,
          skinColor: this.skinColor,
          hairStyle: this.hairStyle
        },
        this.selectedPerks,
        this.race
      )
        .then(() => {
          this.goToGame();
        })
        .catch(error => {
          ToastNotification.notify(error);
        });
    },

    updatePerkSelection(selected) {
      this.selectedPerks = selected.map(p => p.perkCode);
    }
  },

  computed: {
    race() {
      return this.races && this.races[this.raceIdx];
    }
  },

  subscriptions() {
    const soulInfoStream = Rx.Observable.fromPromise(
      ServerService.request("getSoulInfo")
    );
    return {
      dead: ServerService.getDeadStream().do(data => {
        if (!data.dead) {
          window.location.hash = "/main";
        }
      }),
      soulLevel: soulInfoStream.pluck("soulLevel"),
      races: soulInfoStream.map(soulInfo => {
        return soulInfo.races;
      })
    };
  },

  template: `
<div class="avatar-creator-wrapper">
    <div class="avatar-creator">
        <div class="avatar">
            <player-avatar
                class="avatar-image"
                :creature="{ race: race }"
                :head-only="true"
                :hair-color="hairColor"
                :skin-color="skinColor"
                :hair-style="hairStyle"
                :mouth="1"
                size="huge"
            />
        </div>
        <div class="character-creator-wrapper">
            <section class="main-header">
                <header>Create new character</header>
            </section>
            <div class="preferences-wrapper">
                <div class="preferences">
                    <div class="name">
                        <span>Name</span>
                        <input name="user" v-model="name" />
                    </div>
                    <section>
                        <header>Appearance</header>
                        <div>
                            <option-selector v-if="races && races.length > 1" v-model="raceIdx" :optionName="'Race: ' + race" :options="races.length" />
                            <option-selector v-model="hairStyle" optionName="Hair style" :options="LOOKS.HAIR_STYLES" />
                            <option-selector v-model="hairColor" optionName="Hair color" :options="LOOKS.HAIR_COLORS" />
                            <option-selector v-model="skinColor" optionName="Skin tone" :options="LOOKS.SKIN_COLORS" />
                        </div>
                    </section>
                </div>
                <div class="preferences" v-if="soulLevel >= 1">
                    <perks @perks-selected="updatePerkSelection" />
                </div>
            </div>
            <div class="centered">
                <button @click="createAvatar()">Confirm</button>
            </div>
            
        </div>
    </div>
</div>
    `
};
