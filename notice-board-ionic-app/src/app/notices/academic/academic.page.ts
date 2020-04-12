import { Component, OnInit } from "@angular/core";
import { DataproviderService } from "../../dataprovider.service";
import { BackPressService } from "../../back-press.service";

@Component({
  selector: "app-academic",
  templateUrl: "./academic.page.html",
  styleUrls: ["./academic.page.scss"]
})
export class AcademicPage implements OnInit {
  notices: any;

  constructor(
    private DataService: DataproviderService,
    private backPressService: BackPressService
  ) {}

  ngOnInit() {
    this.DataService.getCategoryNotices("Academics").subscribe(d => {
      this.notices = d;
      //console.log(this.notices);
    });
  }

  ionViewDidEnter() {}

  ionViewDidLeave() {}
}
