import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Language } from 'src/app/models/language';

@Component({
  selector: 'app-single-language',
  templateUrl: './single-language.component.html',
  styleUrls: ['./single-language.component.css']
})
export class SingleLanguageComponent implements OnInit {

  @Input() language: Language;
  @Output() dispatchLanguageEvent = new EventEmitter<Language>(true);

  constructor() { }

  ngOnInit(): void {
    

  }

  // share current language object with language-list-component
  // in that way, update modal will be displayed with current data
  update(): void {
    this.dispatchLanguageEvent.emit(this.language);
  }
}
