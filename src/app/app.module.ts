import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxUiLoaderRouterModule, NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION,
  NgxUiLoaderHttpModule, NgxUiLoaderService } from 'ngx-ui-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LanguageListComponent } from './components/language/language-list/language-list.component';
import { NewLanguageComponent } from './components/language/new-language/new-language.component';
import { SingleLanguageComponent } from './components/language/single-language/single-language.component';
import { UpdateLanguageComponent } from './components/language/update-language/update-language.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { BuilderService } from './services/builder.service';
import { TranslateService } from './services/translate.service';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { SharedDataService } from './services/shared-data.service';
import { DefaultGlobalConfig, ToastrModule } from 'ngx-toastr';
import { MainComponent } from './components/main/main.component';
import { HeaderComponent } from './core/header/header.component';
import { AddLanguageModalComponent } from './core/add-language-modal/add-language-modal.component';
import { FormsModule } from '@angular/forms';
import { UpdateLanguageModalComponent } from './core/update-language-modal/update-language-modal.component';






const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsColor: 'red',
  bgsPosition: POSITION.bottomCenter,
  bgsSize: 40,
  bgsType: SPINNER.foldingCube, // background spinner type
  fgsType: SPINNER.pulse, // foreground spinner type
  pbDirection: PB_DIRECTION.rightToLeft, // progress bar direction
  pbThickness: 5 // progress bar thickness
};

@NgModule({
  declarations: [
    AppComponent,
    LanguageListComponent,
    NewLanguageComponent,
    SingleLanguageComponent,
    UpdateLanguageComponent,
    MainComponent,
    HeaderComponent,
    AddLanguageModalComponent,
    UpdateLanguageModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,

    AppRoutingModule,
    BrowserAnimationsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    ToastrModule.forRoot(),
    NgxUiLoaderRouterModule.forRoot({}),
    NgxUiLoaderHttpModule.forRoot({
      showForeground: true,
      maxTime: 5000,
      loaderId: 'loader-01'}),
  ],
  providers: [
    NgxUiLoaderService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true
  },
  BuilderService,
  SharedDataService,
  TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
