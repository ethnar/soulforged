const WeaponSystem = {
  BASE_HIT: {
    UNARMED: 50,
    IMPROVISED: 40,
    SWORD: 80,
    AXE: 80,
    HAMMER: 70,
    KNIFE: 60,
    POLEARM: 70,
    MACE: 80
  },

  getCoefficientLevel(weapon) {
    return Math.ceil(
      (weapon.skillCoefficients &&
      weapon.skillCoefficients.hitChance !== undefined
        ? weapon.skillCoefficients.hitChance
        : 1) +
        Object.values(
          (weapon.skillCoefficients && weapon.skillCoefficients.damage) || {}
        ).reduce(utils.sum, 0)
    );
  },

  normalizedSkillLevel(skillLevel) {
    return 1.8 * skillLevel;
  },

  getHitChanceCoefficient(weapon, creature) {
    const weaponSkill = weapon.weaponSkill || SKILLS.FIGHTING_UNARMED;
    const coefficient =
      weapon.skillCoefficients &&
      weapon.skillCoefficients.hitChance !== undefined
        ? weapon.skillCoefficients.hitChance
        : 1;
    return (
      coefficient *
      WeaponSystem.normalizedSkillLevel(creature.getSkillLevel(weaponSkill, 1))
    );
  },

  calculateDamageWithCoefficients(weapon, creature) {
    const weaponSkill = weapon.weaponSkill || SKILLS.FIGHTING_UNARMED;
    const skillLevel = creature.getSkillLevel(weaponSkill, 1);

    return Object.keys(weapon.damage).toObject(
      type => type,
      type => {
        const coefficientBonus =
          weapon.skillCoefficients &&
          weapon.skillCoefficients.damage &&
          weapon.skillCoefficients.damage[type]
            ? weapon.skillCoefficients.damage[type] *
              WeaponSystem.normalizedSkillLevel(skillLevel)
            : 0;
        return weapon.damage[type] + coefficientBonus;
      }
    );
  }
};

module.exports = global.WeaponSystem = WeaponSystem;
