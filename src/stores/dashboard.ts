import { makeAutoObservable } from "mobx";
import { Restaurant } from "../interfaces";
import { Reservation } from "../interfaces/Reservation";

export default class ReservationStore {
  upcomingReservationsMap = new Map<string, Reservation>();
  pendingBookingsMap = new Map<string, Reservation>();
  newBookingsMap = new Map<string, Reservation>();
  newMessagesMap = new Map<string, Reservation>();
  isLoaded = false;
  constructor() {
    makeAutoObservable(this);
  }

  get upcomingReservations() {
    return Array.from(this.upcomingReservationsMap.values());
  }
  get pendingBookings() {
    return Array.from(this.pendingBookingsMap.values());
  }
  get newBookings() {
    return Array.from(this.newBookingsMap.values());
  }
  get newMessages() {
    return Array.from(this.newMessagesMap.values());
  }

  get todaysReservations() {
    let arr: {
      type: "title" | "data";
      element?: Reservation;
      title?: { title: string; uid: string };
    }[] = [
      {
        title: { title: "Upcoming Reservations", uid: "title-1" },
        type: "title",
      },
    ];
    arr = arr.concat(
      this.upcomingReservations.map((r) => ({ type: "data", element: r }))
    );
    arr = arr.concat([
      {
        title: { title: "Pending Bookings", uid: "title-2" },

        type: "title",
      },
    ]);
    arr = arr.concat(
      this.upcomingReservations.map((r, i) => ({
        type: "data",
        element: { ...r, uid: r.uid! + i },
      }))
    );
    arr = arr.concat([
      {
        title: { title: "New Bookings", uid: "title-3" },

        type: "title",
      },
    ]);
    arr = arr.concat(
      this.upcomingReservations.map((r, i) => ({
        type: "data",
        element: { ...r, uid: `${r.uid!}-0${i}` },
      }))
    );
    arr = arr.concat([
      {
        title: { title: "New Message", uid: "title-4" },

        type: "title",
      },
    ]);
    arr = arr.concat(
      this.upcomingReservations.map((r, i) => ({
        type: "data",
        element: { ...r, uid: `${r.uid!}-1${i}` },
      }))
    );
    return arr;
  }
  getMap = (
    type:
      | "upcomingReservations"
      | "pendingBookings"
      | "newBookings"
      | "newMessages"
  ) => {
    let map: Map<string, Reservation>;
    switch (type) {
      case "upcomingReservations":
        map = this.upcomingReservationsMap;
        break;
      case "pendingBookings":
        map = this.pendingBookingsMap;
        break;
      case "newBookings":
        map = this.newBookingsMap;
        break;
      case "newMessages":
        map = this.newMessagesMap;
        break;
      default:
        map = this.newBookingsMap;
        break;
    }
    return map;
  };
  setReservations = (
    type:
      | "upcomingReservations"
      | "pendingBookings"
      | "newBookings"
      | "newMessages",
    reservations: Reservation[]
  ) => {
    reservations.forEach((r) => this.addReservation(type, r));
    this.isLoaded = true;
  };

  addReservation = (
    type:
      | "upcomingReservations"
      | "pendingBookings"
      | "newBookings"
      | "newMessages",
    reservation: Reservation
  ) => {
    let map: Map<string, Reservation>;
    switch (type) {
      case "upcomingReservations":
        map = this.upcomingReservationsMap;
        break;
      case "pendingBookings":
        map = this.pendingBookingsMap;
        break;
      case "newBookings":
        map = this.newBookingsMap;
        break;
      case "newMessages":
        map = this.newMessagesMap;
        break;
      default:
        map = this.newBookingsMap;
        break;
    }
    this.getMap(type).set(reservation.uid!, reservation);
  };
  updateRestaurant = (
    type:
      | "upcomingReservations"
      | "pendingBookings"
      | "newBookings"
      | "newMessages",
    reservation: Reservation
  ) => {
    this.getMap(type).set(reservation.uid!, reservation);
  };
  deleteRestaurant = (
    type:
      | "upcomingReservations"
      | "pendingBookings"
      | "newBookings"
      | "newMessages",
    reservation: Reservation
  ) => {
    this.getMap(type).delete(reservation.uid!);
  };
}
