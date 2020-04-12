import { FormControl } from "@angular/forms";

export class PhoneNoValidator {
  static validPhoneNo(fc: FormControl) {
    let str: string = fc.value.toUpperCase();
    if (str.length === 10 && !isNaN(Number(str))) {
      return null;
    } else {
      return { validPhoneNo: true };
    }
  }
}
