const fs = require("fs");

function validClass(i) {
  return i.name && i.name[0] !== "?";
}

function writeStats() {
  const data = {
    itemTypesCount: utils.getClasses(Item).filter(validClass).length,
    totalRecipesCount: Recipe.getRecipes().length,
    monstersTypesCount: utils.getClasses(Monster).filter(validClass).length,
    currentPlayerCount: Player.list.filter(
      p => p.getCreature() && !p.getCreature().isDead()
    ).length,
    totalItems: Entity.getEntities(Item).length
  };
  fs.writeFileSync("./client/.out/stats.json", JSON.stringify(data));
}

setInterval(writeStats, 1 * HOURS * IN_MILISECONDS);
setTimeout(writeStats, 10 * SECONDS * IN_MILISECONDS);
