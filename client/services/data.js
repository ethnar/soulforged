import { ServerService } from "./server.js";

const streamsCache = {};
const streamsData = {};
const timeouts = {};

const unclearable = {
  getMyRecipesStream: true,
  getRecentResearchesStream: true,
  getMyBuildingPlansStream: true,
  getMyQuestsStream: true,
  getRelationshipsStream: true
};

function makeStreamGetter(dataStream) {
  return () => {
    clearTimeout(timeouts[dataStream]);
    if (!streamsCache[dataStream]) {
      const stream = new Rx.ReplaySubject(1);

      ServerService.registerHandler(
        `data.payload.${dataStream}.initial`,
        data => {
          stream.next(data);
          streamsData[dataStream] = data;
        }
      );

      ServerService.registerHandler(
        `data.payload.${dataStream}.delta`,
        data => {
          data = window.jsonDelta.applyDiff(streamsData[dataStream], data);
          stream.next(data);
          streamsData[dataStream] = data;
        }
      );

      if (streamsData[dataStream]) {
        stream.next(streamsData[dataStream]);
      }

      ServerService.request(`data.request.${dataStream}`, {
        sub: true,
        fetch: !streamsData[dataStream]
      });

      streamsCache[dataStream] = stream
        .finally(() => {
          delete streamsCache[dataStream];
          ServerService.request(`data.request.${dataStream}`, {
            sub: false
          });
          if (!unclearable[dataStream]) {
            timeouts[dataStream] = setTimeout(() => {
              delete streamsCache[dataStream];
              delete streamsData[dataStream];
            }, 30000);
          }
        })
        .publishReplay(1)
        .refCount();
    }
    return streamsCache[dataStream];
  };
}

const getAvailableItemsStream = () =>
  Rx.Observable.combineLatest(
    DataService.getMyInventoryStream(),
    DataService.getMyHomeInventoryStream()
  )
    .filter(([inventory]) => inventory)
    .map(([inventory, homeInventory]) => [
      ...inventory.items,
      ...((homeInventory && homeInventory.items) || [])
    ]);

const getAvailableItemsCountsStream = () =>
  getAvailableItemsStream().map(items => {
    const map = {};
    items.forEach(i => {
      map[i.itemCode] = map[i.itemCode] || 0;
      map[i.itemCode] += i.qty;
    });
    return map;
    // return items.toObject(i => i.itemCode, i => i.qty);
  });

export const DataService = {
  getIsTutorialAreaStream: makeStreamGetter("isTutorialArea"),
  getCurrentActionStream: makeStreamGetter("currentAction"),
  getAcceptedLegalTermsStream: makeStreamGetter("acceptedLegalTerms"),
  getAmbientAudioStream: makeStreamGetter("ambientAudio"),
  getMyCreatureStream: makeStreamGetter("myCreature"),
  getMyEquipmentStream: makeStreamGetter("myEquipment"),
  getMyFurnitureStream: makeStreamGetter("myFurniture"),
  getMyRecipesStream: makeStreamGetter("myRecipes"),
  getMyTradesStream: makeStreamGetter("myTrades"),
  getMyInventoryStream: makeStreamGetter("myInventory"),
  getMyHomeInventoryStream: makeStreamGetter("myHomeInventory"),
  getResearchMaterialsStream: makeStreamGetter("researchMaterials"),
  getRecentResearchesStream: makeStreamGetter("recentResearches"),
  getMyBuildingPlansStream: makeStreamGetter("myBuildingPlans"),
  getPlayerInfoStream: makeStreamGetter("playerInfo"),
  getMyQuestsStream: makeStreamGetter("myQuests"),
  getEffectsSummaryStream: makeStreamGetter("effectsSummary"),
  getCurrentTimeInMinutesStream: makeStreamGetter("currentTimeInMinutes"),
  getTradeListingsStream: makeStreamGetter("tradeListings"),
  getKnownItemsStream: makeStreamGetter("knownItems"),
  getEventsStream: makeStreamGetter("events"),
  getNodeItemsStream: makeStreamGetter("nodeItems"),
  getListingIdsStream: makeStreamGetter("listingIds"),
  getRelationshipsStream: makeStreamGetter("relationships"),
  getTickerStream: makeStreamGetter("ticker"),
  getCurrentNodeIdStream: () =>
    DataService.getPlayerInfoStream().pluck("location"),
  getAvailableItemsStream,
  getAvailableItemsCountsStream
};

ServerService.getResetStream().subscribe(() => {
  Object.keys(streamsCache).forEach(dataStream => {
    ServerService.request(`data.request.${dataStream}`, {
      sub: true,
      fetch: true
    });
  });
});

window.DataService = DataService;
