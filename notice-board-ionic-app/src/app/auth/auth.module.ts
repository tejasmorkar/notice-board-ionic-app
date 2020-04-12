import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { AuthPage } from "./auth.page";

import { FirebaseUIModule } from "firebaseui-angular";

const routes: Routes = [
  {
    path: "",
    component: AuthPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FirebaseUIModule
  ],
  declarations: [AuthPage]
})
export class AuthPageModule {}
