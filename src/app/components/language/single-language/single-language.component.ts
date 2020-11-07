import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Language } from 'src/app/models/language';
import { BuilderService } from 'src/app/services/builder.service';

@Component({
  selector: 'app-single-language',
  templateUrl: './single-language.component.html',
  styleUrls: ['./single-language.component.css']
})
export class SingleLanguageComponent implements OnInit {

  @Input() language: Language;
  @Output() dispatchLanguageEvent = new EventEmitter<Language>(true);

  @Input() readingLabel = 'reading';
  @Input() writingLabel = 'writing';
  @Input() understandingLabel = 'understanding';

  // index of language
  index = null;
  index2 = null;

  constructor(
    private bs: BuilderService,
    private toastr: ToastrService
    ) { }

  ngOnInit(): void {
    this.index = this.language.primaryKey;
    this.index2 = `#${this.index}`; 
    console.log(this.index);
  }

  // share current language object with language-list-component
  // in that way, update modal will be displayed with current data
  update(): void {
    this.dispatchLanguageEvent.emit(this.language);
  }

  destroyMe(): void{
    console.log(this.language);
    this.bs.destroyWithoutSubscription(this.language).subscribe(
       (data) => {
         if ( data.message !== undefined) {
            this.toastr.success(`data.message`, 'Delete completed!');
         } else {
           this.toastr.warning('something wrong happened! You may check the console', 'Error occured');
         }
       }
     );
  }
}
