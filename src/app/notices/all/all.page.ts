import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireFunctions } from "@angular/fire/functions";

import {
  Capacitor,
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed,
  Browser
} from "@capacitor/core";

import { DataproviderService } from "../../dataprovider.service";
import { BackPressService } from "../../back-press.service";
import { LocalStorageService } from "../../local-storage.service";
import { UserData } from "src/app/user.model";
import {
  LoadingController,
  AlertController,
  ToastController
} from "@ionic/angular";
import { Platform } from "@ionic/angular";

import * as firebase from "firebase";

const { PushNotifications } = Plugins;

@Component({
  selector: "app-all",
  templateUrl: "./all.page.html",
  styleUrls: ["./all.page.scss"]
})
export class AllPage implements OnInit {
  notices;
  loadedUser: UserData;
  isAdmin: boolean = false;
  user;
  subscribeArray: Array<string> = [];
  alertIsEnabled: boolean = false;

  constructor(
    public plt: Platform,
    private DataService: DataproviderService,
    private router: Router,
    private backPressService: BackPressService,
    private func: AngularFireFunctions,
    private localStorageService: LocalStorageService,
    private loadingCtrl: LoadingController,
    public alertController: AlertController,
    public toastController: ToastController
  ) {}

  async openEdit(noticeId, title) {
    const alert = await this.alertController.create({
      header: "Confirm Edit",
      message: `The notice <strong>${title}</strong>  will be <b class="delete">Edited<b>`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary"
        },
        {
          text: "Edit",
          handler: () => {
            this.router.navigateByUrl(
              `/notices/tabs/all/editnotice/${noticeId}`
            );
          }
        }
      ]
    });

    await alert.present();
  }
  async delete(title, noticeId, urls, type) {
    const alert = await this.alertController.create({
      header: "Confirm Deletion",
      message: `The notice <strong>${title}</strong>  will be <b class="delete">DELETED<b>`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary"
        },
        {
          text: "Confirm",
          handler: () => {
            if (type === "pdf") this.DataService.deletePDF(noticeId, urls);
            else this.DataService.deleteNotice(noticeId, urls);
            this.presentToast();
          }
        }
      ]
    });

    await alert.present();
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: "Notice Deleted",
      duration: 2000
    });
    toast.present();
  }
  subscribe() {
    PushNotifications.register()
      .then(() => {
        // On succcess, we should be able to receive notifications
        PushNotifications.addListener(
          "registration",
          (token: PushNotificationToken) => {
            this.DataService.setToken(token.value);
            this.subscribeArray.forEach(element => {
              this.func
                .httpsCallable("subscribeToTopic")({
                  token: token.value,
                  topic: element
                })
                .subscribe(d => console.log(d));
              // alert("Push registration success, token: " + token.value);
            });
          }
        );

        // Some issue with our setup and push will not work
        PushNotifications.addListener("registrationError", (error: any) => {
          alert("Error on registration: " + JSON.stringify(error));
        });

        // Show us the notification payload if the app is open on our device
        // PushNotifications.addListener(
        //   "pushNotificationReceived",
        //   (notification: PushNotification) => {
        //     alert("Push received: " + JSON.stringify(notification));
        //   }
        // );

        // // Method called when tapping on a notification
        // PushNotifications.addListener(
        //   "pushNotificationActionPerformed",
        //   (notification: PushNotificationActionPerformed) => {
        //     alert("Push action performed: " + JSON.stringify(notification));
        //   }
        // );
        PushNotifications.createChannel({
          description: "Notice Board Notifications",
          id: "46",
          importance: 1,
          name: "Notice Board",
          visibility: 1
        });
      })
      .catch(err => {
        // console.log(err);
      });
  }

  async showGodsEyeAlert(alertData: any) {
    const alert1 = await this.alertController.create({
      header: alertData.title,
      message: alertData.message,
      buttons: [
        {
          text: alertData.cancelText,
          role: "cancel",
          cssClass: "secondary"
        },
        {
          text: alertData.okText,
          handler: () => {
            if (alertData.okRoute) {
              this.router.navigateByUrl(`${alertData.okRoute}`);
            } else if (alertData.okLink) {
              this.onClickOkLink(alertData.okLink);
            }
          }
        }
      ]
    });

    await alert1.present();
  }

  async onClickOkLink(okLink) {
    await Browser.open({
      toolbarColor: "#3880ff",
      url: okLink
    });
  }

  ngOnInit() {
    let passingAlertData: any;
    this.localStorageService
      .getGodsEyeData(`alert`)
      .then((alertData: any) => {
        if (alertData) {
          passingAlertData = JSON.parse(alertData).data;
          if (passingAlertData.isEnabled) {
            this.alertIsEnabled = true;
          } else {
            this.alertIsEnabled = false;
          }
        }
      })
      .then(() => {
        if (passingAlertData.isEnabled == true) {
          Browser.addListener("browserPageLoaded", (info: any) => {
            // console.log(info);
          });
          Browser.addListener("browserFinished", (info: any) => {
            // console.log(info);
          });
          Browser.prefetch({
            urls: [passingAlertData.okLink]
          });
          this.showGodsEyeAlert(passingAlertData);
        }
      });

    // const loader1 = await this.loadingCtrl.create({
    //   message: "Checking if User is Validated"
    // });

    // loader1.present().then(() => {
    //   this.localStorageService
    //     .getLocalUser()
    //     .then(val => {
    //       this.loadedUser = JSON.parse(val).user;
    //       this.localStorageService
    //         .getIsUserValidated(this.loadedUser.email)
    //         .then(val => {
    //           if (val.value !== "true") {
    //             loader1.dismiss();
    //             this.router.navigateByUrl("/validate-user");
    //           }
    //         });
    //     })
    //     .catch(err => {
    //       loader1.dismiss();
    //       this.router.navigateByUrl("/validate-user");
    //       console.log("err");
    //     });
    // });

    this.localStorageService.getLocalUser().then(userVal => {
      let localUserVal: any = JSON.parse(userVal).user;
      this.DataService.getCurrentUserData(localUserVal.uId).subscribe(data => {
        this.user = data[0];
        if (!this.isAdmin) {
          this.subscribeArray.push(this.user.div);
          this.subscribeArray.push(this.user.div + this.user.batch);
        }
        this.subscribeArray.push("All");
        this.subscribe();
        this.DataService.getNotices().subscribe(d => {
          this.notices = d;
          if (!this.isAdmin) {
            this.notices = this.notices.filter(element => {
              if (
                element.batches.indexOf(this.subscribeArray[0]) !== -1 ||
                element.batches.indexOf(this.subscribeArray[1]) !== -1 ||
                element.batches.indexOf(this.subscribeArray[2]) !== -1
              )
                return true;
            });
          }
          // console.log(d);
        });
      });
      this.localStorageService
        .getIsAdmin(localUserVal.email)
        .then(isAdminVal => {
          let localIsAdminVal: any;
          if (JSON.parse(isAdminVal)) {
            localIsAdminVal = JSON.parse(isAdminVal).value;
          }
          if (localIsAdminVal) {
            //IS ADMIN
            this.isAdmin = true;
            // console.log("admin hu me");
          } else {
            //IS STUDENT
            this.isAdmin = false;
            // console.log("student hu  me");
          }
        });
    });

    // console.log("Initializing HomePage");

    // Register with Apple / Google to receive push via APNS/FCM
  }

  ionViewDidEnter() {}

  ionViewDidLeave() {}

  onNoticeClick = noticeId => {
    this.router.navigateByUrl(`/notices/tabs/all/${noticeId}`);
  };
}
