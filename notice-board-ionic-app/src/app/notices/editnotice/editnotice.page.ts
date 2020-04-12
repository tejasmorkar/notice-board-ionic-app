import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { DataproviderService } from "../../dataprovider.service";
import { BackPressService } from "../../back-press.service";

@Component({
  selector: "app-editnotice",
  templateUrl: "./editnotice.page.html",
  styleUrls: ["./editnotice.page.scss"]
})
export class EditnoticePage implements OnInit {
  selectedNotice;

  constructor(
    private dataProviderService: DataproviderService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private backPressService: BackPressService
  ) {}

  errorMessages = {
    title: [
      { type: "required", message: "Title is required" },
      { type: "maxlength", message: "Should be less than 30 characters" }
    ],
    body: [{ type: "required", message: "Notice Body is required" }],
    category: [{ type: "required", message: "Category is required" }]
  };

  editNoticeForm = new FormGroup({
    title: new FormControl(
      "",
      Validators.compose([Validators.required, Validators.maxLength(30)])
    ),
    body: new FormControl("", Validators.required),
    category: new FormControl("", Validators.required)
  });

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(ParamMap => {
      if (!ParamMap.has("noticeId")) {
        this.navCtrl.navigateBack("notices/tabs/all");
        return;
      }
      this.dataProviderService
        .getNoticeByData(ParamMap.get("noticeId"))
        .subscribe(data => {
          this.selectedNotice = data[0];
          // console.log(this.selectedNotice);
          this.editNoticeForm.setValue({
            title: this.selectedNotice.title,
            body: this.selectedNotice.body,
            category: this.selectedNotice.category
          });
        });
    });
  }

  ionViewWillEnter() {
    this.backPressService.stopBackPressListener();
  }

  onSubmit() {
    this.editNoticeForm.value.update_ts = Date.now();
    // console.log(this.editNoticeForm.value);
    this.dataProviderService
      .updateNotice(this.editNoticeForm.value, this.selectedNotice.noticeId)
      .then(() => {
        this.navCtrl.navigateBack("/notices/tabs/all");
      });
  }
}
