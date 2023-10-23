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
      console.log('setting user in store',user)
      this.currentUser = user;
    });
  };

  setUserUID(uid: string | null) {
    this.userUID = uid;
  }
}
