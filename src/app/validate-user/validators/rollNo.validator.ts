import { FormControl } from "@angular/forms";

export class RollNoValidator {
  static validRollNo(fc: FormControl) {
    let str: string = fc.value.toUpperCase();

    for (let index = 0; index < 6; index++) {
      if (str[index]) {
        let element = str[index];
      }
    }

    if (false) {
      return { validRollNo: true };
    } else {
      return null;
    }
  }
}
