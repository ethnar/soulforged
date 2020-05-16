import { ServerService } from "../../../services/server.js";
import { Utils } from "../../generic/utils.js";
import "../creature.js";
import { ContentFrameService } from "../../../services/content-frame.js";
import { DataService } from "../../../services/data.js";

const PROJECTILE_TIME = 45;
const ANIMATION_FREQ = 30;

Vue.component("fighting-screen", {
  data: () => ({
    indicators: [],
    animation: null,
    animationStep: 0,
    animationDisplays: [],
    extraFrames: {
      hostiles: [],
      friendlies: []
    },
    source: null,
    target: null
  }),

  subscriptions() {
    const creaturesStream = ServerService.getNodeStream()
      .pluck("creatures")
      .map(creatures => [...creatures].sort(creaturesSorter));

    return {
      myInventory: DataService.getMyInventoryStream(),
      creatures: creaturesStream,
      friendlies: creaturesStream.map(creatures =>
        creatures.filter(creature => !creature.hostile)
      ),
      hostiles: creaturesStream.map(creatures =>
        creatures.filter(creature => creature.hostile)
      ),
      fightingFeedback: ServerService.getDataStream(
        "fightingFeedback",
        false
      ).do(fightingFeedback => {
        this.queueAnimation(fightingFeedback);
      })
    };
  },

  methods: {
    queueAnimation(details) {
      this.indicators.push(details);
    },

    displayStyle(animation, target, step) {
      const centerTarget = Utils.getDomElementCenter(target);
      if (!centerTarget[0]) {
        return {
          display: "none"
        };
      }
      const change = (step - PROJECTILE_TIME) / (100 - PROJECTILE_TIME);
      return {
        top: `calc(${centerTarget[1]}px - ${2.5 * change}vmin)`,
        left: `calc(${centerTarget[0]}px + ${8 * change}vmin)`
      };
    },

    triggerNextAnimation() {
      this.animation = this.indicators.shift();
      this.animationStep = 0;

      const getTargetEl = ref =>
        this.$refs[ref] &&
        this.$refs[ref][0] &&
        this.$refs[ref][0].$el &&
        this.$refs[ref][0].$el.querySelector(".avatar-icon");

      if (!this.animation) {
        this.extraFrames.hostiles = [];
        this.extraFrames.friendlies = [];
        setTimeout(() => {
          this.triggerNextAnimation();
        }, this.time);
        return;

        // TODO: DEBUG
        // const who = this.creatures[Math.floor(this.creatures.length * Math.random())].id;
        // let whom;
        // do {
        //     whom = this.creatures[Math.floor(this.creatures.length * Math.random())].id;
        // } while (whom === who);
        // this.animation = {
        //     who,
        //     whom,
        //     // miss: true,
        //     // damages: [],
        //     damages: [{"name":"Bruise","icon":"/resources/icons/creatures/yellow_17.png","category":80,"effects":{"Pain":{"value":127}},"order":80,"stacks":127,"duration":{"min":402840,"max":402840},"public":true,"stacked":127},{"name":"Internal damage","icon":"/resources/icons/creatures/red_35.png","category":80,"effects":{"Pain":{"value":4.41},"Internal damage":{"value":22}},"order":80,"stacks":22,"duration":{"min":143640,"max":143640},"severity":3,"public":true,"stacked":22},{"name":"Extreme pain","icon":"/resources/icons/creatures/tooth_t_nobg.png","category":70,"effects":{"Mood":{"value":-150}},"order":70,"duration":{"min":null,"max":null},"severity":4,"public":true,"stacked":1},{"name":"Blood Loss (initial)","icon":"/resources/icons/creatures/red_21_health.png","category":70,"effects":{"Strength":{"value":-3},"Dexterity":{"value":-5}},"order":70,"duration":{"min":null,"max":null},"severity":1,"public":true,"stacked":1}],
        // };
        // TODO: DEBUG
      }

      this.source = getTargetEl(`creature${this.animation.who}`);
      this.target = getTargetEl(`creature${this.animation.whom}`);

      this.extraFrames.hostiles = [];
      this.extraFrames.friendlies = [];

      if (this.source && !Utils.isDomElementDisplayed(this.source)) {
        this.source = null;
        const sourceCreature = this.creatures.find(
          c => c.id === this.animation.who
        );
        this.extraFrames[
          sourceCreature.hostile ? "hostiles" : "friendlies"
        ].push(sourceCreature);
      }
      if (this.target && !Utils.isDomElementDisplayed(this.target)) {
        this.target = null;
        const targetCreature = this.creatures.find(
          c => c.id === this.animation.whom
        );
        this.extraFrames[
          targetCreature.hostile ? "hostiles" : "friendlies"
        ].push(targetCreature);
      }

      this.timeout = setTimeout(() => {
        if (!this.source) {
          this.source = getTargetEl(`creatureExtra${this.animation.who}`);
        }
        if (!this.target) {
          this.target = getTargetEl(`creatureExtra${this.animation.whom}`);
        }

        this.timeout = setTimeout(() => {
          if (this.source && this.target) {
            this.addDamageDisplay();
          }
          this.triggerNextAnimation();
        }, (this.time * PROJECTILE_TIME) / 100);
      });
    },

    addDamageDisplay() {
      this.animationDisplays = [
        ...this.animationDisplays,
        {
          animation: this.animation,
          animationStep: this.animationStep,
          target: this.target,
          style: this.displayStyle(
            this.animation,
            this.target,
            this.animationStep
          )
        }
      ];
    },

    close() {
      ContentFrameService.triggerClosePanel();
    },

    consumables(item) {
      return item.actions.some(action => action.id === "Consume");
    }
  },

  computed: {
    finished() {
      if (!this.hostiles) {
        return false;
      }
      return this.hostiles.every(c => c.dead);
    },

    projectileStyle() {
      if (
        !this.animation ||
        !this.source ||
        !this.target ||
        this.animationStep > PROJECTILE_TIME
      ) {
        return null;
      }
      const centerSource = Utils.getDomElementCenter(this.source);
      const centerTarget = Utils.getDomElementCenter(this.target);

      const step = Math.pow(
        (this.animationStep * 100) / (PROJECTILE_TIME * 10),
        2
      );

      const variance =
        (Math.abs(centerSource[1] - centerTarget[1]) *
          Math.sin((step * Math.PI) / 100)) /
        5;
      const x =
        centerSource[0] * ((100 - step) / 100) +
        centerTarget[0] * (step / 100) +
        variance;
      const y =
        centerSource[1] * ((100 - step) / 100) +
        centerTarget[1] * (step / 100) +
        variance;

      // const x = 100 + Math.abs(this.animationStep - 25) * 25;
      // const y = 400 + 100 * Math.sin(Math.PI * this.animationStep / (12.5 / 2));

      const lastXY = this.lastXY || { x: 0, y: 0 };
      const rotation = -Math.PI / 2 + Math.atan2(y - lastXY.y, x - lastXY.x);

      this.lastXY = { x, y };

      return {
        top: `${y}px`,
        left: `${x}px`,
        transform: `rotate(${rotation}rad) scale(${(100 +
          this.animationStep * 3) /
          200})`,
        opacity: (100 + this.animationStep * 2) / 200
      };
    }
  },

  mounted() {
    this.time = 1500;
    this.timeout = setTimeout(() => this.triggerNextAnimation());
    this.interval = setInterval(() => {
      this.time =
        1500 - Math.min(Math.max(0, this.indicators.length - 6) * 20, 1000);
      const step = (100 * ANIMATION_FREQ) / this.time;
      this.animationStep += step;
      this.animationDisplays = this.animationDisplays
        .filter(object => {
          object.animationStep += step;
          return object.animationStep <= 100;
        })
        .map(display => ({
          ...display,
          style: this.displayStyle(
            display.animation,
            display.target,
            display.animationStep
          )
        }));
    }, ANIMATION_FREQ);
  },

  destroyed() {
    clearTimeout(this.timeout);
    clearInterval(this.interval);
  },

  template: `
<div class="fighting-screen-view">
    <div class="strike-projectile" :style="projectileStyle" v-if="projectileStyle"></div>
    <div class="strike-display" v-for="display in animationDisplays" :style="display.style">
        <div class="label miss" v-if="display.animation.hidden">Hidden</div>
        <div class="label miss" v-else-if="display.animation.dodge">Dodge</div>
        <div class="label miss" v-else-if="display.animation.fleeMiss">Fleeing</div>
        <div class="label miss" v-else-if="display.animation.miss">Miss</div>
        <div class="label deflect" v-else-if="display.animation.damages && !display.animation.damages.length">
            <div class="extra-text" v-if="display.animation.graze">
                {{display.animation.graze ? 'Graze' : 'Hit'}}
            </div>
            Deflect
        </div>
        <div
            class="label hit"
            :class="{ graze: display.animation.graze }"
            v-else-if="display.animation.damages && display.animation.damages.length"
        >
            <div class="extra-text">{{display.animation.graze ? 'Graze' : 'Hit'}}</div>
            <div class="damages">
                <div v-for="effect in display.animation.damages">
                    <item-icon size="tiny" :src="effect.icon" :qty="effect.stacks" />
                </div>
            </div>
        </div>
        <div class="label miss" v-else>
            ???
        </div>
    </div>
    <div class="victory" v-if="finished" @click="close()">
        <div class="banner">
            <div class="label">Victory!</div>
        </div>
        <div class="overlay"></div>
    </div>
    <div class="main-display">
        <div class="creature-frames">
            <section>
                <header>Friendlies</header>
                <div v-if="creatures && !creatures.length" class="empty-list"></div>
                <div class="creature-list">
                    <creature-list-item
                        v-for="creature in friendlies"
                        :ref="'creature' + creature.id"
                        :creature="creature"
                        :key="creature.id">
                    </creature-list-item>
                </div>
                <div class="extra" v-if="extraFrames.friendlies.length">
                    <creature-list-item
                        v-for="creature in extraFrames.friendlies"
                        :ref="'creatureExtra' + creature.id"
                        :creature="creature"
                        :key="creature.id">
                    </creature-list-item>
                </div>
            </section>
            <section>
                <header>Hostiles</header>
                <div v-if="creatures && !creatures.length" class="empty-list"></div>
                <div class="creature-list">
                    <creature-list-item
                        v-for="creature in hostiles"
                        :ref="'creature' + creature.id"
                        :creature="creature"
                        :key="creature.id">
                    </creature-list-item>
                </div>
                <div class="extra" v-if="extraFrames.hostiles.length">
                    <creature-list-item
                        v-for="creature in extraFrames.hostiles"
                        :ref="'creatureExtra' + creature.id"
                        :creature="creature"
                        :key="creature.id">
                    </creature-list-item>
                </div>
            </section>
        </div>
        <div class="quick-actions">
            <equipment-selector equipment-slot="Weapon" class="tool-selector" />
            <div class="scrollable">
                <inventory v-if="myInventory" :data="myInventory.items" type="player" :filter="consumables" />
            </div>
        </div>    
    </div>
</div>
    `
});
