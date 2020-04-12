import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  constructor() {}

  async setDidSeeSlides(passedAction, passedValue) {
    await Storage.set({
      key: `didSeeSlides`,
      value: JSON.stringify({
        action: passedAction,
        value: passedValue
      })
    });
  }

  async getDidSeeSlides() {
    const ret = await Storage.get({ key: `didSeeSlides` });
    return ret.value;
  }

  async setIsUserValidated(email: string, val: boolean) {
    await Storage.set({
      key: `isUserValidated${email}`,
      value: JSON.stringify({
        email: email,
        value: val
      })
    });
  }

  async getIsUserValidated(email: string) {
    const ret = await Storage.get({ key: `isUserValidated${email}` });
    return ret.value;
  }

  async setIsAdmin(email: string, val: boolean) {
    await Storage.set({
      key: `isAdmin${email}`,
      value: JSON.stringify({
        email: email,
        value: val
      })
    });
  }

  async getIsAdmin(email: string) {
    const ret = await Storage.get({ key: `isAdmin${email}` });
    return ret.value;
  }

  async setIsStudent(email: string, val: boolean) {
    await Storage.set({
      key: `isStudent${email}`,
      value: JSON.stringify({
        email: email,
        value: val
      })
    });
  }

  async getIsStudent(email: string) {
    const ret = await Storage.get({ key: `isStudent${email}` });
    return ret.value;
  }

  async setLocalUser(user) {
    await Storage.set({
      key: "user",
      value: JSON.stringify({ user })
    });
  }

  async setGodsEyeData(dataKey: string, data) {
    await Storage.set({
      key: dataKey,
      value: JSON.stringify({ data })
    });
  }

  async getGodsEyeData(dataKey: string) {
    const ret = await Storage.get({ key: dataKey });
    return ret.value;
  }

  async deleteGodsEyeData(dataKey: string) {
    await Storage.remove({ key: dataKey });
  }

  async getLocalUser() {
    const ret = await Storage.get({ key: "user" });
    return ret.value;
  }

  async deleteLocalUser() {
    await Storage.remove({ key: "user" });
  }

  async deleteIsAdmin(email: string) {
    await Storage.remove({ key: `isAdmin${email}` });
  }

  async deleteIsStudent(email: string) {
    await Storage.remove({ key: `isStudent${email}` });
  }

  async deleteIsUserValidated(email: string) {
    await Storage.remove({ key: `isUserValidated${email}` });
  }

  async deleteAllLocalUserData(email: string) {
    await this.deleteIsAdmin(email)
      .then(() => {
        this.deleteIsStudent(email).then(() => {
          this.deleteIsUserValidated(email);
        });
      })
      .catch(err => {});
  }
}
