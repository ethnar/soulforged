const Room = require("../../room");

class Base_GuardRoom extends Room {
  static getLootTable(tier, base = 150, mult = 0.4) {
    return () => {
      const getWeapon = () => {
        const weaponTiers = [
          ["CopperSpear", "CopperAxe", "CopperHammer", "CopperKnife"],
          ["TinSpear", "TinAxe", "TinHammer", "TinKnife"],
          ["BronzeSpear", "BronzeAxe", "BronzeHammer", "BronzeKnife"],
          ["IronSpear", "IronAxe", "IronHammer", "IronKnife"],
          ["LeadSpear", "LeadAxe", "LeadHammer", "LeadKnife"],
          ["SteelSpear", "SteelAxe", "SteelHammer", "SteelKnife"]
        ];

        const betterWeaponTiers = [
          [],
          [],
          ["Sword335", "Axe332", "Knife467"],
          ["Axe211", "Hammer31"],
          ["Sword839", "Knife883"],
          ["Sword840", "Spear91", "Mace521"],
          ["Hammer214", "Spear727", "Mace252"],
          ["Axe735", "Sword420"]
        ];

        // 5% / 15% / 100%
        const roll = utils.random(1, 100);

        let targetTier;
        switch (true) {
          case roll <= 5:
            targetTier = tier + 1;
            break;
          case roll <= 15:
            targetTier = tier;
            break;
          default:
            targetTier = tier - 1;
        }

        let weaponPool;
        if (utils.chance(15) && betterWeaponTiers[targetTier].length) {
          weaponPool = betterWeaponTiers;
        } else {
          weaponPool = weaponTiers;
        }
        return utils.randomItem(
          weaponPool[Math.min(targetTier, weaponPool.length - 1)]
        );
      };
      const getArmor = () => {
        const armorTiersBase = [
          ["ArmorSetsLeather1", "ArmorSetsLeather2"],
          ["ArmorSetsLeather3", "ArmorSetsMetal0"],
          ["ArmorSetsLeather4", "ArmorSetsMetal1"],
          ["ArmorSetsMetal2"],
          ["ArmorSetsMetal3"],
          ["ArmorSetsMetal4"]
        ];

        const lowPieces = ["Feet", "Hands", "Head"];
        const highPieces = ["Chest", "Trousers"];

        const armorTiers = [];

        armorTiersBase.forEach((list, idx) => {
          armorTiers[idx] = armorTiers[idx] || [];
          armorTiers[idx + 1] = armorTiers[idx + 1] || [];
          list.forEach(set => {
            lowPieces.forEach(lowPiece => {
              armorTiers[idx].push(set + "_" + lowPiece);
            });
            highPieces.forEach(lowPiece => {
              armorTiers[idx + 1].push(set + "_" + lowPiece);
            });
          });
        });

        // 10% / 90%
        const roll = utils.random(1, 100);

        let targetTier;
        switch (true) {
          case roll <= 10:
            targetTier = tier;
            break;
          default:
            targetTier = tier - 1;
        }

        return utils.randomItem(armorTiers[targetTier]);
      };

      const results = {};

      let rollChance = base;
      while (utils.chance(rollChance)) {
        let item;
        if (utils.chance(30)) {
          item = getWeapon();
        } else {
          item = getArmor();
        }

        results[item] = results[item] || 0;
        results[item] += 1;

        rollChance = rollChance * mult;
      }

      return results;
    };
  }
}
Object.assign(Base_GuardRoom.prototype, {
  name: "Guard Room",
  unlisted: true,
  mapGraphic: {
    5: `tiles/dungeon/rooms/guard-room00.png`
  }
});

module.exports = global.Base_GuardRoom = Base_GuardRoom;
