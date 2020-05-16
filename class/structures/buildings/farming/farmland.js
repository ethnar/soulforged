const Building = require("../.building");

const MAX_PLOTS = 20;

const harvestActionCache = {};
function getHarvestAction(validFarmingsNames) {
  return validFarmingsNames.map(farmingName => {
    if (!harvestActionCache[farmingName]) {
      const farmingProps = global[farmingName].getFarmingProps();
      const requiredSkillLevel = farmingProps.skillLevel - 0.5;
      harvestActionCache[farmingName] = new Action({
        name: `Harvest ${global[farmingProps.produces].getName()}`,
        icon: "/actions/icons8-receive-cash-100.png",
        difficulty(entity, creature) {
          return creature.getDifficultyLabel(
            SKILLS.FARMING,
            requiredSkillLevel
          );
        },
        valid(entity) {
          if (!entity.hasProduce()) {
            return false;
          }
          return true;
        },
        runCheck(entity, creature) {
          if (creature.getNode() !== entity.getNode()) {
            return "You must be in the same location to do this.";
          }
          return true;
        },
        available(building, creature) {
          const blocked = creature.accessErrorMessage(building);
          if (blocked) return blocked;
          return true;
        },
        run(entity, creature, seconds) {
          const efficiency = creature.getEfficiency(SKILLS.FARMING, null);
          const plot = entity.plots
            .filter(p => !!p.produce)
            .find(p => {
              const fP = global[p.farming].getFarmingProps();
              return fP.produces === farmingProps.produces;
            });

          if (!plot) {
            creature.stopAction();
            return;
          }

          creature.actionProgress +=
            (seconds * efficiency * 100) / farmingProps.gatherTime;
          const skill = SKILLS.FARMING;

          if (creature.actionProgress >= 100) {
            creature.actionProgress -= 100;

            const chance = creature.getSkillSuccessChance(
              skill,
              requiredSkillLevel
            );

            let skillExperience = farmingProps.gatherTime;
            if (utils.chance(chance)) {
              creature.gainSkill(
                skill,
                skillExperience,
                creature.getSkillGainDifficultyMultiplier(
                  skill,
                  requiredSkillLevel
                )
              );
              creature.gainStatsFromSkill(
                skill,
                creature.getTimeSpentOnAction()
              );

              plot.produce -= 1;
              creature.addItemByType(global[farmingProps.produces]);

              if (plot.produce <= 0) {
                entity.removePlot(plot);
              }
              return false;
            } else {
              creature.gainSkill(
                skill,
                skillExperience / 2,
                creature.getSkillGainDifficultyMultiplier(
                  skill,
                  requiredSkillLevel
                )
              );
              creature.gainStatsFromSkill(
                skill,
                creature.getTimeSpentOnAction()
              );

              const injuryChance = 100 - chance;
              const accidentMessage = creature.accidentChance(
                injuryChance / 2,
                skill,
                null,
                farmingProps.gatherTime
              );
              creature.logging(
                `You didn't manage to harvest successfully. ` + accidentMessage,
                LOGGING.WARN,
                !!accidentMessage
              );

              return false;
            }
          }
          return true;
        }
      });
    }
    return harvestActionCache[farmingName];
  });
}

class Farmland extends Building {
  actionsGetter() {
    const validFarmings = Object.keys(
      this.plots
        .filter(p => !!p.produce)
        .reduce((acc, p) => {
          acc[p.farming] = true;
          return acc;
        }, {})
    );
    return Action.groupById(getHarvestAction(validFarmings));
  }

  constructor(args) {
    super(args);

    this.plots = [];
    this.constructionFinished();
  }

  addPlot(classCtr) {
    this.plots.push({
      farming: classCtr.name,
      growth: 0
    });
  }

  removePlot(plot) {
    const idx = this.plots.indexOf(plot);
    this.plots.splice(idx, 1);

    if (!this.plots.length) {
      this.expiresIn = 2 * DAYS;
    }
  }

  hasPlotSpace() {
    return this.plots.length < MAX_PLOTS;
  }

  hasProduce() {
    return this.plots.some(plot => plot.produce);
  }

  cycle(seconds) {
    super.cycle(seconds);

    if (!this.plots.length) {
      this.expiresIn -= seconds;
      if (this.expiresIn <= 0) {
        this.destroy();
      }
    }

    [...this.plots].forEach(plot => {
      const farmingProps = global[plot.farming].getFarmingProps();
      const progress = (seconds * 100) / farmingProps.growthTime;
      plot.growth = plot.growth + progress;

      if (plot.growth >= 100 && !plot.readyToHarvest) {
        plot.readyToHarvest = true;
        plot.produce = utils.random(...farmingProps.producesRange);
      }

      if (plot.growth >= 1000) {
        this.removePlot(plot);
      }
    });
  }

  getPayload(creature) {
    const result = super.getPayload(creature);
    delete result.integrity;

    result.name = `${this.name} (${this.plots.length} / ${MAX_PLOTS})`;
    result.listedItems = {
      "Farming plots": Object.values(
        this.plots
          .map(plot => {
            const farmingProps = global[plot.farming].getFarmingProps();
            return {
              name: farmingProps.produces,
              item: global[farmingProps.produces].getPayload(creature),
              qty: 1,
              integrity: Math.min(Math.floor(plot.growth), 100)
            };
          })
          .reduce((acc, plot) => {
            const existing = acc[plot.name];
            if (!existing) {
              acc[plot.name] = {
                ...plot
              };
            } else {
              acc[plot.name] = {
                ...plot,
                qty: existing.qty + plot.qty,
                integrity: Math.max(existing.integrity, plot.integrity)
              };
            }
            return acc;
          }, {})
      ).map(value => ({
        ...value,
        name: `Research Concept: ${
          value.integrity >= 100 ? "Ready" : "Growing"
        }`,
        integrity: undefined
      }))
    };

    return result;
  }
}
Building.buildingFactory(Farmland, {
  name: "Farmland",
  order: 15,
  icon: `/${ICONS_PATH}/structures/buildings/farming/sgi_51.png`,
  deteriorationRate: Infinity,
  noRuins: true,
  placement: [
    NODE_TYPES.TROPICAL_PLAINS,
    NODE_TYPES.DESERT_GRASS,
    NODE_TYPES.PLAINS,
    NODE_TYPES.SCRUB_LAND
  ],
  repair: {
    materials: {}
  },
  mapGraphic: (node, structure) => {
    if (!structure.plots || !structure.plots.length) {
      return {};
    }
    return {
      6: "tiles/custom/hexfarmland00.png"
    };
  }
});
module.exports = global.Farmland = Farmland;
