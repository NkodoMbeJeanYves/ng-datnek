import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LanguageListComponent } from './components/language/language-list/language-list.component';
import { MainComponent } from './components/main/main.component';


const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'languages', component: LanguageListComponent},
  { path: '**', redirectTo: '', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
