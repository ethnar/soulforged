const Structure = require("../.structure");

const actions = Action.groupById([
  new Action({
    name: "Push",
    icon: "/actions/icons8-so-so-100.png",
    quickAction: true,
    notification: false,
    repeatable: false,
    notAllowedInCombat: true,
    valid(entity, creature) {
      if (entity.getNode() !== creature.getNode()) {
        return false;
      }
      return true;
    },
    run(entity, creature, seconds) {
      entity.toggleOn();
      return false;
    }
  })
]);

class DungeonButton extends Structure {
  static actions() {
    return actions;
  }

  constructor(args) {
    super(args);
    this.isOn = false;
  }

  toggleOn() {
    this.isOn = true;
    if (this.togglesElement) {
      this.togglesElement.sendSignal(this.isOn, this);
    }
  }

  dungeonReset() {
    this.isOn = false;
    if (this.togglesElement) {
      this.togglesElement.sendSignal(false, this);
    }
  }
}
Object.assign(DungeonButton.prototype, {
  name: "Button",
  icon: `/${ICONS_PATH}/structures/dungeon/sgi_86_button.png`
});

module.exports = global.DungeonButton = DungeonButton;
