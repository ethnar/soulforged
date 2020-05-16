import { ServerService } from "../../../services/server.js";
import "../perks.js";
import "../info-helper.js";
import { DataService } from "../../../services/data.js";

// const skillLevels = {
//     0: 'Dabbling',
//     1: 'Novice',
//     2: 'Competent',
//     3: 'Proficient',
//     4: 'Professional',
//     5: 'Accomplished',
//     6: 'Expert',
//     7: 'Master',
//     8: 'High Master',
//     9: 'Grand Master',
//     10: 'Legendary',
// };

Vue.component("decimal-secondary", {
  props: {
    value: 0,
    decimals: {
      default: 2
    }
  },

  computed: {
    main() {
      return Math.floor(this.value);
    },

    secondary() {
      return this.value
        .toString()
        .replace(/[^.]+/, "")
        .substr(0, this.decimals + 1);
    }
  },

  template: `
<span class="decimal-secondary">
    <span class="decimal-secondary-main">{{main}}</span><span class="decimal-secondary-decimal">{{secondary}}</span>
</span>
    `
});

Vue.component("player-stats", {
  data: () => ({
    detailed: false
  }),

  subscriptions() {
    return {
      playerInfo: DataService.getPlayerInfoStream(),
      effectsSummarySimple: DataService.getEffectsSummaryStream()
        .map(effectsSummary => {
          return Object.keys(effectsSummary).toObject(
            key => key,
            key => effectsSummary[key].value
          );
        })
        .startWith({})
    };
  },

  methods: {
    abs: Math.abs.bind(Math),

    skillWidth(skill) {
      return this.fractionPercentage(skill.level);
    },

    missingWidth(skill) {
      return Math.min(-skill.buffed * 100, 100 - this.skillWidth(skill));
    },

    buffedWidth(skill) {
      return (100 * skill.buffed * 100) / this.skillWidth(skill);
    },

    skillLevel(value) {
      const level = Math.floor(value);
      return level === 10 ? "L" : level;
    },

    fractionPercentage(value) {
      return (value - Math.floor(value)) * 100 || 0;
    },

    roundStat(value) {
      return Math.round(value * 100) / 100;
    }
  },

  template: `
<div v-if="playerInfo">
    <section class="item-properties">
        <header>Statistics</header>
        Age: <span class="value">{{playerInfo.age}}</span>
        <div
            v-for="(value, stat) in playerInfo.stats"
            class="player-stat"
            :class="{ breakdown: detailed }"
        >
            <span @click="detailed = !detailed" class="click-wrapper">
                <span>{{stat}}:</span> 
                <span class="value">
                    <span v-if="detailed" class="numbers">
                        <decimal-secondary :value="roundStat(value - (effectsSummarySimple[stat] || 0))" />
                        <div class="symbol">{{effectsSummarySimple[stat] >= 0 ? '+' : '-'}}</div>
                        <decimal-secondary :value="abs(effectsSummarySimple[stat] || 0)" />
                        <div class="symbol">=</div>
                    </span>
                    <decimal-secondary :value="value" />
                </span>
            </span>
            <info-helper info="statDescription" :params="stat" />
        </div>
    </section>
    <section>
        <header>Skills</header>
<!--        <div class="skill-indicator" v-if="soulLevel > 0">-->
<!--            <div class="skill-level" :class="'skill-level-' + soulLevelFull">{{soulLevelFull}}</div>-->
<!--            <div class="skill-name">Soul Level</div>-->
<!--            <div class="skill-meter">-->
<!--                <div class="background"></div>-->
<!--                <div-->
<!--                    class="meter-clip"-->
<!--                    :style="{ width: (skillProgress(soulLevel) || 0) + '%' }"-->
<!--                >-->
<!--                    <div class="meter-bar blue"></div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->

        <div v-for="skill in playerInfo.skills" class="skill-indicator" :class="{ 'max-level': skill.maxLevel }">
            <div class="skill-level" :class="'skill-level-' + skillLevel(Math.max(skill.level, 0))">{{skillLevel(skill.level)}}</div>
            <div class="skill-name">{{skill.name}}</div>
            <info-helper info="skillDescription" :params="skill.id" />
            <div class="skill-meter" v-if="!skill.maxLevel">
                <div class="background"></div>
                <div
                    class="meter-clip"
                    :style="{ width: skillWidth(skill) + '%' }"
                >
                    <div class="meter-bar" :style="{ 'background-size': (1000 / skillWidth(skill)) + '% 100%' }"></div>
                    <div
                        v-if="skill.buffed > 0"
                        class="meter-clip-highlight"
                        :style="{ width: buffedWidth(skill) + '%' }"
                    >
                    </div>
                </div>
                <div
                    v-if="skill.buffed < 0"
                    class="meter-clip-missing"
                    :style="{ left: skillWidth(skill) + '%', width: missingWidth(skill) + '%' }"
                >
                </div>
            </div>
        </div>
    </section>
</div>
    `
});
