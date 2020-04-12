import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Plugins } from "@capacitor/core";

import {
  MenuController,
  LoadingController,
  ModalController
} from "@ionic/angular";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  FirebaseUISignInSuccessWithAuthResult,
  FirebaseUISignInFailure
} from "firebaseui-angular";

import { Subscription } from "rxjs";

import { BackPressService } from "../back-press.service";
import { AuthService } from "./auth.service";
import { UserData } from "../user.model";
import { UserService } from "../user.service";
import { LocalStorageService } from "../local-storage.service";
import { DataproviderService } from "../dataprovider.service";
import { SlidesComponent } from "./slides/slides.component";

const { Storage } = Plugins;

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"]
})
export class AuthPage implements OnInit {
  showUserSignupForm = false;
  isUserValidated = false;
  isNewUser: boolean;
  subscription1: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;
  subscription4: Subscription;
  subscription5: Subscription;
  subscription6: Subscription;
  subscription7: Subscription;

  constructor(
    private menuCtrl: MenuController,
    private backPressService: BackPressService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private dataProviderService: DataproviderService,
    private modalController: ModalController
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);

    this.localStorageService.getDidSeeSlides().then(val => {
      let localDidSeeSlidesData: any = JSON.parse(val);
      if (localDidSeeSlidesData) {
        if (localDidSeeSlidesData.value == true) {
          //Do Nothing
        } else {
          this.modalController
            .create({
              component: SlidesComponent
            })
            .then(modalEl => {
              modalEl.present();
              return modalEl.onDidDismiss();
            })
            .then(resultData => {
              this.localStorageService.setDidSeeSlides(
                resultData.role,
                resultData.data
              );
            });
        }
      } else {
        this.modalController
          .create({
            component: SlidesComponent
          })
          .then(modalEl => {
            modalEl.present();
            return modalEl.onDidDismiss();
          })
          .then(resultData => {
            this.localStorageService.setDidSeeSlides(
              resultData.role,
              resultData.data
            );
          });
      }
    });
  }

  ionViewDidEnter() {
    this.backPressService.startBackPressListener();
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  async ngOnInit() {
    const loader1 = await this.loadingCtrl.create({
      message: "Authenticating User"
    });

    loader1.present().then(() => {
      this.localStorageService
        .getLocalUser()
        .then(user => {
          if (user) {
            this.authService.signin();
            loader1.dismiss();
          }
        })
        .then(() => {
          this.subscription1 = this.afAuth.authState.subscribe(user => {
            if (user) {
              const localUser: UserData = {
                displayName: user.displayName,
                email: user.email,
                uId: user.uid,
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime,
                phoneNumber: user.phoneNumber,
                photoUrl: user.photoURL
              };
              this.localStorageService.setLocalUser(localUser).then(() => {
                this.subscription2 = this.dataProviderService
                  .getCurrentUserData(localUser.uId)
                  .subscribe(data => {
                    let localData: any = data[0];
                    if (localData) {
                      this.localStorageService
                        .setIsUserValidated(
                          localData.email,
                          localData.isUserValidated
                        )
                        .then(() => {
                          this.dataProviderService
                            .getIsAllowAdmin(user.email)
                            .subscribe(dataAdmin => {
                              let localAllowAdminData: any = dataAdmin[0];
                              if (localAllowAdminData) {
                                this.localStorageService.setIsAdmin(
                                  user.email,
                                  true
                                );
                              } else {
                                this.localStorageService.setIsAdmin(
                                  user.email,
                                  false
                                );
                              }
                              this.dataProviderService
                                .getIsAllowStudents(user.email)
                                .subscribe(dataStudent => {
                                  let localAllowStudentData: any =
                                    dataStudent[0];
                                  if (localAllowStudentData) {
                                    this.localStorageService.setIsStudent(
                                      user.email,
                                      true
                                    );
                                  } else {
                                    this.localStorageService.setIsStudent(
                                      user.email,
                                      false
                                    );
                                  }
                                });
                            });
                        })
                        .then(() => {
                          loader1.dismiss();
                          this.authService.signin();
                        });
                    } else {
                      loader1.dismiss();
                    }
                  });
              });
            } else {
              loader1.dismiss();
            }
          });
        })
        .catch(err => {
          this.afAuth.authState.subscribe(user => {
            if (user) {
              this.authService.signin();
              loader1.dismiss();
            } else {
              loader1.dismiss();
            }
          });
        });
    });
  }

  async successCallback(
    signInSuccessData: FirebaseUISignInSuccessWithAuthResult
  ) {
    let user = signInSuccessData.authResult.user;
    let localUser: UserData;

    if (signInSuccessData.authResult.additionalUserInfo.isNewUser) {
      this.isNewUser = true;

      const loader2 = await this.loadingCtrl.create({
        message: "Authenticating User"
      });

      loader2.present().then(() => {
        this.dataProviderService
          .getIsAllowAdmin(user.email)
          .subscribe(dataAdmin => {
            let localAllowAdminData: any = dataAdmin[0];
            if (localAllowAdminData) {
              this.localStorageService.setIsAdmin(user.email, true);
            } else {
              this.localStorageService.setIsAdmin(user.email, false);
            }
            this.subscription4 = this.dataProviderService
              .getIsAllowStudents(user.email)
              .subscribe(dataStudent => {
                let localAllowStudentData: any = dataStudent[0];
                if (localAllowStudentData) {
                  this.localStorageService.setIsStudent(user.email, true);
                } else {
                  this.localStorageService.setIsStudent(user.email, false);
                }

                localUser = {
                  displayName: user.displayName,
                  email: user.email,
                  uId: user.uid,
                  creationTime: user.metadata.creationTime,
                  lastSignInTime: user.metadata.lastSignInTime,
                  phoneNumber: user.phoneNumber
                };

                this.localStorageService
                  .setLocalUser(localUser)
                  .then(() => {
                    loader2.dismiss();
                    this.authService.checkUserAuth();
                    this.localStorageService.setIsUserValidated(
                      signInSuccessData.authResult.user.email,
                      false
                    );
                  })
                  .then(() => {
                    this.dataProviderService.addUser(localUser).then(docId => {
                      if (docId) {
                        this.dataProviderService
                          .updateUser({ isUserValidated: false }, docId)
                          .then(val => {
                            // console.log("user updated");
                            loader2.dismiss();
                            this.authService.signin();
                          });
                      }
                    });
                  });
              });
          });
      });
    } else {
      console.log("Not new user after success callback");

      const loader3 = await this.loadingCtrl.create({
        message: "Authenticating User"
      });

      loader3.present().then(() => {
        this.subscription5 = this.dataProviderService
          .getIsAllowAdmin(user.email)
          .subscribe(dataAdmin => {
            let localAllowAdminData: any = dataAdmin[0];
            if (localAllowAdminData) {
              this.localStorageService.setIsAdmin(user.email, true);
            } else {
              this.localStorageService.setIsAdmin(user.email, false);
            }
            this.subscription6 = this.dataProviderService
              .getIsAllowStudents(user.email)
              .subscribe(dataStudent => {
                let localAllowStudentData: any = dataStudent[0];
                if (localAllowStudentData) {
                  this.localStorageService.setIsStudent(user.email, true);
                } else {
                  this.localStorageService.setIsStudent(user.email, false);
                }

                this.isNewUser = false;
                localUser = {
                  displayName: user.displayName,
                  email: user.email,
                  uId: user.uid,
                  creationTime: user.metadata.creationTime,
                  lastSignInTime: user.metadata.lastSignInTime,
                  phoneNumber: user.phoneNumber,
                  photoUrl: user.photoURL
                };

                this.localStorageService
                  .setLocalUser(localUser)
                  .then(() => {
                    this.authService.checkUserAuth();

                    this.subscription7 = this.dataProviderService
                      .getCurrentUserData(localUser.uId)
                      .subscribe(data => {
                        let localData: any = data[0];
                        // console.log(data[0]);
                        if (localData) {
                          this.localStorageService
                            .setIsUserValidated(
                              localData.email,
                              localData.isUserValidated
                            )
                            .then(() => {
                              // console.log(`not new user ${localData.isUserValidated}`);
                              loader3.dismiss();
                              this.authService.signin();
                            });
                        } else {
                          // console.log("How?");
                          loader3.dismiss();
                          // this.authService.deleteUser();
                          this.authService.signout();
                        }
                      });
                  })
                  .catch(err => {});
              });
          });
      });
    }
  }

  ionViewDidLeave() {}

  errorCallback(errorData: FirebaseUISignInFailure) {}
}
