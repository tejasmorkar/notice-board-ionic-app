import { Component, OnInit } from "@angular/core";
import {
  LoadingController,
  MenuController,
  ModalController
} from "@ionic/angular";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl
} from "@angular/forms";

import { LocalStorageService } from "../local-storage.service";
import { UserData } from "../user.model";
import { AuthService } from "../auth/auth.service";
import { DataproviderService } from "../dataprovider.service";

import { RollNoValidator } from "./validators/rollNo.validator";
import { PhoneNoValidator } from "./validators/phoneNo.validator";
import { ErpIdValidator } from "./validators/erpId.validator";
import { SlidesComponent } from "../auth/slides/slides.component";

@Component({
  selector: "app-validate-user",
  templateUrl: "./validate-user.page.html",
  styleUrls: ["./validate-user.page.scss"]
})
export class ValidateUserPage implements OnInit {
  loadedUser: UserData;
  loadedUserEmail: string;

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private dataProviderService: DataproviderService,
    private loadingCtrl: LoadingController,
    private menuCtrl: MenuController,
    private modalController: ModalController
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

  onClickHelp() {
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

  errorMessages = {
    rollNo: [
      { type: "required", message: "Roll Number is required" },
      { type: "validRollNo", message: "Invalid Roll No" }
    ],
    erpId: [
      { type: "required", message: "Erp Id is required" },
      { type: "validErpId", message: "Invalid Erp Id" }
    ],
    div: [{ type: "required", message: "Division is required" }],
    batch: [{ type: "required", message: "Batch is required" }],
    phoneNumber: [
      { type: "required", message: "Phone Number is required" },
      { type: "validPhoneNo", message: "Invalid Phone Number" }
    ]
  };

  validateUserForm = new FormGroup({
    rollNo: new FormControl(
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(8),
        RollNoValidator.validRollNo
      ])
    ),
    erpId: new FormControl(
      "",
      Validators.compose([Validators.required, ErpIdValidator.validErpId])
    ),
    div: new FormControl("", Validators.required),
    batch: new FormControl("", Validators.required),
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
