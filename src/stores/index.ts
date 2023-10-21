import { createContext, useContext } from "react";
import AuthenticationStore from "./authentication";
import RestaurantStore from "./restaurant";
import ReservationStore from "./dashboard";

interface Store {
  authenticationStore: AuthenticationStore;
  restaurantStore: RestaurantStore;
  reservationStore: ReservationStore;
}

export const store: Store = {
  authenticationStore: new AuthenticationStore(),
  restaurantStore: new RestaurantStore(),
  reservationStore: new ReservationStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
