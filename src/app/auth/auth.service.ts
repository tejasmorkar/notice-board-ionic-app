import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Platform } from "@ionic/angular";

import { LocalStorageService } from "../local-storage.service";
import { UserService } from "../user.service";
import { UserData } from "../user.model";
import { DataproviderService } from "../dataprovider.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  userAuthStatus: boolean;
  loadedUser: UserData;

  checkUserAuth() {
    this.afAuth.authState.subscribe(data => {
      if (data) {
        this.userAuthStatus = true;
      } else {
        this.userAuthStatus = false;
      }
    });
  }

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService,
    private dataProviderService: DataproviderService,
    private platform: Platform
  ) {}

  get isAuthenticated(): boolean {
    return this.userAuthStatus;
  }

  async signin() {
    let localIsAdmin: boolean;
    let localIsStudent: boolean;
    this.checkUserAuth();
    await this.localStorageService.getLocalUser().then(val => {
      if (val) {
        this.loadedUser = JSON.parse(val).user;
        this.localStorageService
          .getIsUserValidated(this.loadedUser.email)
          .then(ret => {
            if (JSON.parse(ret)) {
              if (JSON.parse(ret).value !== true) {
                this.localStorageService
                  .getIsAdmin(this.loadedUser.email)
                  .then(isAdminVal => {
                    if (isAdminVal) {
                      localIsAdmin = JSON.parse(isAdminVal).value;
                    }
                  })
                  .then(() => {
                    this.localStorageService
                      .getIsStudent(this.loadedUser.email)
                      .then(isStudentVal => {
                        if (isStudentVal) {
                          localIsStudent = JSON.parse(isStudentVal).value;
                        }
                      })
                      .then(() => {
                        if (localIsStudent) {
                          this.router.navigateByUrl("/validate-user");
                        } else if (localIsAdmin) {
                          this.router.navigateByUrl("/validate-admin");
                        } else {
                          this.router.navigateByUrl("/invalid-user");
                        }
                      });
                  })
                  .catch(err => {});
              } else {
                this.router.navigateByUrl("/notices/tabs/all");
              }
            }
          });
      }
    });
  }

  async signOutFromInvalidatUserPage() {
    let localUserEmail = this.afAuth.auth.currentUser.email;
    let localUserUId = this.afAuth.auth.currentUser.uid;
    await this.afAuth.auth.currentUser
      .delete()
      .then(() => {
        this.dataProviderService
          .getCurrentUserData(localUserUId)
          .subscribe(subData => {
            let localUserData: any = subData[0];
            if (localUserData) {
              if (localUserData.docId) {
                this.dataProviderService
                  .deleteCurrentUserData(localUserData.docId)
                  .then(() => {
                    this.localStorageService
                      .deleteLocalUser()
                      .then(() => {
                        this.localStorageService.deleteAllLocalUserData(
                          localUserEmail
                        );
                      })
                      .then(() => {
                        this.signout();
                      });
                  });
              }
            }
          });
      })
      .catch(() => {
        this.signout();
      });
  }

  async signout() {
    await this.afAuth.auth
      .signOut()
      .then(() => {
        this.localStorageService.deleteLocalUser();
      })
      .then(() => {
        this.checkUserAuth();
        this.router.navigateByUrl("/auth");
      })
      .catch(err => {});
  }

  async deleteUser() {
    await this.afAuth.auth.currentUser.delete();
  }
}
