import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {
  PickerController,
  ToastController,
  NavController
} from "@ionic/angular";
import { DataproviderService } from "../dataprovider.service";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

import {
  Capacitor,
  Plugins,
  CameraSource,
  CameraResultType,
  Filesystem
} from "@capacitor/core";
import * as firebase from "firebase";
import { BackPressService } from "../back-press.service";
import { LocalStorageService } from "../local-storage.service";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";

@Component({
  selector: "app-mynotices",
  templateUrl: "./mynotices.page.html",
  styleUrls: ["./mynotices.page.scss"]
})
export class MynoticesPage implements OnInit {
  @ViewChild("fileInput") fileInput: ElementRef<HTMLElement>;
  selectedImage: string;
  url;
  public images: Array<string> = [];
  public urls: Array<string> = [];
  counter: number;
  fileContent: any;
  fileType: string = null;
  currentUser;

  divBatches = [];
  uniqueDivBatches = [];
  isAll: boolean;

  constructor(
    private pickerController: PickerController,
    private DataService: DataproviderService,
    private router: Router,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private backPressService: BackPressService,
    private localStorageService: LocalStorageService,
    public toastController: ToastController,
    private navCtrl: NavController
  ) {}

  ionViewWillEnter() {
    console.log("mynoice");
    this.backPressService.stopBackPressListener();
  }

  ionViewWillLeave() {
    this.backPressService.startBackPressListener();
  }

  async presentToastWithOptions() {
    const toast = await this.toastController.create({
      message: "Should be less than 5Mb",
      buttons: [
        {
          text: "OK",
          handler: () => {
            let el: HTMLElement = this.fileInput.nativeElement;
            el.click();
          }
        }
      ]
    });
    toast.present();
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      let size = file.size;
      // console.log(size);
      if (size > 5000000) {
        this.presentToastWithOptions();
      } else {
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.fileContent = reader.result;
        };
      }
    }
  }

  errorMessages = {
    title: [
      { type: "required", message: "Title is required" },
      { type: "maxlength", message: "Should be less than 30 characters" }
    ],
    body: [{ type: "required", message: "Notice Body is required" }],
    category: [{ type: "required", message: "Category is required" }],
    divBatches: [
      { type: "required", message: "Atleast one batch must be selected!" }
    ]
  };

  addNoticeForm = new FormGroup({
    title: new FormControl(
      "",
      Validators.compose([Validators.required, Validators.maxLength(30)])
    ),
    body: new FormControl("", Validators.required),
    link: new FormControl(""),
    category: new FormControl("", Validators.required),
    // divBatches: new FormControl(""),
    fileType: new FormControl("", Validators.required)
  });

  onFileTypeChange() {
    this.fileType = this.addNoticeForm.value.fileType;
  }

  link = this.addNoticeForm.value.link;

  onAllChange(event, a, b, c, d, e, f, g, h, i, j, k, l, m) {
    if (event.detail.checked) {
      a.checked = b.checked = c.checked = d.checked = e.checked = f.checked = g.checked = h.checked = i.checked = j.checked = k.checked = l.checked = m.checked = true;
      this.isAll = true;
      this.uniqueDivBatches = [`All`];
    } else {
      a.checked = b.checked = c.checked = d.checked = e.checked = f.checked = g.checked = h.checked = i.checked = j.checked = k.checked = l.checked = m.checked = false;
      this.isAll = false;
      this.uniqueDivBatches.splice(this.uniqueDivBatches.indexOf(`All`), 1);
    }
  }

  onDivChange = (event, div1, div2, div3, all) => {
    if (event.detail.checked) {
      div1.checked = true;
      div2.checked = true;
      div3.checked = true;
      this.divBatches.push(div1.el.name, div2.el.name, div3.el.name);
    } else {
      div1.checked = false;
      div2.checked = false;
      div3.checked = false;
      all.checked = false;
      this.divBatches = this.divBatches.filter(item => item !== div1.el.name);
      this.divBatches = this.divBatches.filter(item => item !== div2.el.name);
      this.divBatches = this.divBatches.filter(item => item !== div3.el.name);
    }
  };

  onSubDivChange = (event, div, div1, div2) => {
    if (!event.detail.checked) {
      div.checked = false;
      this.divBatches = this.divBatches.filter(
        item => item !== event.target.name
      );
    } else {
      if (div1.checked && div2.checked) {
        div.checked = true;
      } else {
        this.divBatches.push(event.target.name);
      }
    }
  };

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  getUnique(array) {
    var uniqueArray = [];

    // Loop through array values
    for (var value of array) {
      if (uniqueArray.indexOf(value) === -1) {
        uniqueArray.push(value);
      }
    }
    this.uniqueDivBatches = uniqueArray;
    let localList = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M"
    ];

    for (var item of localList) {
      if (
        this.uniqueDivBatches.includes(`${item}1`) &&
        this.uniqueDivBatches.includes(`${item}2`) &&
        this.uniqueDivBatches.includes(`${item}3`)
      ) {
        this.uniqueDivBatches.splice(
          this.uniqueDivBatches.indexOf(`${item}1`),
          1
        );
        this.uniqueDivBatches.splice(
          this.uniqueDivBatches.indexOf(`${item}2`),
          1
        );
        this.uniqueDivBatches.splice(
          this.uniqueDivBatches.indexOf(`${item}3`),
          1
        );
        this.uniqueDivBatches.push(`${item}`);
      }
      if (
        this.uniqueDivBatches.includes(`A`) &&
        this.uniqueDivBatches.includes(`B`) &&
        this.uniqueDivBatches.includes(`C`) &&
        this.uniqueDivBatches.includes(`D`) &&
        this.uniqueDivBatches.includes(`E`) &&
        this.uniqueDivBatches.includes(`F`) &&
        this.uniqueDivBatches.includes(`G`) &&
        this.uniqueDivBatches.includes(`H`) &&
        this.uniqueDivBatches.includes(`I`) &&
        this.uniqueDivBatches.includes(`J`) &&
        this.uniqueDivBatches.includes(`K`) &&
        this.uniqueDivBatches.includes(`L`) &&
        this.uniqueDivBatches.includes(`M`)
      ) {
        this.uniqueDivBatches = [`All`];
      }
      if (this.isAll) {
        this.uniqueDivBatches = [`All`];
      }
    }
  }
  imageUpload() {
    let image = this.images[this.counter];
    if (this.counter < this.images.length)
      firebase
        .storage()
        .ref(`noticeImages/`)
        .child(this.afs.createId())
        .putString(image, "data_url")
        .then(snap => {
          snap.ref.getDownloadURL().then(url => {
            this.urls.push(url);
            this.counter++;
            this.toastController
              .create({
                message: `Uploaded file ${this.counter} of ${this.images.length} `,
                duration: 1000
              })
              .then(e => e.present());
            if (this.counter === this.images.length) {
              // console.log(this.uniqueDivBatches);
              this.DataService.addNotice(
                this.addNoticeForm.value.title,
                this.addNoticeForm.value.body,
                this.uniqueDivBatches,
                this.addNoticeForm.value.category,
                this.urls,
                "image",
                this.currentUser.displayName,
                this.addNoticeForm.value.link
              );
              this.loading.dismiss();
              this.router.navigate(["/"]);
            }
            this.imageUpload();
          });
        });
  }
  loading;
  async onSubmit() {
    console.log(this.addNoticeForm.value.link);
    if (this.divBatches.length === 0) {
      this.presentToast(`Atleast one batch must be selected!`);
    } else {
      this.getUnique(this.divBatches);
      this.loading = await this.loadingController.create({
        message: "Uploading Notice  .."
      });
      await this.loading.present();
      if (this.addNoticeForm.value.fileType === "i") {
        this.counter = 0;
        this.imageUpload();
      }
      if (this.addNoticeForm.value.fileType === "t") {
        this.DataService.addNotice(
          this.addNoticeForm.value.title,
          this.addNoticeForm.value.body,
          this.uniqueDivBatches,
          this.addNoticeForm.value.category,
          null,
          "text",
          this.currentUser.displayName,
          this.addNoticeForm.value.link
        );
        this.loading.dismiss();
        this.router.navigate(["/"]);
      }
      if (this.addNoticeForm.value.fileType === "p") {
        firebase
          .storage()
          .ref(`pdf/${this.afs.createId()}`)
          .putString(this.fileContent, "data_url")
          .then(snap => {
            snap.ref.getDownloadURL().then(url => {
              this.DataService.addNotice(
                this.addNoticeForm.value.title,
                this.addNoticeForm.value.body,
                this.uniqueDivBatches,
                this.addNoticeForm.value.category,
                url,
                "pdf",
                this.currentUser.displayName,
                this.addNoticeForm.value.link
              );
              this.loading.dismiss();
              this.router.navigate(["/"]);
            });
          });
      }
    }
  }

  takePhoto() {
    if (Capacitor.isPluginAvailable("Camera")) {
      Plugins.Camera.getPhoto({
        quality: 20,
        source: CameraSource.Prompt,
        resultType: CameraResultType.DataUrl
      })
        .then(image => {
          this.selectedImage = image.dataUrl;
          this.images.push(image.dataUrl);
        })
        .catch(err => console.log(err));
    }
  }
  async remove(index: number) {
    const alert = await this.alertController.create({
      header: "Alert",
      subHeader: "Delete Alert",
      message: "Are you sure to delete the image",
      buttons: [
        {
          text: "Yes",
          handler: () => {
            if (index > -1) {
              this.images.splice(index, 1);
            }
          }
        },
        {
          text: "No"
        }
      ]
    });
    await alert.present();
  }

  ngOnInit() {
    this.localStorageService
      .getLocalUser()
      .then(val => {
        this.currentUser = JSON.parse(val).user;
        if (this.currentUser) {
          this.localStorageService
            .getIsAdmin(this.currentUser.email)
            .then(adminVal => {
              let localIsAdmin: any = JSON.parse(adminVal).value;
              if (localIsAdmin == false) {
                this.navCtrl.navigateBack("/notices/tabs/all");
              }
            });
        }
      })
      .catch(() => {});
  }
}
