import { Component, Input, OnInit } from '@angular/core';
import { Language } from 'src/app/models/language';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-update-language-modal',
  templateUrl: './update-language-modal.component.html',
  styleUrls: ['./update-language-modal.component.css']
})
export class UpdateLanguageModalComponent implements OnInit {

  criterias = [];
  language: Language;

  @Input() curlanguage: Language;

  constructor(private sData: SharedDataService) {
    this.language = new Language();
  }

  ngOnInit(): void {
    this.criterias = this.sData.creteria;
  }

  check(f): void {
    console.log(f.value);
  }

}
