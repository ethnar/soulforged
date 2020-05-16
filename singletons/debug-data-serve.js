const fs = require("fs");

utils.registerClusterHandler(global.httpServerFork, "debug-data", () => {
  if (!program.dev) {
    return;
  }

  const dummyCreature = {
    getPlayer: () => ({})
  };

  const itemSorter = (a, b) => {
    if (!!a.weight !== !!b.weight) {
      if (!!b.weight) {
        return 1;
      } else {
        return -1;
      }
    }
    if (!!a.crafting !== !!b.crafting) {
      if (!!b.crafting) {
        return 1;
      } else {
        return -1;
      }
    }
    if (a.order !== b.order) {
      if (a.order > b.order) {
        return 1;
      } else {
        return -1;
      }
    }
    if (a.name !== b.name) {
      if (a.name > b.name) {
        return 1;
      } else {
        return -1;
      }
    }
    return b.qty - a.qty;
  };

  const getClasses = className => {
    return Object.keys(global)
      .filter(name => global[name].prototype instanceof className)
      .map(name => global[name].prototype);
  };

  const iconData = data => {
    try {
      return {
        ...data,
        icon: fs.readFileSync("./resources" + data.icon, "base64")
      };
    } catch (e) {
      return data;
    }
  };

  levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return {
    skills: Object.values(SKILLS).toObject(
      s => s,
      s => SKILL_NAMES[s]
    ),
    items: getClasses(Item)
      .sort(itemSorter)
      // .filter(i => i.name[0] !== '?')
      .map(i => {
        const inherited = {};
        for (let p in i) {
          inherited[p] = i[p];
        }
        return {
          ...inherited,
          ...i,
          name: i.getName(),
          itemCode: i.constructor.name,
          craftingSkill: i.crafting && SKILL_NAMES[i.crafting.skill],
          craftingSkillLevel: i.crafting && i.crafting.skillLevel,
          damagePotential: levels.map(l => {
            const creature = {
              getChanceToHit: Creature.prototype.getChanceToHit,
              getWeaponDamage: Creature.prototype.getWeaponDamage,
              getSkillLevel: () => l
            };
            // const damage =
            //   i.damage &&
            //   Object.values(creature.getWeaponDamage(i)).reduce(
            //     (acc, v) => acc + v,
            //     0
            //   );
            const damage =
              i.damage &&
              Object.values(creature.getWeaponDamage(i)).reduce(
                (acc, v) => Math.max(acc, v),
                0
              );
            return creature.getChanceToHit(i) * damage;
          }),
          // i.slots && i.slots[EQUIPMENT_SLOTS.WEAPON]
          //   ? levels.map(
          //       l => Creature.calculateHitChance(i.hitChance, l) * damage
          //     )
          //   : null,
          weaponSkillName: SKILL_NAMES[i.weaponSkill]
        };
      })
      .map(iconData)
      .toObject(val => val.itemCode),
    resources: getClasses(Resource)
      .map(r => ({
        ...r,
        skillName: SKILL_NAMES[r.skill],
        itemCtr: r.constructor.name,
        item: r.produces && r.getProduce(dummyCreature, true).name,
        icon: r.produces && r.getProduce(dummyCreature, true).prototype.icon
      }))
      .map(iconData),
    buildings: getClasses(Building)
      .map(i => {
        const instance = new i.constructor();
        const repairMats = instance.getRepairMaterials() || {};
        const result = {
          ...i,
          itemCode: i.constructor.name,
          materialsFull: Object.keys(i.materials || {}).map(className => ({
            details: iconData(global[className].prototype),
            qty: (i.materials || {})[className]
          })),
          placementFull: instance.placement.map(v =>
            Object.keys(NODE_TYPES).find(k => +NODE_TYPES[k] === +v)
          ),
          repairMaterials: Object.keys(repairMats).map(className => ({
            details: iconData(global[className].prototype),
            qty: `${+(
              ((1 * MONTHS) / instance.deteriorationRate) *
              (repairMats[className] / BUILD_TO_REPAIR_RATIO)
            ).toFixed(2)}`
          })),
          totalTime:
            i.baseTime *
            Object.values(i.materials || {}).reduce((acc, qty) => acc + qty, 0)
        };
        // instance.destroy();
        return result;
      })
      .map(iconData),
    monsters: getClasses(Monster)
      .map(monster => ({
        ...monster,
        armor: monster.getArmorValue && monster.getArmorValue(),
        damage: monster.getWeapon && monster.getWeaponDamage(),
        toHit: monster.getWeapon && monster.getWeapon().hitChance,
        threatLevel: monster.getThreatLevel(),
        scouters: monster.scouterMessages.map(iconData)
      }))
      .map(iconData)
      .sort((a, b) => a.threatLevel - b.threatLevel),
    players: Player.list
      .map(player => {
        const creature = player.getCreature();
        return {
          email: player.email,
          discord: player.discord,
          quests: Object.keys(player.completedQuests),
          ...(creature ? creature.getPayload(creature) : {})
        };
      })
      .sort((a, b) => a.quests.length - b.quests.length),
    regions: Entity.getEntities(Region)
      .map(region => ({
        id: region.id,
        nodesCount: region.nodes.length,
        nodesTypes: region.nodes.reduce(
          (acc, node) => ({
            ...acc,
            [node.constructor.name]: (acc[node.constructor.name] || 0) + 1
          }),
          {}
        ),
        name: region.regionName,
        nameSubmission: region.nameSubmission,
        resources: region.resources,
        nameSetBy: region.nameSetBy
      }))
      .sort((a, b) => {
        return a.level - b.level;
        if (`${a.name}` > `${b.name}`) {
          return 1;
        }
        if (`${a.name}` < `${b.name}`) {
          return -1;
        }
        return 0;
      }),
    timing: global.timing
  };
});
