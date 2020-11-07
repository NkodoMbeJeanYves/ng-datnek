import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { SharedDataService } from 'src/app/services/shared-data.service';
import { LanguageService } from '../language/language.service';


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

  constructor(private languageService: LanguageService,
              private toastr: ToastrService,
              private http: HttpClient,
              private sData: SharedDataService
              ) {

  }

  ngOnInit(): void {
    this.languageService.start();
    this.dataSubscription = this.languageService.getObservableLanguage.subscribe(
      (dico) => {
        console.log(dico);
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

  change(value = 'eng'): void {
    this.languageService.setDictionnaryLanguage(value);
  }




}
