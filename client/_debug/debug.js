import "../components/game/item.js";
import "../components/generic/tabs.js";

const itemsMap = {};
const toolsUses = {};
const prereqLevel = {};
const prereqs = {};

const resourceToProduce = Object.values(window.gameData.resources).reduce(
  (acc, i) => ({
    ...acc,
    [i.itemCtr]: i.item
  }),
  {}
);

[...Object.values(window.gameData.items), ...window.gameData.buildings].forEach(
  item => {
    // console.log(item.itemCode, item.materials);
    prereqLevel[item.itemCode] = 1;
    prereqs[item.itemCode] = [];
    itemsMap[item.itemCode] = item;
    Object.keys(item.utility || {}).forEach(util => {
      toolsUses[util] = toolsUses[util] || [];
      toolsUses[util].push(item.itemCode);
    });
  }
);

let counter = 1;
let check;

do {
  check = false;
  Object.keys(prereqLevel).forEach(itemName => {
    prereqs[itemName] = [];
    const item = itemsMap[itemName];
    let lowest = 0;
    if (item.crafting && item.crafting.toolUtility) {
      lowest = toolsUses[item.crafting.toolUtility].reduce(
        (acc, i) => Math.min(acc, prereqLevel[i]),
        Infinity
      );
      prereqs[itemName].push(
        toolsUses[item.crafting.toolUtility].find(
          t => prereqLevel[t] === lowest
        )
      );
    }

    const materials =
      (item.crafting && item.crafting.materials) || item.materials;
    if (materials) {
      lowest = Math.max(
        lowest,
        Object.keys(materials).reduce(
          (acc, i) => Math.max(acc, prereqLevel[i]),
          0
        )
      );
      prereqs[itemName] = prereqs[itemName].concat(Object.keys(materials));
    }

    if (item.research && item.research.materials) {
      lowest = Math.max(
        lowest,
        Object.keys(item.research.materials).reduce(
          (acc, i) => Math.max(acc, prereqLevel[i]),
          0
        )
      );
      prereqs[itemName] = prereqs[itemName].concat(
        Object.keys(item.research.materials)
      );
    }
    lowest += 1;

    if (lowest > prereqLevel[itemName]) {
      prereqLevel[itemName] = lowest;
      check = true;
    }
    if (item.produces) {
      Object.keys(item.produces).forEach(produce => {
        if (prereqLevel[produce] < prereqLevel[itemName] + 1) {
          prereqLevel[produce] = prereqLevel[itemName] + 1;
          check = true;
        }
      });
    }

    // prereqLevel[itemName]
  });
} while (check);

const sortedItemsByLevel = Object.keys(prereqLevel).sort(
  (a, b) => prereqLevel[a] - prereqLevel[b]
);

const craftStep = sortedItemsByLevel
  .map(itemCode => itemsMap[itemCode])
  .filter(item => item.icon);

let remainingPrereqs = Object.keys(prereqs);

const providedByCraftStep = craftStep.map(craftStepItem => {
  const next = remainingPrereqs.filter(item => !prereqs[item].length);
  remainingPrereqs = remainingPrereqs.filter(item => prereqs[item].length);
  remainingPrereqs.forEach(item => {
    // console.log(prereqs[item], craftStepItem.itemCode);
    prereqs[item] = prereqs[item].filter(n => n !== craftStepItem.itemCode);
  });
  return next.map(item => itemsMap[item]).filter(item => item.icon);
});

new Vue({
  el: "#app",
  router: new VueRouter({}),
  data: () => ({
    fightingSkill: 0,
    data: window.gameData,
    resources: window.gameData.resources.filter(r => !!r.name),
    craftStep: craftStep,
    providedByCraftStep: providedByCraftStep,
    url: window.location.toString().replace(/&regionId.*/, ""),
    skillLevels: [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  }),
  computed: {
    armorSlots() {
      const armorSlots = {};
      this.armorsSorted.forEach(i => {
        if (i.slot) {
          armorSlots[i.slot] = true;
        }
      });
      return armorSlots;
    },

    armorsSorted() {
      const max = (acc, i) => Math.max(acc, i);
      const sum = (acc, i) => acc + i;
      const allVals = a => {
        return Object.keys(a.buffs)
          .filter(b => ["slice", "blunt", "pierce"].includes(b))
          .map(k => a.buffs[k]);
      };
      const value = a => {
        const armorVals = allVals(a);
        return (
          (armorVals.reduce(sum, 0) + armorVals.reduce(max, 0) / 2) / a.weight
        );
      };

      return Object.values(window.gameData.items)
        .filter(i => i.buffs)
        .map(i => ({
          ...i,
          armorValue: Math.round(value(i) * 100),
          armorValues: allVals(i),
          slot: Object.keys(i.slots || {}).pop()
        }))
        .filter(i => !!i.armorValue)
        .sort((a, b) => {
          // return a.weight - b.weight;
          return a.armorValue - b.armorValue;
        });
    },

    allWeapons() {
      const max = (acc, i) => Math.max(acc, i);
      const sum = (acc, i) => acc + i;
      const value = a =>
        a.hitChance * Object.values(a.damage).reduce(sum, 0) +
        (a.hitChance * Object.values(a.damage).reduce(max, 0)) / 2;
      return Object.values(this.data.items)
        .filter(item => item.damage)
        .sort((a, b) => {
          return value(a) - value(b);
        })
        .map(i => ({
          ...i,
          damagePrint: Object.values(i.damage).join("/")
        }));
    }
  },
  methods: {
    decimalTwo: Utils.decimalTwo,
    bestWeapons(skill, level) {
      return (
        this.allWeapons
          .filter(w => w.weaponSkillName === skill)
          .sort((a, b) => b.damagePotential[level] - a.damagePotential[level])
          .slice(0, 300) || []
      );
    },
    dataImage(data) {
      return `data:image/png;base64,${data}`;
    },
    getPowerLevel(armor, damage, toHit, fightSkill) {
      if (fightSkill === undefined) {
        fightSkill = this.fightingSkill;
      }
      let missChance = 100 - toHit;
      missChance -= missChance * (fightSkill / 10) * 0.75;
      toHit = 100 - missChance;
      damage = damage * Math.pow(1.22, fightSkill);
      return (Math.round((100 * armor * damage * toHit) / 150) / 100).toFixed(
        2
      );
    },
    formatTime: time => {
      const seconds = time % 60;
      time = Math.floor(time / 60);
      const minutes = time % 60;
      time = Math.floor(time / 60);
      const hours = time % 24;
      time = Math.floor(time / 24);
      const days = time;
      let result = [];
      if (days) result.push(`${days}d`);
      if (hours) result.push(`${hours}h`);
      if (minutes) result.push(`${minutes}m`);
      if (seconds) result.push(`${seconds}s`);
      return result.join(" ");
    },
    getFood(items) {
      const mult = stat => {
        switch (stat) {
          case "pain":
            return -0.1;
          case "nauseous":
            return -1;
          default:
            return 1;
        }
      };
      const vals = i =>
        Object.keys(i.buffs).reduce((acc, k) => acc + i.buffs[k] * mult(k), 0);

      return Object.values(items)
        .filter(item => item.nutrition)
        .sort((a, b) => {
          return vals(a) - vals(b);
        });
    }
  },
  template: `
<div>
    <tabs>
        <tab header="Performance">
            <div>
                Timings:
                <div>Cycle: {{data.timing.cycle}}ms</div>
                <div>Save: {{data.timing.save}}ms</div>
                <div>Sending updates: {{data.timing.sendingUpdates}}ms</div>
                <div>Connected players ({{data.timing.connectedPlayers.length}}): {{data.timing.connectedPlayers.join(', ')}}</div>
                <div>Combined updates (all players): {{data.timing.fullUpdate}}ms</div>
            </div>
        </tab>
    
        <tab header="Regions">
            <table>
                <tr>
                    <td rowspan="2">ID</td>
                    <td rowspan="2">Nodes Count</td>
                    <td rowspan="2">Types</td>
                    <td rowspan="2">Name</td>
                    <td :colspan="resources.length">Resources</td>
                </tr>
                <tr>
                    <td v-for="r in resources"><img class="small item" :src="'data:image/png;base64,' + r.icon"/></td>
                </tr>
                <tr v-for="region in data.regions">
                    <td>{{region.id}}</td>
                    <td>{{region.nodesCount}}</td>
                    <td>{{region.nodesTypes}}</td>
                    <td>{{region.name}}</td>
                    <td v-for="r in resources">
                        <!--{{r.itemCtr}}-->
                        <img class="item small" v-if="resources[r.itemCtr]" :src="'data:image/png;base64,' + r.icon"/>
                    </td>
                </tr>
            </table>
        </tab>
    
        <tab header="Players">
            <table>
                <tr>
                    <td>Name</td>
                    <td>CurrentAction</td>
                    <td>Discord</td>
                    <td>E-mail</td>
                    <td>Quests</td>
                </tr>
                <tr v-for="player in data.players" v-if="player.name && !player.dead">
                    <td>{{player.name}}</td>
                    <td>{{player.currentAction && player.currentAction.actionId}}</td>
                    <td>{{player.discord && player.discord.name}}</td>
                    <td>{{player.email}}</td>
                    <td>{{player.quests.join(', ')}}</td>
                </tr>
            </table>
        </tab>
        
        <tab header="Items">
            <tabs :url="false">
                <tab header="Food">
                    <table>
                        <tr v-for="(item, key) in getFood(data.items)">
                            <td>
                                {{item.order}}
                            </td>
                            <td class="narrow-column">
                                {{item.name}}
                            </td>
                            <td>
                                {{item.weight}}
                            </td>
                            <td class="wrap">
                                <span v-for="(v, stat) in item.buffs">{{stat}}:&nbsp;{{v}}, </span>
                            </td>
                            <td>
                                <img class="item" :src="dataImage(item.icon)">
                            </td>
<!--                            <td>-->
<!--                                <div v-if="item.research" class="icons-row">-->
<!--                                    <item-icon v-for="(qty, mat) in item.research.materials" :key="mat" :src="dataImage(data.items[mat] && data.items[mat].icon)" />-->
<!--                                </div>-->
<!--                            </td>-->
                            <td>
                                <div v-if="item.crafting" class="icons-row">
                                    <item-icon v-for="(qty, mat) in item.crafting.materials" :key="mat" :src="dataImage(data.items[mat] && data.items[mat].icon)" :qty="qty" />
                                </div>
                            </td>
                            <td>
                                {{item.itemCode}}
                            </td>
                            <td>
                                <template v-if="item.crafting">
                                    <div>Time: <b>{{formatTime(item.crafting.baseTime)}}</b></div>
                                    <div>Skill: {{item.craftingSkill}}</div>
                                    <div>Level: {{item.craftingSkillLevel}}</div>
                                    <div v-if="item.crafting && item.crafting.toolUtility">Tool: {{item.crafting.toolUtility}}</div>
                                </template>
                            </td>
                            <td>
                                <div v-for="(value, skill) in item.utility">
                                    {{skill}}: {{value}}
                                </div>
                            </td>
                            <td>
                                {{data.players.filter(p => p.recipes && p.recipes.some(r => r.result && r.result.name === item.name)).map(p => p.name).join(', ')}}
                            </td>
                        </tr>
                    </table>
                </tab>
                                
                <tab header="All">
                    <table>
                        <tr v-for="(item, key) in data.items">
                            <td>
                                {{item.order}}
                            </td>
                            <td class="narrow-column">
                                {{item.name}}
                            </td>
                            <td>
                                {{item.weight}}
                            </td>
                            <td>
                                <img class="item" :src="dataImage(item.icon)">
                            </td>
                            <td>
                                <div v-if="item.research" class="icons-row">
                                    <item-icon v-for="(qty, mat) in item.research.materials" :key="mat" :src="dataImage(data.items[mat] && data.items[mat].icon)" />
                                </div>
                            </td>
                            <td>
                                <div v-if="item.crafting" class="icons-row">
                                    <item-icon v-for="(qty, mat) in item.crafting.materials" :key="mat" :src="dataImage(data.items[mat] && data.items[mat].icon)" :qty="qty" />
                                </div>
                            </td>
                            <td>
                                {{item.itemCode}}
                            </td>
                            <td>
                                <template v-if="item.crafting">
                                    <div>Time: <b>{{formatTime(item.crafting.baseTime)}}</b></div>
                                    <div>Skill: {{item.craftingSkill}}</div>
                                    <div>Level: {{item.craftingSkillLevel}}</div>
                                    <div v-if="item.crafting && item.crafting.toolUtility">Tool: {{item.crafting.toolUtility}}</div>
                                </template>
                            </td>
                            <td>
                                <div v-for="(value, skill) in item.utility">
                                    {{skill}}: {{value}}
                                </div>
                            </td>
                            <td>
                                {{data.players.filter(p => p.recipes && p.recipes.some(r => r.result && r.result.name === item.name)).map(p => p.name).join(', ')}}
                            </td>
                        </tr>
                    </table>
                </tab>
            </tabs>
        </tab>
        
        <tab header="Skills">
            <table>
                <tr>
                    <td></td>
                    <td v-for="(skill, skillKey) in data.skills">{{skill}}</td>
                </tr>
                <tr v-for="level in skillLevels">
                    <td>{{level}}</td>
                    <td v-for="(skill, skillKey) in data.skills">
                        <img v-for="(item, key) in data.items" v-if="item.craftingSkill === skill && Math.floor(item.craftingSkillLevel) === level" class="item" :src="dataImage(item.icon)">
                        <img v-for="resource in resources" class="item" v-if="resource.icon && resource.skillName === skill && Math.floor(resource.skillLevel) === level" :src="'data:image/png;base64,' + resource.icon">
                    </td>
                </tr>
            </table>
            <hr/>
            <img v-for="(item, key) in data.items" v-if="item.crafting && (item.craftingSkill === undefined || item.craftingSkillLevel === undefined)" class="item" :src="dataImage(item.icon)">
            <hr/>
            <img v-for="resource in resources" class="item" v-if="resource.icon && (resource.skillName === undefined || resource.skillLevel === undefined)" :src="'data:image/png;base64,' + resource.icon">
        </tab>
        
        <tab header="Buildings">
            <table>
                <tr v-for="building in data.buildings">
                    <td>
                        <img class="item" :src="'data:image/png;base64,' + building.icon">
                    </td>
                    <td>
                        {{building.name}}
                    </td>
                    <td>
                        <template v-if="building.research">
                            <div v-for="(qty, mat) in building.research.materials">
                                {{mat}}
                            </div>
                        </template>
                    </td>
                    <td>
                        <template v-if="building.materials">
                            <div>Time: {{formatTime(building.baseTime)}}</div>
                            <div>Total: <b>{{formatTime(building.totalTime)}}</b></div>
                        </template>
                    </td>
                    <td>
                        <div class="icons-row">
                            <item-icon v-for="mat in building.materialsFull" :key="mat.details.itemCode" :src="dataImage(mat.details.icon)" :qty="mat.qty" />
                        </div>
                    </td>
                    <td>
                        <div class="icons-row">
                            <item-icon v-for="mat in building.repairMaterials" :key="mat.details.itemCode" :src="dataImage(mat.details.icon)" :qty="mat.qty" />
                        </div>
                    </td>
                    <td>
<!--                        <div v-for="p in building.placementFull">{{p}}</div>-->
                        {{building.placementFull && building.placementFull.join(', ')}}
                    </td>
                    <td>
                        {{data.players.filter(p => p.buildingPlans && p.buildingPlans.some(r => r.name === 'Build ' + building.name)).map(p => p.name).join(', ')}}
                    </td>
                </tr>
            </table>
        </tab>
    
        <tab header="Progress">
            <table class="craft-deps">
                <tr>
                    <td v-for="(item, idx) in craftStep" v-if="!providedByCraftStep[idx + 1] || providedByCraftStep[idx + 1].length">
                        <img class="item" :src="'data:image/png;base64,' + item.icon">
                    </td>
                </tr>
                <tr>
                    <td v-for="(items, idx) in providedByCraftStep" v-if="idx > 0 && items.length">
                        <div v-for="item in items">
                            <img class="item" :src="'data:image/png;base64,' + item.icon">
                        </div>
                    </td>
                </tr>
            </table>
        </tab>
    
        <tab header="Combat">
            <table>
                <tr>
                    <td>
                        Skill
                    </td>
                    <td v-for="l in [0,1,2,3,4,5,6,7,8,9,10]">
                        {{l}}
                    </td>
                </tr>
                <tr v-for="skill in data.skills" v-if="skill.indexOf('Combat') === 0">
                    <td>
                        {{skill}}
                    </td>
                    <td v-for="l in [0,1,2,3,4,5,6,7,8,9,10]">
                        <div v-for="w in bestWeapons(skill, l)">
                            <img class="item" :src="'data:image/png;base64,' + w.icon" />
                            <div>{{decimalTwo(w.damagePotential[l])}}</div>                            
                        </div>
                    </td>
                </tr>
            </table>
            <table>
                <tr>
                    <td v-for="weapon in allWeapons">
                        {{weapon.hitChances}}
                        <img class="item" :src="'data:image/png;base64,' + weapon.icon">
                        <div>D: {{weapon.damagePrint}}</div>
                        <div>H: {{weapon.hitChance}}%</div>
                    </td>
                </tr>
            </table>
            <table v-for="(v, slot) in armorSlots">
                <tr>
                    <td v-for="armor in armorsSorted" v-if="armor.slot == slot">
                        <img class="item" :src="'data:image/png;base64,' + armor.icon">
                        <div>A: {{armor.armorValues.join('/')}}</div>
                        <div>W: {{armor.weight}}kg</div>
                        <div>AW: {{armor.armorValue}}</div>
                    </td>
                </tr>
            </table>
            <!--<table>
                <tr>
                    <td v-for="armor in armorsSorted">
                        {{armor.slot}}
                        <img class="item" :src="'data:image/png;base64,' + armor.icon">
                        <div>A: {{armor.armorValues.join('/')}}</div>
                        <div>W: {{armor.weight}}kg</div>
                        <div>AW: {{armor.armorValue}}</div>
                    </td>
                </tr>
            </table>-->
            <table>
                <tr v-for="monster in data.monsters">
                    <td>
                        <img class="item large" v-if="monster.icon" :src="'data:image/png;base64,' + monster.icon">
                    </td>
                    <td class="text-large"> 
                        {{monster.name}}
                    </td>
                    <td class="number text-large">
                        {{monster.threatLevel}}
                    </td>
                    <td class="number text-large">
                        {{monster.bloodPool}}
                    </td>
                    <td class="number text-large">
                        <div v-for="scouter in monster.scouters">
                            {{scouter.text}}
                            <img class="item" v-if="scouter.icon" :src="'data:image/png;base64,' + scouter.icon">
                        </div>
                    </td>
                </tr>
            </table>
            
            <!--<table>
                <tr v-for="spec in allWeaponsForSkills">
                    <td v-for="weapon in spec.weapons">
                        <img class="item" :src="'data:image/png;base64,' + weapon.icon">
                        <div>D: {{weapon.damage}}</div>
                        <div>H: {{weapon.hitChance}}%</div>
                        <div>PL: {{getPowerLevel(1, weapon.damage, weapon.hitChance, spec.level)}}</div>
                    </td>
                </tr>
            </table>
        
            <select v-model="fightingSkill">
                <option v-for="i in [0,1,2,3,4,5,6,7,8,9,10]" :value="i">{{i}}</option>
            </select>
            <table>
                <tr>
                    <td/>
                    <td v-for="weapon in weapons">
                        <img class="item" :src="'data:image/png;base64,' + weapon.icon">
                        <div>D: {{weapon.damage}}</div>
                        <div>H: {{weapon.hitChance}}%</div>
                    </td>
                </tr>
                <tr v-for="armor in armors">
                    <td>
                        <img class="item" v-if="armor.icon" :src="'data:image/png;base64,' + armor.icon">
                        <div>A: {{armor.armor}}</div>
                    </td>
                    <td v-for="weapon in weapons" v-if="weapon.damage" class="number">
                        {{getPowerLevel(armor.armor, weapon.damage, weapon.hitChance)}}
                    </td>
                </tr>
            </table>-->
        </tab>
    
        <tab header="Resources">
            <table>
                <tr v-for="resource in resources">
                    <td>
                        <img class="item" v-if="resource.icon" :src="'data:image/png;base64,' + resource.icon">
                    </td>
                    <td>
                        {{resource.name}}
                    </td>
                    <td class="number">
                        Skill: {{resource.skillName}}<br/>
                        Skill level: {{resource.skillLevel || 0}}<br/>
                        Time: <b>{{formatTime(resource.baseTime)}}</b>
                    </td>
                </tr>
            </table>
        </tab>
    </tabs>
</div>
    `
});
