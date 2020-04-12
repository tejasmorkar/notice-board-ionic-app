import { Component, OnInit } from "@angular/core";
import { DataproviderService } from "../../dataprovider.service";
import { BackPressService } from "../../back-press.service";

@Component({
  selector: "app-news",
  templateUrl: "./news.page.html",
  styleUrls: ["./news.page.scss"]
})
export class NewsPage implements OnInit {
  notices: unknown[];
  constructor(
    private DataService: DataproviderService,
    private backPressService: BackPressService
  ) {}

  ngOnInit() {
    this.DataService.getCategoryNotices("News").subscribe(d => {
      this.notices = d;
      //console.log(this.notices);
    });
  }

  ionViewDidEnter() {}

  ionViewDidLeave() {}
}
