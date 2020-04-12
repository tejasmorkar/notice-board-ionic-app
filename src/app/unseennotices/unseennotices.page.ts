import { Component, OnInit } from "@angular/core";
import { BackPressService } from "../back-press.service";

@Component({
  selector: "app-unseennotices",
  templateUrl: "./unseennotices.page.html",
  styleUrls: ["./unseennotices.page.scss"]
})
export class UnseennoticesPage implements OnInit {
  constructor(private backPressService: BackPressService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.backPressService.stopBackPressListener();
  }

  ionViewWillLeave() {
    this.backPressService.startBackPressListener();
  }
}
