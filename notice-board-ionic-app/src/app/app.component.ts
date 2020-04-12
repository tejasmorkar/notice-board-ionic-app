import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Platform, ToastController } from "@ionic/angular";
import {
  Capacitor,
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from "@capacitor/core";
import { AuthService } from "./auth/auth.service";
import { UserService } from "./user.service";
import { UserData } from "./user.model";
import { DataproviderService } from "./dataprovider.service";
import { LocalStorageService } from "./local-storage.service";
import { doesNotReject } from "assert";

// Capacitor plugins

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent implements OnInit {
  loadedUser: UserData;
  isLoadedUserAdmin: boolean = false;
  userPhotoUrl;
  isFeedbackEnabled: boolean = false;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private DataService: DataproviderService,
    private localStorageService: LocalStorageService,
    public toastController: ToastController
  ) {
    this.initializeApp();
  }
  async disabledPressed() {
    const toast = await this.toastController.create({
      message: "Features coming soon!",
      duration: 3000,
      buttons: [
        {
          text: "OK",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    toast.present();
  }

  ngOnInit() {
    // console.log(`ngOnInit App`);
    this.DataService.getGodsEyeObject(`feedback`).subscribe(feedBackData => {
      let localFeedbackData: any = feedBackData[0];
      this.localStorageService.setGodsEyeData(`feedback`, localFeedbackData);
    });

    this.DataService.getGodsEyeObject(`alert`).subscribe(alertData => {
      let localAlertData: any = alertData[0];
      this.localStorageService.setGodsEyeData("alert", localAlertData);
    });
  }

  openMenu() {
    this.localStorageService
      .getLocalUser()
      .then(val => {
        this.loadedUser = JSON.parse(val).user;
        this.userPhotoUrl = this.loadedUser.photoUrl;
        if (this.userPhotoUrl == null) {
          // Icon made by https://www.flaticon.com/authors/eucalyp from http://www.flaticon.com/
          this.userPhotoUrl = "../assets/icon/photoUrl0.png";
        }
      })
      .then(() => {
        this.localStorageService
          .getIsAdmin(this.loadedUser.email)
          .then(isAdminVal => {
            if (isAdminVal) {
              let localIsAdminVal: any = JSON.parse(isAdminVal).value;
              if (localIsAdminVal) {
                this.isLoadedUserAdmin = true;
              } else {
                this.isLoadedUserAdmin = false;
              }
            }
          });
      })
      .then(() => {
        this.localStorageService
          .getGodsEyeData(`feedback`)
          .then(feedBackData => {
            let localGodsEyeDataVal: any = JSON.parse(feedBackData);
            if (localGodsEyeDataVal) {
              let isEnabled: boolean = localGodsEyeDataVal.data.isEnabled;
              if (isEnabled) {
                this.isFeedbackEnabled = true;
              } else {
                this.isFeedbackEnabled = false;
              }
            }
          });
      })
      .catch(err => {
        this.loadedUser = {
          displayName: "John Doe",
          email: "johndoe@doe.com",
          uId: "johndoeuid1234567890",
          creationTime: "Tue 2019",
          lastSignInTime: "Wed 2019"
        };
        this.userPhotoUrl = "../assets/icon/photoUrl0.png";
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable("SplashScreen")) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  onSignout() {
    this.authService.signout();
    this.router.navigate(["/auth"]);
  }
}
