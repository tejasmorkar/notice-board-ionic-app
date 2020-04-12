import { FormControl } from "@angular/forms";

export class ErpIdValidator {
  static validErpId(fc: FormControl) {
    if (fc.value.toUpperCase() === "18091011C14390") {
      return { validErpId: true };
    } else {
      return null;
    }
  }
}
