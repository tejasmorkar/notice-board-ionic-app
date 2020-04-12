import { Component, OnInit } from "@angular/core";
import { Plugins } from "@capacitor/core";

import { BackPressService } from "../back-press.service";

const { Browser } = Plugins;

@Component({
  selector: "app-feedback",
  templateUrl: "./feedback.page.html",
  styleUrls: ["./feedback.page.scss"]
})
export class FeedbackPage implements OnInit {
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
        "https://docs.google.com/forms/d/e/1FAIpQLSd5WwnQPrPSe2LW4Sd-_bUhfKcsxeNvocxjuH-2n7fljqlv0g/viewform?usp=sf_link"
      ]
    });
  }

  async onClickFeedback() {
    await Browser.open({
      toolbarColor: "#3880ff",
      url:
        "https://docs.google.com/forms/d/e/1FAIpQLSd5WwnQPrPSe2LW4Sd-_bUhfKcsxeNvocxjuH-2n7fljqlv0g/viewform?usp=sf_link"
    });
  }

  ionViewWillEnter() {
    this.backPressService.stopBackPressListener();
  }

  ionViewWillLeave() {
    this.backPressService.startBackPressListener();
  }
}
