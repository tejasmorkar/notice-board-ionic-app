import { Component, OnInit, ViewChild } from "@angular/core";

import { IonSlides, ModalController } from "@ionic/angular";

@Component({
  selector: "app-slides",
  templateUrl: "./slides.component.html",
  styleUrls: ["./slides.component.scss"]
})
export class SlidesComponent implements OnInit {
  @ViewChild("slides") slides: IonSlides;

  constructor(private modalCtrl: ModalController) {}

  slideOpts = {
    slidesPerView: 1,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true,
      stopOnLastSlide: true
    }
  };

  ngOnInit() {}

  onNext() {
    this.slides.slideNext();
  }

  onPrev() {
    this.slides.slidePrev();
  }

  onFinish() {
    this.modalCtrl.dismiss(true, "confirm");
  }
}
