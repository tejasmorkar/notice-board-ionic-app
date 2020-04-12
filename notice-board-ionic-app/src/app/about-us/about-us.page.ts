import { Component, OnInit } from "@angular/core";
import { Plugins } from "@capacitor/core";

import { BackPressService } from "../back-press.service";

const { Browser } = Plugins;

@Component({
  selector: "app-about-us",
  templateUrl: "./about-us.page.html",
  styleUrls: ["./about-us.page.scss"]
})
export class AboutUsPage implements OnInit {
  constructor(private backPressService: BackPressService) {}

  ngOnInit() {
    Browser.addListener("browserPageLoaded", (info: any) => {
      console.log(info);
    });
    Browser.addListener("browserFinished", (info: any) => {
      console.log(info);
    });
    Browser.prefetch({
      urls: [
        "https://github.com/tejasmorkar",
        "https://github.com/SuyashSonawane"
      ]
    });
  }

  async onClickTejas() {
    await Browser.open({
      toolbarColor: "#3880ff",
      url: "https://github.com/tejasmorkar"
    });
  }

  async onClickSuyash() {
    await Browser.open({
      toolbarColor: "#3880ff",
      url: "https://github.com/SuyashSonawane"
    });
  }

  ionViewWillEnter() {
    this.backPressService.stopBackPressListener();
  }

  ionViewWillLeave() {
    this.backPressService.startBackPressListener();
  }
}
