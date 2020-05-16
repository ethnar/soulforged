import { ServerService } from "../../services/server.js";
import { MapService } from "../../services/map.js";

const DIRECTIONS = {
  UP: "N",
  RIGHT: "E",
  DOWN: "S",
  LEFT: "W",
  NONE: undefined
};

function getInDirection(from, nodes, direction) {
  return nodes.find(node => {
    return (
      (direction === DIRECTIONS.UP && from.x === node.x && from.y > node.y) ||
      (direction === DIRECTIONS.DOWN && from.x === node.x && from.y < node.y) ||
      (direction === DIRECTIONS.RIGHT &&
        from.x < node.x &&
        from.y === node.y) ||
      (direction === DIRECTIONS.LEFT && from.x > node.x && from.y === node.y)
    );
  });
}

Vue.component("dungeon-controls", {
  data: () => ({
    DIRECTIONS
  }),

  computed: {
    assaultContext() {
      return { assault: true };
    }
  },

  subscriptions() {
    return {
      node: ServerService.getNodeStream(),
      isDungeon: ServerService.getIsDungeonStream(),
      actions: ServerService.getNodeStream()
        .switchMap(node => MapService.getNodeStream(node.id))
        .switchMap(node =>
          Rx.Observable.combineLatestMap({
            nodes: node.paths.length
              ? Rx.Observable.combineLatest(
                  node.paths.map(nodeId => MapService.getNodeStream(nodeId))
                )
              : Rx.Observable.of([]),
            current: Rx.Observable.of(node)
          })
        )
        .map(({ nodes, current }) => {
          return Object.values(DIRECTIONS).toObject(
            dir => dir || DIRECTIONS.NONE,
            dir => {
              let result = {
                target: getInDirection(current, nodes, dir),
                name: "Travel"
              };
              const travelAction =
                result.target &&
                result.target.actions &&
                result.target.actions.find(a => a.id === "Travel");
              if (!travelAction || !travelAction.available) {
                const relevantStructure = [...current.structures]
                  .reverse()
                  .find(s => s.roomPlacement === dir);
                if (relevantStructure) {
                  result = {
                    structure: relevantStructure
                  };
                }
              }
              return result;
            }
          );
        })
    };
  },

  template: `
<div class="dungeon-controls-wrapper" v-if="isDungeon && actions">
    <div class="dungeon-controls">
        <div class="directional-action center">
            <node-structures v-if="actions[DIRECTIONS.NONE].structure" :node="node" :filter="(s) => s.id === actions[DIRECTIONS.NONE].structure.id" :icon-only="true" />
        </div>
        <div class="directional-action up">
            <node-structures v-if="actions[DIRECTIONS.UP].structure" :node="node" :filter="(s) => s.id === actions[DIRECTIONS.UP].structure.id" :icon-only="true" />
            <actions :target="actions[DIRECTIONS.UP].target" :include="[actions[DIRECTIONS.UP].name]" :text="false" :icon="true" :quick="true" :context="assaultContext"></actions>
        </div>
        <div class="directional-action right">
            <node-structures v-if="actions[DIRECTIONS.RIGHT].structure" :node="node" :filter="(s) => s.id === actions[DIRECTIONS.RIGHT].structure.id" :icon-only="true" />
            <actions :target="actions[DIRECTIONS.RIGHT].target" :include="[actions[DIRECTIONS.RIGHT].name]" :text="false" :icon="true" :quick="true" :context="assaultContext"></actions>
        </div>
        <div class="directional-action bottom">
            <node-structures v-if="actions[DIRECTIONS.DOWN].structure" :node="node" :filter="(s) => s.id === actions[DIRECTIONS.DOWN].structure.id" :icon-only="true" />
            <actions :target="actions[DIRECTIONS.DOWN].target" :include="[actions[DIRECTIONS.DOWN].name]" :text="false" :icon="true" :quick="true" :context="assaultContext"></actions>
        </div>
        <div class="directional-action left">
            <node-structures v-if="actions[DIRECTIONS.LEFT].structure" :node="node" :filter="(s) => s.id === actions[DIRECTIONS.LEFT].structure.id" :icon-only="true" />
            <actions :target="actions[DIRECTIONS.LEFT].target" :include="[actions[DIRECTIONS.LEFT].name]" :text="false" :icon="true" :quick="true" :context="assaultContext"></actions>
        </div>
    </div>
</div>
    `
});
