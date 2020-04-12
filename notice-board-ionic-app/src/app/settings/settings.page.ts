import { Component, OnInit } from "@angular/core";

import { AngularFireAuth } from "@angular/fire/auth";

import { BackPressService } from "../back-press.service";
import { LocalStorageService } from "../local-storage.service";
import { DataproviderService } from "../dataprovider.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"]
})
export class SettingsPage implements OnInit {
  selectUrl;

  constructor(
    private backPressService: BackPressService,
    private afAuth: AngularFireAuth,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.localStorageService.getLocalUser().then(val => {
      let localString: string = JSON.parse(val).user.photoUrl;
      if (localString) {
        this.selectUrl = localString.charAt(localString.length - 5);
      } else {
        this.selectUrl = "0";
      }
    });
  }

  urlSelected = () => {
    let localPhotoUrl = `../assets/icon/photoUrl${this.selectUrl}.png`;

    this.localStorageService
      .getLocalUser()
      .then(val => {
        let localUser: any = JSON.parse(val).user;
        localUser.photoUrl = localPhotoUrl;
        this.localStorageService.setLocalUser(localUser);
      })
      .then(() => {
        this.afAuth.auth.currentUser.updateProfile({
          photoURL: localPhotoUrl
        });
      })
      .catch(err => {});
  };

  ionViewWillEnter() {
    this.backPressService.stopBackPressListener();
  }

  ionViewWillLeave() {
    this.backPressService.startBackPressListener();
  }
}
