const Item = require("../.item");

class TabletWriting extends Item {
  static actions() {
    return { ...inscriptionActions, ...Item.actions() };
  }

  static getIconByLanguage(creature, language) {
    const icon = `/${ICONS_PATH}/prehistoricicon_44_b_writing_${LANGUAGE_FONTS[language]}.png`;
    return server.getImage(creature, icon);
  }

  getIcon(creature) {
    return TabletWriting.getIconByLanguage(creature, this.getPlotLanguage());
  }

  static getIcon(creature) {
    return TabletWriting.getIconByLanguage(creature, this.getPlotLanguage());
  }

  getPlotText() {
    return Entity.getById(this.sourceId).getPlotText();
  }

  static getPlotLanguage() {
    const source = Entity.getById(this.prototype.sourceId);
    return source && source.getPlotLanguage();
  }

  getPlotLanguage() {
    return Entity.getById(this.sourceId).getPlotLanguage();
  }

  static registerBuildingWithInscription(entityId, name) {
    const className = `TabletWriting${entityId}`;
    utils.newClassExtending(className, TabletWriting);
    Item.itemFactory(global[className], {
      name: name,
      sourceId: entityId
    });
  }

  static getInscriptionCopyClass(entityId) {
    const className = `TabletWriting${entityId}`;
    return global[className];
  }
}
Item.itemFactory(TabletWriting, {
  name: "Tablet Writing",
  order: ITEMS_ORDER.OTHER,
  icon: `/${ICONS_PATH}/prehistoricicon_44_b_text_blank.png`,
  weight: 1
});
