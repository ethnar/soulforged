const Item = require("../items/.item");

class LegendaryItem extends Item {
  reduceIntegrity(damage) {
    super.reduceIntegrity(damage);

    if (this.getIntegrity() <= 0) {
      const container = this.getContainer();
      this.destroy();

      // TODO
      const decorationVersion = new Decoration({
        variants: [
          {
            name: this.name,
            icon: this.icon,
            buffs: [SKILL_NAMES[SKILLS.FIGHTING_UNARMED]]
          }
        ]
      });
      decorationVersion.buff = this.legendaryBuff;

      container.addItem(decorationVersion);
    }
  }
}

module.exports = global.LegendaryItem = LegendaryItem;
