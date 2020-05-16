class MeltedMetal extends ExpirableItem {
  expire() {
    super.expire(false);
  }
}
Item.itemFactory(MeltedMetal, {
  order: ITEMS_ORDER.OTHER,
  containerItemType: Crucible,
  expiresIn: 2 * HOURS
});

module.exports = global.MeltedMetal = MeltedMetal;
