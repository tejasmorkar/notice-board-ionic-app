import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { ValidateAdminPage } from "./validate-admin.page";

const routes: Routes = [
  {
    path: "",
    component: ValidateAdminPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ValidateAdminPage]
})
export class ValidateAdminPageModule {}
