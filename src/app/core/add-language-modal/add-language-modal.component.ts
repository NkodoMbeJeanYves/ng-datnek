import { Component, OnInit } from '@angular/core';
import { Language } from 'src/app/models/language';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { FormsModule, NgForm } from '@angular/forms';
import { BuilderService } from 'src/app/services/builder.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-language-modal',
  templateUrl: './add-language-modal.component.html',
  styleUrls: ['./add-language-modal.component.css']
})
export class AddLanguageModalComponent implements OnInit {

  criterias = [];
  language: Language;

  constructor(
    private sData: SharedDataService,
    private bs: BuilderService,
    private toastr: ToastrService) {
    this.language = new Language();
  }

  ngOnInit(): void {
    this.criterias = this.sData.creteria;
  }

  check(f): void {
    console.log(f.value);
    this.bs.storeWithoutSubscription(this.language).subscribe(
      (data)  =>  {
        this.bs.addItemToList(data);
        this.bs.emitItemSubject();
        this.toastr.success('New language successfully added to the system!', 'Mission Completed!');
      }
    );
  }

}
