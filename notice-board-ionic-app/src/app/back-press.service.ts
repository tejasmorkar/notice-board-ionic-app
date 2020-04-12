import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";

@Injectable({
  providedIn: "root"
})
export class BackPressService {
  backButtonSubscription;

  constructor(private platform: Platform) {}

  startBackPressListener() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      navigator["app"].exitApp();
    });
  }

  stopBackPressListener() {
    this.backButtonSubscription.unsubscribe();
  }
}
