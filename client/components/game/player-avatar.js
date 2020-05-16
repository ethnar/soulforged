Vue.component("player-avatar", {
  props: {
    hairColor: false,
    skinColor: false,
    hairColorGrayness: 0,
    hairStyle: false,
    headOnly: false,
    size: {
      default: "normal"
    },
    creature: null
  },

  data: () => ({
    dead: false,
    sleeping: false,
    snoring: null,
    tired: false,
    blinking: false,
    happy: false,
    slightlySad: false,
    sad: false,
    verySad: false,
    gloomy: false,
    feelingPain: 0
  }),

  computed: {
    eyesState() {
      if (this.dead) {
        return "dead";
      }

      if (this.sleeping) {
        return "eyes_closed_2";
      }

      if (this.feelingPain >= 3) {
        return "eyes_closed_3";
      }
      if (this.feelingPain >= 1) {
        return "eyes_closed_1";
      }

      if (this.blinking) {
        return "eyes_closed_1";
      }
      if (this.tired) {
        return "eyes_3";
      }
      return "eyes_1";
    },

    mouthStatePrefix() {
      switch (this.creature.race) {
        case "Orc":
          return "fangs/";
        default:
          return "";
      }
    },

    mouthState() {
      if (this.dead) {
        return "tongue_out";
      }

      if (this.sleeping) {
        if (this.snoring === 1) {
          return "closed_1";
        }
        if (this.snoring === 0) {
          return "open_3";
        }
      }

      if (this.feelingPain >= 3) {
        return "pain_4";
      }
      if (this.feelingPain >= 1) {
        return "pain_1";
      }

      if (this.happy) return "smiling_wide_2";
      if (this.slightlySad) return "neutral";
      if (this.sad) return "sad_1";
      if (this.verySad) return "sad_2";
      if (this.gloomy) return "sad_3";
      return "smiling_low";
    },

    animations() {
      (this.animationsTimeouts || []).forEach(ai => clearInterval(ai));
      this.animationsTimeouts = [];

      if (this.creature) {
        if (this.creature.dead) {
          this.dead = true;
          return;
        }
        const smiling = {
          // Glad: true,
          // Happy: true,
          Cheerful: true,
          Overjoyed: true,
          Ecstatic: true
        };

        this.happy = this.hasBuff(b => smiling[b.name]);
        this.slightlySad = this.hasBuff("Slightly Sad");
        this.sad = this.hasBuff("Sad");
        this.verySad = this.hasBuff("Very Sad");
        this.gloomy = this.hasBuff("Gloomy");

        this.tired = this.hasBuff("Very Tired") || this.hasBuff("Exhausted");

        this.sleeping = this.isAction("Sleep");
        if (this.sleeping) {
          this.snoring = 0;
          this.repeatingAnimation(
            () => (this.snoring = 1),
            () => (this.snoring = 0),
            () => 1000 + Math.random() * 300,
            () => 1000 + Math.random() * 300
          );
        }

        const painDegree =
          (this.hasBuff("Minor pain") && 1) ||
          (this.hasBuff("Pain") && 2) ||
          (this.hasBuff("Major pain") && 3) ||
          (this.hasBuff("Extreme pain") && 4);

        this.feelingPain = 0;
        this.repeatingAnimation(
          () => (this.feelingPain = painDegree),
          () => (this.feelingPain = 0),
          () => 12000 / painDegree + Math.random() * 2000,
          () => 4000 / (5 - painDegree) + Math.random() * 500
        );

        this.blinking = false;
        this.repeatingAnimation(
          () => (this.blinking = true),
          () => (this.blinking = false),
          () => 3000 + Math.random() * 1000,
          () => 300 + Math.random() * 200
        );
      }

      return "idle";
    },

    hairColorClass() {
      return `hair-color hair-color-${this.hairColor % LOOKS.HAIR_COLORS}-${this
        .hairColorGrayness || 0}`;
    },

    skinColorClass() {
      return `skin-color skin-color-${this.skinColor % LOOKS.SKIN_COLORS}`;
    },

    hairStyleClass() {
      return `hair-style-${this.hairStyle % LOOKS.HAIR_STYLES}`;
    },

    eyebrows() {
      return this.creature && this.creature.race === "Elf" ? "eyebrows2/" : "";
    }

    // 15, 16, 33?, 51
  },

  methods: {
    repeatingAnimation(
      applyCallback,
      unapply,
      delayGenerator,
      durationGenerator
    ) {
      const timeout = setTimeout(() => {
        applyCallback();
        const idx = this.animationsTimeouts.indexOf(timeout);
        if (idx !== -1) {
          this.animationsTimeouts.splice(idx, 1);
        }
        this.repeatingAnimation(
          unapply,
          applyCallback,
          durationGenerator,
          delayGenerator
        );
      }, delayGenerator());

      this.animationsTimeouts.push(timeout);
    },

    isAction(name) {
      return (
        this.creature.currentAction &&
        this.creature.currentAction.actionId === name
      );
    },

    hasBuff(nameOrCallback) {
      let filter = nameOrCallback;
      if (typeof nameOrCallback !== "function") {
        filter = b => b.name.toLowerCase() === nameOrCallback.toLowerCase();
      }
      return this.creature.buffs && this.creature.buffs.some(filter);
    }
  },

  template: `
<div class="player-avatar" :class="[{ 'head-only': headOnly }, animations, size, creature.race]">
    <div class="avatar-body-wrapper">
        <div class="body">
            <div class="arm-anchor left">
                <div class="forearm" :class="skinColorClass"></div>
                <div class="hand" :class="skinColorClass"></div>
                <div class="fingers" :class="skinColorClass"></div>
            </div>
            <div class="leg-anchor left">
                <div class="hip" :class="skinColorClass"></div>
                <div class="foot" :class="skinColorClass"></div>
            </div>
            <div class="torso" :class="skinColorClass"></div>
            <div class="head-anchor">
                <div class="face" :class="skinColorClass"></div>
                <div class="eyes" :class="hairColorClass" :style="{ 'background-image': 'url(../images/avatars/body_parts/eyes_2/' + eyebrows + eyesState + '_brows.png)'}"></div>
                <div class="eyes" :style="{ 'background-image': 'url(../images/avatars/body_parts/eyes_2/' + eyebrows + eyesState + '_eyes.png)'}"></div>
                <div class="hair" :class="[hairColorClass, hairStyleClass]"></div>
                <div class="mouth" :style="{ 'background-image': 'url(../images/avatars/body_parts/mouth/' + mouthStatePrefix + mouthState + '.png)'}"></div>
                <div class="ear" :class="skinColorClass"></div>
            </div>
            <div class="leg-anchor right">
                <div class="hip" :class="skinColorClass"></div>
                <div class="foot" :class="skinColorClass"></div>
            </div>
            <div class="arm-anchor right">
                <div class="forearm" :class="skinColorClass"></div>
                <div class="hand" :class="skinColorClass"></div>
            </div>
        </div>
    </div>
</div>
    `
});
