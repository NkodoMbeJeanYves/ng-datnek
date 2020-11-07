import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private lg = new BehaviorSubject({});
  getObservableLanguage = this.lg.asObservable();

  translator = {
    en : {
      main: {
        welcomeMessage: 'Datnek-Language app is running!',
        dashboardTitle: 'Dashboard',
        customMessage1: 'From From here, you will be able to reach every part of your Application',
        customMessage2: 'What do you want to do next with your app?'
      },
      languages: {
        pageTitle: 'All languages'
      },
      members: {
        Intermediate: 'Intermediate',
        High: 'High',
        Novice: 'Novice',
        Beginner: 'Beginner'
      },
      singleLanguage: {
        readingLabel: 'Reading',
        writingLabel: 'Writing',
        understandingLabel: 'understanding'
      }
    },
    fr : {
      main: {
        welcomeMessage: 'Datnek-Language est en cours d\'execution!',
        dashboardTitle: 'Tableau de bord',
        customMessage1: 'D\'ici, vous pouvez vous rendre partout dans l\'application',
        customMessage2: 'Que voudriez-vous faire d\'autres? Cliquez sur le lien languages'
      },
      languages: {
        pageTitle: 'Toutes les langues'
      },
      members: {
        Intermediate: 'Intermediaire',
        High: 'Eleve',
        Novice: 'Novice',
        Beginner: 'Debutant'
      },
      singleLanguage: {
        readingLabel: 'Lecture',
        writingLabel: 'Ecriture',
        understandingLabel: 'Comprehension'
      }
    },
    sp : {
      main: {
        welcomeMessage: 'Datnek-Language está corriendo!',
        dashboardTitle: 'salpicadero',
        customMessage1: 'desde aquí puedes ir a cualquier parte de la aplicación',
        customMessage2: 'Qué te gustaría hacer otros? Haga clic en el enlace de idiomas'
      },
      languages: {
        pageTitle: 'Todos los idiomas'
      },
      members: {
        Intermediate: 'Intermedio',
        High: 'Alto',
        Novice: 'Principiante',
        Beginner: 'Principiante'
      },
      singleLanguage: {
        readingLabel: 'Leyendo',
        writingLabel: 'Escritura',
        understandingLabel: 'comprensión'
      }
    }


  };



  private sp = {
    main: {
      welcomeMessage: 'Datnek-Language está corriendo!',
      dashboardTitle: 'salpicadero',
      customMessage_1: 'desde aquí puedes ir a cualquier parte de la aplicación',
      customMessage_2: 'Qué te gustaría hacer otros? Haga clic en el enlace de idiomas'
    },
    languages: {
      pageTitle: 'Todos los idiomas'
    }
  };

  private defaultLang;


  constructor(private toastr: ToastrService) { }

  getcurrentLanguage(): string {
    return this.defaultLang;
  }

  setDictionnaryLanguage(value = 'en'): void {
    this.defaultLang = value;
    this.lg.next(this.translator[this.defaultLang]);
    this.toastr.success(`Language was successfully setting to ${value}!`, 'Language Setting');
    return;
  }

  getDictionnaryObject(): void {
    return this.translator[this.defaultLang];
  }

  start(): void {
    if (this.defaultLang === undefined ){
      this.defaultLang = 'en';
      this.lg.next(this.translator[this.defaultLang]);
      this.toastr.info(`Language is obviously setting to ${this.defaultLang}!`, 'Language Setting');
      return;
    }
  }
}
