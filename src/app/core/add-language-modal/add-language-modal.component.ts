import { Component, Input, OnInit } from '@angular/core';
import { Language } from 'src/app/models/language';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { FormsModule, NgForm } from '@angular/forms';
import { BuilderService } from 'src/app/services/builder.service';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from 'src/app/components/language/language.service';
@Component({
  selector: 'app-add-language-modal',
  templateUrl: './add-language-modal.component.html',
  styleUrls: ['./add-language-modal.component.css']
})
export class AddLanguageModalComponent implements OnInit {

  criterias = [];
  language: Language;
  @Input() addNewlanguageTranslateObject;


// load remote parameters from https://restcountries.eu/rest/v2/all
languages = [];

  constructor(
    private languageService: LanguageService,
    private sData: SharedDataService,
    private bs: BuilderService,
    private toastr: ToastrService) {
    this.language = new Language();
  }

  ngOnInit(): void {
    this.criterias = this.sData.creteria;
    // load a list of countries and its related informations
    this.languages = this.languageService.getcountriesParameters();
  }

  check(f): void {
    this.language.languageCode = f.value.language_name.iso639_2;
    this.language.languageName = f.value.language_name.name;
    this.bs.storeWithoutSubscription(this.language).subscribe(
      (data)  =>  {
        this.bs.addItemToList(data);
        this.bs.emitItemSubject();
        this.toastr.success('New language successfully added to the system!', 'Mission Completed!');
        // trigger btnClose button of modal
        this.bs.triggerClickEventOnHTMLElement('btnCloseModalAddLanguage');
      }
    );
  }

  
  

}
