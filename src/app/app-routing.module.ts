import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: "notices", pathMatch: "full" },
  {
    path: "auth",
    loadChildren: "./auth/auth.module#AuthPageModule"
  },
  {
    path: "invalid-user",
    loadChildren: "./invalid-user/invalid-user.module#InvalidUserPageModule"
  },
  {
    path: "validate-user",
    loadChildren: "./validate-user/validate-user.module#ValidateUserPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "validate-admin",
    loadChildren:
      "./validate-admin/validate-admin.module#ValidateAdminPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "notices",
    loadChildren: "./notices/notices.module#NoticesPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "starrednotices",
    loadChildren:
      "./starrednotices/starrednotices.module#StarrednoticesPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "unseennotices",
    loadChildren:
      "./unseennotices/unseennotices.module#UnseennoticesPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "mynotices",
    loadChildren: "./mynotices/mynotices.module#MynoticesPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "about-us",
    loadChildren: "./about-us/about-us.module#AboutUsPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "settings",
    loadChildren: "./settings/settings.module#SettingsPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "feedback",
    loadChildren: "./feedback/feedback.module#FeedbackPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "instantPush",
    loadChildren: "./instant-push/instant-push.module#InstantPushPageModule",
    canLoad: [AuthGuard]
  },
  {
    path: "**",
    redirectTo: "/notices/tabs/all",
    pathMatch: "full",
    canLoad: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
