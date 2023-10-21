import { makeAutoObservable, runInAction } from "mobx";
import { User } from "../interfaces";

export default class AuthenticationStore {
  currentUser: User | null | undefined = null;
  userUID: string | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  setCurrentUser = (user: User | null) => {
    runInAction(() => {
      this.currentUser = user;
    });
  };

  setUserUID(uid: string | null) {
    this.userUID = uid;
  }
}
