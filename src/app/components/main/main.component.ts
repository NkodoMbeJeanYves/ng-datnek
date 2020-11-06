import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TranslateService } from 'src/app/services/translate.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {

  welcomeMessage = '';
  dashboardTitle = '';
  customMessage1 = '';
  customMessage2 = '';

  // access translation object within dictionnary
  member = 'main';
  dataSubscription: Subscription;

  constructor(private translateService: TranslateService,
              private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.translateService.start();
    this.dataSubscription = this.translateService.getObservableLanguage.subscribe(
      (dico) => {
        console.log(dico[this.member]);
        this.welcomeMessage = dico[this.member].welcomeMessage;
        this.dashboardTitle = dico[this.member].dashboardTitle;
        this.customMessage1 = dico[this.member].customMessage1;
        this.customMessage2 = dico[this.member].customMessage2;
      }
    );
  }

  ngOnDestroy(): void {
     this.dataSubscription.unsubscribe();
  }

  change(value = 'en'): void {
    this.translateService.setDictionnaryLanguage(value);
  }

}
