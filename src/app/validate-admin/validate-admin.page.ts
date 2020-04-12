import { Component, OnInit } from "@angular/core";
import { LoadingController, MenuController } from "@ionic/angular";

import { FormGroup, FormControl, Validators } from "@angular/forms";

import { LocalStorageService } from "../local-storage.service";
import { AuthService } from "../auth/auth.service";
import { DataproviderService } from "../dataprovider.service";
import { UserData } from "../user.model";

import { PhoneNoValidator } from "./validators/phoneNo.validator";
import { ErpIdValidator } from "./validators/erpId.validator";

@Component({
  selector: "app-validate-admin",
  templateUrl: "./validate-admin.page.html",
  styleUrls: ["./validate-admin.page.scss"]
})
export class ValidateAdminPage implements OnInit {
  loadedUser: UserData;
  loadedUserEmail: string;

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private dataProviderService: DataproviderService,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.localStorageService
      .getLocalUser()
      .then(userData => {
        if (userData) {
          let localUserData = JSON.parse(userData).user;
          if (localUserData) {
            this.loadedUserEmail = localUserData.email;
          }
        }
      })
      .catch(err => {});
  }

  errorMessages = {
    erpId: [
      { type: "required", message: "Erp Id is required" },
      { type: "validErpId", message: "Invalid Erp Id" }
    ],
    phoneNumber: [
      { type: "required", message: "Phone Number is required" },
      { type: "validPhoneNo", message: "Invalid Phone Number" }
    ]
  };

  validateUserForm = new FormGroup({
    erpId: new FormControl(
      "",
      Validators.compose([Validators.required, ErpIdValidator.validErpId])
    ),
    phoneNumber: new FormControl(
      "",
      Validators.compose([Validators.required, PhoneNoValidator.validPhoneNo])
    )
  });

  changeAccount() {
    this.authService.signout();
  }

  async onSubmit() {
    const loader1 = await this.loadingCtrl.create({
      message: "Authenticating User"
    });
    loader1
      .present()
      .then(() => {
        this.localStorageService
          .getLocalUser()
          .then(val => {
            this.loadedUser = JSON.parse(val).user;
            this.localStorageService.setIsUserValidated(
              this.loadedUser.email,
              true
            );
          })
          .then(() => {
            this.dataProviderService
              .getCurrentUserData(this.loadedUser.uId)
              .subscribe(data => {
                let localData: any = data[0];
                if (localData) {
                  this.validateUserForm.value.isUserValidated = true;
                  this.dataProviderService.updateUser(
                    this.validateUserForm.value,
                    localData.docId
                  );
                }
              });
          });
      })
      .then(() => {
        loader1.dismiss();
        this.authService.signin();
      })
      .catch(err => {
        loader1.dismiss();
      });
  }
}
