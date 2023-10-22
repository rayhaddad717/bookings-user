import { makeAutoObservable } from "mobx";
import { Restaurant } from "../interfaces";

export default class RestaurantStore {
  restaurantsMap = new Map<string, Restaurant>();
  favoriteRestaurants = new Set<string>();
  isAddRestaurant = false;
  isLoaded = false;
  cacheTimestamp: Date | null = null;
  restaurantsForFilter: Restaurant[] = [];
  constructor() {
    makeAutoObservable(this);
  }

  get restaurants() {
    return Array.from(this.restaurantsMap.values());
  }

  initiazeRestaurants = (restaurants: Restaurant[]) => {
    restaurants.forEach((r) => this.addRestaurant(r));
    this.isLoaded = true;
  };

  addRestaurant = (restaurant: Restaurant) => {
    this.restaurantsMap.set(restaurant.uid, restaurant);
  };
  updateRestaurant = (restaurant: Restaurant) => {
    this.restaurantsMap.set(restaurant.uid, restaurant);
  };
  deleteRestaurant = (restaurant: Restaurant) => {
    this.restaurantsMap.delete(restaurant.uid);
  };

  setAddEditRestaurant = (type: "add" | "edit") => {
    this.isAddRestaurant = type === "add";
  };

  //user
  toggleFavorite = (uid: string) => {
    if (this.favoriteRestaurants.has(uid)) this.favoriteRestaurants.delete(uid);
    else this.favoriteRestaurants.add(uid);
  };
  setFavoriateRestaurant = (favoriteRestaurants: Set<string>) => {
    this.favoriteRestaurants = new Set(favoriteRestaurants);
  };
  setRestaurantsForFilter = (restaurantsForFilter: Restaurant[]) => {
    this.cacheTimestamp = new Date();
    this.restaurantsForFilter = restaurantsForFilter;
  };
}
