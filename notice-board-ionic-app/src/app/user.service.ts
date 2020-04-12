import { Injectable } from "@angular/core";
import { UserData } from "./user.model";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private userData: UserData;

  constructor() {}

  setUser = user => {
    this.userData = {
      displayName: user.displayName,
      email: user.email,
      uId: user.uid,
      creationTime: user.creationTime,
      lastSignInTime: user.lastSignInTime,
      phoneNumber: user.phoneNumber,
      photoUrl: user.photoURL
    };
  };

  getUser() {
    return this.userData;
  }
}
