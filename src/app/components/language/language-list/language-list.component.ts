import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BuilderService } from 'src/app/services/builder.service';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { LanguageService } from '../language.service';
import { environment } from 'src/environments/environment';
import { Language } from '../../../models/language';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.css']
})
export class LanguageListComponent implements OnInit, OnDestroy {
pageTitle = '';

// define the name of parent component for retrieve its translation in language service
member = 'languages';
dictionarySubscription: Subscription;
dataSubscription: Subscription;

language: Language;
dataList: Language[];
// shar with update component
sharingWithUpdateModalComponent: Language;

readingLabel = '';
writingLabel = '';
understandingLabel = '';

addNewlanguageTranslateObject = {};
updatelanguageTranslateObject = {};
count = 0;

private dictionary;
  constructor(
              private languageService: LanguageService,
              private bs: BuilderService,
              private sData: SharedDataService,
              private http: HttpClient,
              private toastr: ToastrService) {
                this.language = new Language();
              }

  ngOnInit(): void {
    this.languageService.start();
    this.dictionarySubscription = this.languageService.getObservableLanguage.subscribe(
      (dictionary) => {
        const translate = dictionary as any;

        // apply language changes over components
        this.applyLanguageTranslationOverComponents(translate);

      }
    );

    this.initialize();

  }


  // fetch all languages from database
  initialize(): void {
    // define present Model for customizing dataList with primaryKey Field
    // class name
    this.sData.setCurrentModelValue('Language');
    // define endPoint
    this.bs.setEndPoint( environment.BASE_URL + '/language');
    // fill in dataList via endPoint
    this.bs.fetchAll();
    this.dataSubscription = this.bs.instanceSubject.subscribe(
        (data)  =>  {
          this.dataList = this.translateData(data as any);
          this.count = data.length ?? 0;
        }
      );
  }

  // set current language within service
  set($lang): void {
    if ($lang === 'spa' || $lang === 'eng' || $lang === 'fra') {
      this.languageService.setDictionnaryLanguage($lang);
      this.bs.reloadPage('/languages');
    } else {
      this.toastr.warning('Dictionary is not available yet!', 'Translation Setting');
    }
  }

  // fetch updated language from single language component
  setUpdatedLanguage($event): void {
    this.language = $event;
  }

  ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }


  /**
   * Apply language after fetching data
   */
  translateData(data: []): any[] {
    const Data = data.map((item: Language) => {
      item.readingLevel = this.dictionary.members[item.readingLevel];
      item.writingLevel = this.dictionary.members[item.writingLevel];
      item.understandingLevel = this.dictionary.members[item.understandingLevel];
      return item;
    });
    return Data;
  }

  applyLanguageTranslationOverComponents(translate): void {
    // listening then translate components
    // we use this to translate fetching data
        this.dictionary = translate;
        // pageTitle
        this.pageTitle = translate[this.member].pageTitle;

        // sigle-language-component
        this.readingLabel = translate.singleLanguage.readingLabel;
        this.writingLabel = translate.singleLanguage.writingLabel;
        this.understandingLabel = translate.singleLanguage.understandingLabel;

        // modal add new language
        const addModal = translate.addModal;
        this.addNewlanguageTranslateObject = {
          addNewLanguageLabel: addModal.addNewLanguageLabel,
          members: translate.members, // translation of intermediary, novice, beginner ...
          languageNameLabel: addModal.languageNameLabel,
          writingLabel: addModal.writingLabel,
          readingLabel: addModal.readingLabel,
          understandingLabel: addModal.understandingLabel,
          chooseLabel: addModal.chooseLabel,
          understoodLabel: addModal.understoodLabel,
          closeLabel: addModal.closeLabel
        };

        const updModal = translate.updateModal;
        // modal update language
        this.updatelanguageTranslateObject = {
          updateLanguageLabel: updModal.updateLanguageLabel,
          members: translate.members,
          languageNameLabel: updModal.languageNameLabel,
          writingLabel: updModal.writingLabel,
          readingLabel: updModal.readingLabel,
          understandingLabel: updModal.understandingLabel,
          chooseLabel: updModal.chooseLabel,
          updateLabel: updModal.updateLabel,
          closeLabel: updModal.closeLabel

        };
      }


}
