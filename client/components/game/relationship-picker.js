Vue.component("relationship-picker", {
  props: {
    creature: {
      default: {}
    }
  },

  data: () => ({
    relationshipOverride: null
  }),

  methods: {
    selectRelationship(relationship) {
      ServerService.request("applyRelationship", {
        creatureId: this.creature.id,
        relationship
      }).then(r => {
        if (r) {
          this.relationshipOverride = relationship;
          this.$emit("changed");
        }
      });
    }
  },

  computed: {
    relationship() {
      return this.relationshipOverride || this.creature.relationship;
    },
    isRival() {
      return this.relationship === "rival";
    },
    isNeutral() {
      return !this.isFriend && !this.isRival;
    },
    isFriend() {
      return this.relationship === "friend";
    }
  },

  template: `
<div class="relationship-picker">
    <div class="item rival" :class="{ active: isRival }">
        <div class="button action icon text" @click.prevent="selectRelationship('rival');">
            <span class="multicolor-icon"></span>
        </div>
        <div class="label">Rival</div>
    </div>
    <div class="item neutral" :class="{ active: isNeutral }">
        <div class="button action icon text" @click.prevent="selectRelationship('neutral');">
            <span class="multicolor-icon"></span>
        </div>
        <div class="label">Neutral</div>
    </div>
    <div class="item friend" :class="{ active: isFriend }">
        <div class="button action icon text" @click.prevent="selectRelationship('friend');">
            <span class="multicolor-icon"></span>
        </div>
        <div class="label">Friend</div>
    </div>
</div>
    `
});
