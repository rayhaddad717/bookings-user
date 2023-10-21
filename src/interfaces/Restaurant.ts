import { DocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import Table from "./Table";

export interface ContactInformation {
  phoneNumber?: number;
  email?: string;
  twitterHandle?: string;
  facebookHandle?: string;
  instagramHandle?: string;
}

export interface Image {
  url: string;
  isMain: boolean;
  status: number;
  isNew?: boolean;
}
export interface OperatingHour {
  startTime: number[]; //hour, minute
  endTime: number[];
}

export interface OperatingDays {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}
export type DaysOfTheWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
export type RestaurantFields =
  | "name"
  | "description"
  | "address"
  | "contactInformation"
  | "website"
  | "operatingDays"
  | "operatingHours"
  | "images"
  | "uid"
  | "tables";
export interface Location {
  latitude: number;
  longitude: number;
};
export interface GeocodingLocation {
  plus_code: { compound_code: string; global_code: string };
  results: {
    address_components: {
      long_name: string;
      short_name: string;
      types: ("political" | "locality" | "street_address" | "route" | "administrative_area_level_1")[];
    }[];
    formatted_address: string;
    place_id: string;
    types: ("political" | "locality" | "street_address" | "route" | "administrative_area_level_1")[];
  }[];
  status:
    | "OK"
    | "ZERO_RESULTS"
    | "OVER_QUERY_LIMIT"
    | "REQUEST_DENIED"
    | "INVALID_REQUEST"
    | "UNKNOWN_ERROR";
}

export class Restaurant {
  name: string = "";
  description: string = "";
  address: string = "";
  contactInformation?: ContactInformation = {};
  website: string = "";
  operatingDays?: OperatingDays = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  };
  operatingHours?: OperatingHour[] = [];
  images?: Image[] = [];
  uid: string = "";
  tables?: Table[] = [];
  location?:Location = {latitude:0,longitude:0};
  constructor(data: Partial<Restaurant>) {
    Object.assign(this, data);
  }
  toString() {
    return this.name + "- " + this.description;
  }
}

// Firestore data converter
export const restaurantConverter = {
  toFirestore: (restaurant: Restaurant) => {
    return {
      name: restaurant.name || "",
      description: restaurant.description || "",
      address: restaurant.address || "",
      contactInformation: restaurant.contactInformation || {
        phoneNumber: "",
        email: "",
        facebookHandle: "",
        instagramHandle: "",
        twitterHandle: "",
      },
      website: restaurant.website || "",
      operatingDays: restaurant.operatingDays || {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      operatingHours: restaurant.operatingHours || [],
      images: restaurant.images || [],
      uid: restaurant.uid || "",
      tables: restaurant.tables || [],
      location:restaurant.location || {latitude:0,longitude:0}
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    if (data) {
      // if (data.tables?.length)
      //   data.tables = data.tables.map(
      //     (t: any) => new Table(t.capacity, t.tableNumber)
      //   );
      data.uid = data.id;
      return new Restaurant(data);
    }
    return null;
  },
};
