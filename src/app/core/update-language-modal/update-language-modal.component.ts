import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LanguageService } from 'src/app/components/language/language.service';
import { Language } from 'src/app/models/language';
import { BuilderService } from 'src/app/services/builder.service';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-update-language-modal',
  templateUrl: './update-language-modal.component.html',
  styleUrls: ['./update-language-modal.component.css']
})
export class UpdateLanguageModalComponent implements OnInit {

  criterias = [];
  language: Language;

  
// load remote parameters from https://restcountries.eu/rest/v2/all
languages = [];

  @Input() curlanguage: Language;
  @Input() updatelanguageTranslateObject;

  constructor(
    private sData: SharedDataService,
    private languageService: LanguageService,
    private bs: BuilderService,
    private toastr: ToastrService,
    private router: Router) {
    this.language = new Language();
  }

  ngOnInit(): void {
    const dictionary = (this.languageService.getDictionnaryObject() as any).members;

    this.criterias = this.sData.creteria.map(item => {
      return dictionary[item];
    });
  }

  check(f): void {
    this.bs.updateWithoutSubscription(this.curlanguage).subscribe(
      (data)  =>  {
        this.router.navigate(['/languages']);
        this.toastr.success('item updated successfully!', 'Success', {
          positionClass: 'toastr-top-right',
          timeOut: 0, closeButton: true,
        });
      // trigger btnClose button of modal
        this.bs.triggerClickEventOnHTMLElement('btnCloseModalUpdateLanguage');
      },
      (error) =>  {
        this.toastr.warning('Something wrong', 'error');
      }
    );
  }

}
