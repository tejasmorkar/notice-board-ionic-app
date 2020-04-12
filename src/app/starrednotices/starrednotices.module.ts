import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StarrednoticesPage } from './starrednotices.page';

const routes: Routes = [
  {
    path: '',
    component: StarrednoticesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StarrednoticesPage]
})
export class StarrednoticesPageModule {}
