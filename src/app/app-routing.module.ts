import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./_guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./companies/companies.module").then((m) => m.CompaniesModule),
    canActivate: [AuthGuard],
  },
  {
    path: "companies",
    loadChildren: () =>
      import("./companies/companies.module").then((m) => m.CompaniesModule),
    canActivate: [AuthGuard],
  },
  {
    path: "signup",
    loadChildren: () =>
      import("./signup/signup.module").then((m) => m.SignupModule),
  },
  {
    path: "login",
    loadChildren: () =>
      import("./signin/signin.module").then((m) => m.SigninModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
