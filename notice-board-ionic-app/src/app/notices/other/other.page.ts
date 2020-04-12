import { Component, OnInit } from "@angular/core";
import { DataproviderService } from "../../dataprovider.service";
import { BackPressService } from "../../back-press.service";

@Component({
  selector: "app-other",
  templateUrl: "./other.page.html",
  styleUrls: ["./other.page.scss"]
})
export class OtherPage implements OnInit {
  notices: unknown[];
  constructor(
    private DataService: DataproviderService,
    private backPressService: BackPressService
  ) {}

  ngOnInit() {
    this.DataService.getCategoryNotices("Other").subscribe(d => {
      this.notices = d;
      //console.log(this.notices);
    });
  }

  ionViewDidEnter() {}

  ionViewDidLeave() {}
}
