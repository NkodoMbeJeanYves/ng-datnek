import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BuilderService } from 'src/app/services/builder.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { TranslateService } from 'src/app/services/translate.service';
import { environment } from 'src/environments/environment';
import { Language } from '../../../models/language';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.css']
})
export class LanguageListComponent implements OnInit, OnDestroy {
pageTitle = '';
member = 'languages';
dictionarySubscription: Subscription;
dataSubscription: Subscription;

language: Language;
dataList: Language[];
// shar with update component
sharingWithUpdateModalComponent: Language;

  constructor(
              private translateService: TranslateService,
              private bs: BuilderService,
              private sData: SharedDataService,
              private toastr: ToastrService) {
                this.language = new Language();
              }

  ngOnInit(): void {
    this.translateService.start();
    this.dictionarySubscription = this.translateService.getObservableLanguage.subscribe(
      (dico) => {
        console.log(dico);
        const translate = dico as any;
        this.pageTitle = translate[this.member].pageTitle;
      }
    );

    this.language.languageId = '1';
    this.language.languageName = 'English';
    this.language.primaryKey = 'English';

    this.language.readingLevel = 'Intermediate';
    this.language.writingLevel = 'Intermediate';
    this.language.understandingLevel = 'Intermediate';

  }

  // fetch all languages from database
  initialize(): void {
    // define present Model for customizing dataList with primaryKey Field
    // class name
    this.sData.setCurrentModelValue('Language');
    // define endPoint
    this.bs.setEndPoint( environment.BASE_URL + '/languages');
    // fill in dataList via endPoint
    this.bs.fetchAll();
    this.dataSubscription = this.bs.instanceSubject.subscribe(
        (data: Language[])  =>  {
          this.dataList = data;
          console.log(data);
        }
      );
  }

  // set current language within service
  set($lang): void {
    this.translateService.setDictionnaryLanguage($lang);
  }

  // fetch updated language from single language component
  setUpdatedLanguage($event): void {
    console.log($event);
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

}
