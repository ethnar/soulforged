global.program = require("commander");
program
  .version("0.1.0")
  .option("-d, --dev", "Development mode")
  .option("-s, --ssl", "Connect over ssl")
  .parse(process.argv);

const World = require("../class/world");

const categories = [
  CopperEquipment,
  TinEquipment,
  BronzeEquipment,
  LeadEquipment,
  IronEquipment,
  SteelEquipment
];

console.log("Start");
categories.forEach(baseClass => {
  const items = utils.getClasses(baseClass);
  const baseline = items.filter(i => !i.checkWeapon);
  const special = items.filter(i => i.checkWeapon);

  special.forEach(s => {
    let skillUsed;
    switch (s.weaponSkill) {
      case SKILLS.FIGHTING_SWORD:
        skillUsed = SKILLS.FIGHTING_KNIFE;
        break;
      case SKILLS.FIGHTING_MACE:
        skillUsed = SKILLS.FIGHTING_HAMMER;
        break;
      default:
        skillUsed = s.weaponSkill;
    }
    const b = baseline.find(w => w.weaponSkill === skillUsed);
    let skill = -1;
    do {
      skill += 1;
      const mock = {
        getSkillLevel: () => skill
      };
      const specialHitChange =
        s.hitChance + WeaponSystem.getHitChanceCoefficient(s, mock);
      const baselineHitChange =
        b.hitChance + WeaponSystem.getHitChanceCoefficient(b, mock);

      const specialDamage = Object.values(s.damage).reduce(
        (acc, v) => acc + v,
        0
      );
      const baselineDamage = Object.values(b.damage).reduce(
        (acc, v) => acc + v,
        0
      );
      if (
        specialHitChange * specialDamage >
        baselineHitChange * baselineDamage
      ) {
        break;
      }
    } while (skill < 10);
    console.log(s.name, "(compared", b.name, ")", "skill for upgrade", skill);
  });
});
console.log("Done");
