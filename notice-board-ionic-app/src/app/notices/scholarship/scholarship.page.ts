import { Component, OnInit } from "@angular/core";
import { DataproviderService } from "../../dataprovider.service";
import { BackPressService } from "../../back-press.service";

@Component({
  selector: "app-scholarship",
  templateUrl: "./scholarship.page.html",
  styleUrls: ["./scholarship.page.scss"]
})
export class ScholarshipPage implements OnInit {
  notices: unknown[];
  constructor(
    private DataService: DataproviderService,
    private backPressService: BackPressService
  ) {}
  ngOnInit() {
    this.DataService.getCategoryNotices("Scholarship").subscribe(d => {
      this.notices = d;
      //console.log(this.notices);
    });
  }

  ionViewDidEnter() {}

  ionViewDidLeave() {}
}
