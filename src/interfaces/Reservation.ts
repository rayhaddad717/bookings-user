import { DocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export class Reservation {
  uid?: string;
  reservationDate: Date;
  username: string = "";
  numberOfTables: number;
  partySize: number;
  constructor(data: {
    reservationDate: Date;
    username: string;
    numberOfTables: number;
    partySize: number;
    uid?: string;
  }) {
    this.reservationDate = data.reservationDate;
    this.username = data.username;
    this.numberOfTables = data.numberOfTables;
    this.partySize = data.partySize;
    if (data.uid) this.uid = data.uid;
  }
  toString() {
    return this.username + "- " + this.reservationDate.toDateString();
  }
}

// Firestore data converter
export const restaurantConverter = {
  toFirestore: (reservation: Reservation) => {
    return {
      reservationDate: reservation.reservationDate || new Date(),
      username: reservation.username || "",
      numberOfTables: reservation.numberOfTables || 0,
      partySize: reservation.partySize,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options) as {
      reservationDate: Date;
      username: string;
      numberOfTables: number;
      partySize: number;
      id?: string;
      uid?: string;
    };
    if (data) {
      if (data.id) data.uid = data.id;
      return new Reservation(data);
    }
    return null;
  },
};
