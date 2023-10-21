import { DocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export class User {
  name: string;
  username: string;
  email: string;
  uid: string;
  constructor(name: string, username: string, email: string, uid: string) {
    this.name = name;
    this.username = username;
    this.email = email;
    this.uid = uid;
  }
  toString() {
    return this.email + ", " + this.uid;
  }
}

// Firestore data converter
export const userConverter = {
  toFirestore: (user: User) => {
    return {
      name: user.name,
      username: user.username,
      email: user.email,
      uid: user.uid,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot, options: SnapshotOptions) => {
    const data = snapshot.data(options);
    if (data) return new User(data.name, data.username, data.email, data.uid);
    return null;
  },
};
