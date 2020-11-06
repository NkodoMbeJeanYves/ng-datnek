import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LanguageListComponent } from './components/language/language-list/language-list.component';
import { NewLanguageComponent } from './components/language/new-language/new-language.component';
import { UpdateLanguageComponent } from './components/language/update-language/update-language.component';
import { MainComponent } from './components/main/main.component';


const routes: Routes = [
  { path: '', component: MainComponent},
  { path: 'languages', component: LanguageListComponent},
  { path: 'language/add', component: NewLanguageComponent},
  { path: 'language/update/:laguage', component: UpdateLanguageComponent},
  { path: '**', redirectTo: '', pathMatch: 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
