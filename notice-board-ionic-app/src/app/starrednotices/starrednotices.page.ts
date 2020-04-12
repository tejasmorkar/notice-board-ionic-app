import { Component, OnInit } from "@angular/core";

import { BackPressService } from "../back-press.service";

@Component({
  selector: "app-starrednotices",
  templateUrl: "./starrednotices.page.html",
  styleUrls: ["./starrednotices.page.scss"]
})
export class StarrednoticesPage implements OnInit {
  constructor(private backPressService: BackPressService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.backPressService.stopBackPressListener();
  }

  ionViewWillLeave() {
    this.backPressService.startBackPressListener();
  }
}
