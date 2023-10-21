import { makeAutoObservable } from "mobx";
import { Restaurant } from "../interfaces";

export default class RestaurantStore {
  restaurantsMap = new Map<string, Restaurant>();
  isAddRestaurant = false;
  isLoaded = false;
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
}
