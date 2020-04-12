import { Component, OnInit } from "@angular/core";
import { ToastController } from "@ionic/angular";
@Component({
  selector: "app-notices",
  templateUrl: "./notices.page.html",
  styleUrls: ["./notices.page.scss"]
})
export class NoticesPage implements OnInit {
  constructor(public toastController: ToastController) {}
  async tabsPressed() {
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
  ngOnInit() {}
}
