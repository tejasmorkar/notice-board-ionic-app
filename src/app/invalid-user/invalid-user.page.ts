import { Component, OnInit } from "@angular/core";
import {
  MenuController,
  NavController,
  LoadingController
} from "@ionic/angular";
import { LocalStorageService } from "../local-storage.service";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-invalid-user",
  templateUrl: "./invalid-user.page.html",
  styleUrls: ["./invalid-user.page.scss"]
})
export class InvalidUserPage implements OnInit {
  loadedUserEmail: string;

  constructor(
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.localStorageService
      .getLocalUser()
      .then(userData => {
        let localUserData: any = JSON.parse(userData).user;
        this.loadedUserEmail = localUserData.email;
      })
      .catch(err => {});
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  ionViewDidLeave() {
    this.authService.signout();
  }

  async changeAccount() {
    const loader1 = await this.loadingCtrl.create({
      message: "Deleting your data"
    });

    loader1
      .present()
      .then(() => {
        this.authService.signOutFromInvalidatUserPage();
      })
      .then(() => {
        loader1.dismiss();
      })
      .catch(() => {
        this.authService.signout();
      });
  }
}
