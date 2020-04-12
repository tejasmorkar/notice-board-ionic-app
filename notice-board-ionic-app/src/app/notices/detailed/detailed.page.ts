import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BackPressService } from "../../back-press.service";
import { DataproviderService } from "../../dataprovider.service";
import { Plugins } from "@capacitor/core";

const { Browser } = Plugins;
import {
  NavController,
  ModalController,
  LoadingController
} from "@ionic/angular";
import { ImageModalPage } from "./image-modal/image-modal.page";
import { PDFDocumentProxy } from "ng2-pdf-viewer";
import { LocalStorageService } from "src/app/local-storage.service";

@Component({
  selector: "app-detailed",
  templateUrl: "./detailed.page.html",
  styleUrls: ["./detailed.page.scss"]
})
export class DetailedPage implements OnInit {
  selectedNotice;
  loadedUser;
  loading;
  _loaded: boolean = false;
  zoom: number = 0.5;
  showPDFOptions: boolean = true;
  page = 1;
  max_pages = 2;
  sliderOpts = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true
    }
  };
  constructor(
    private backPressService: BackPressService,
    private dataService: DataproviderService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private localStorageService: LocalStorageService,
    public loadingController: LoadingController
  ) {}
  callBackFn(pdf: PDFDocumentProxy) {
    // do anything with "pdf"
    this.max_pages = pdf.numPages;
    if (this.loading) this.loading.dismiss();
    // console.log(pdf.numPages);
  }
  async _loading() {
    this.loading = await this.loadingController.create({
      message: "Loading notice .."
    });
    await this.loading.present();
  }
  loaded() {
    if (this.loading) this.loading.dismiss();
    this._loaded = true;
  }
  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(ParamMap => {
      if (!ParamMap.has("noticeId")) {
        this.navCtrl.navigateBack("notices/tabs/all");
        return;
      }
      // if (!this._loaded) this._loading();    TODO: loder showing
      this.localStorageService.getLocalUser().then(val => {
        let localUser: any = JSON.parse(val).user;
        this.dataService.getCurrentUserData(localUser.uId).subscribe(data => {
          let localData: any = data[0];
          this.loadedUser = localData;
        });
      });
      this.dataService
        .getNoticeByData(ParamMap.get("noticeId"))
        .subscribe(data => {
          this.selectedNotice = data[0];
          // console.log(this.selectedNotice);
        });
    });
  }
  async onLinkClick(e) {
    await Browser.open({
      toolbarColor: "#3880ff",
      url: e
    });
  }
  onError(error: any) {
    // do anything
  }
  ionViewWillEnter() {
    this.backPressService.stopBackPressListener();
  }

  openPreview = img => {
    this.modalCtrl
      .create({
        component: ImageModalPage,
        componentProps: {
          img: img
        }
      })
      .then(modal => modal.present());
  };
}
