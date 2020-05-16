import { DataService } from "./data.js";

let newListingsStream;
let rememberedListingsStream;

export const TradingService = (window.TradingService = {
  getNewListingsStream() {
    if (!newListingsStream) {
      newListingsStream = Rx.Observable.combineLatestMap({
        listingIds: DataService.getListingIdsStream(),
        rememberedListings: TradingService.getRememberedListingsStream()
      }).map(({ listingIds, rememberedListings }) => {
        const results = {};
        Object.keys(listingIds).forEach(creatureId => {
          results[creatureId] = results[creatureId] || {};

          listingIds[creatureId].forEach(listingId => {
            if (
              !rememberedListings[creatureId] ||
              !rememberedListings[creatureId][listingId]
            ) {
              results[creatureId][listingId] = true;
            }
          });
        });
        return results;
      });
    }
    return newListingsStream;
  },

  getRememberedListingsStream() {
    if (!rememberedListingsStream) {
      rememberedListingsStream = new Rx.ReplaySubject(1);
      let value;
      try {
        value = JSON.parse(localStorage.getItem("rememberedListings")) || {};
      } catch (e) {
        value = {};
      }
      rememberedListingsStream.next(value);
    }
    return rememberedListingsStream;
  },

  updateRememberedListingsStream() {
    Rx.Observable.combineLatestMap({
      listingIds: DataService.getListingIdsStream(),
      values: TradingService.getRememberedListingsStream()
    })
      .first()
      .subscribe(({ values, listingIds }) => {
        Object.keys(listingIds).forEach(creatureId => {
          values[creatureId] = values[creatureId] || {};
          listingIds[creatureId].forEach(listingId => {
            values[creatureId][listingId] = true;
          });
        });
        localStorage.setItem("rememberedListings", JSON.stringify(values));
        rememberedListingsStream.next(values);
      });
  }
});
