import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private lg = new BehaviorSubject({});
  getObservableLanguage = this.lg.asObservable();

  translator = {
    eng : {
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
      },
      addModal: {
        addNewLanguageLabel: 'add New Language',
        languageNameLabel: 'Language Name',
        writingLabel: 'Writing Level',
        readingLabel: 'Reading Level',
        understandingLabel: 'Understanding Level',
        chooseLabel: 'Choose...',
        understoodLabel: 'understood',
        closeLabel: 'Close'
      },
      updateModal: {
        updateLanguageLabel: 'Update Language',
        languageNameLabel: 'Language Name',
        writingLabel: 'Writing Level',
        readingLabel: 'Reading Level',
        understandingLabel: 'Understanding Level',
        chooseLabel: 'Choose...',
        updateLabel: 'update',
        closeLabel: 'Close'
      }
    },
    fra : {
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
      },
      addModal: {
        addNewLanguageLabel: 'Ajouter un langage',
        languageNameLabel: 'Libelle de la langue',
        writingLabel: 'Niveau d\'ecriture',
        readingLabel: 'Niveau de lecture',
        understandingLabel: 'Niveau de compréhension',
        chooseLabel: 'Choisir...',
        understoodLabel: 'Ajouter',
        closeLabel: 'Fermer'
      },
      updateModal: {
        updateLanguageLabel: 'Modifier La langue',
        languageNameLabel: 'Libelle de la langue',
        writingLabel: 'Niveau d\'ecriture',
        readingLabel: 'Niveau de lecture',
        understandingLabel: 'Niveau de comprehension',
        chooseLabel: 'Choisir...',
        updateLabel: 'Mise à jour',
        closeLabel: 'Fermer'
      }
    },
    spa : {
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
      },
      addModal: {
        addNewLanguageLabel: 'Agregar idioma',
        languageNameLabel: 'Etiqueta de idioma',
        writingLabel: 'Nivel de escritura',
        readingLabel: 'Nivel de lectura',
        understandingLabel: 'Nivel de comprensión',
        chooseLabel: 'Elegir...',
        understoodLabel: 'Añadir',
        closeLabel: 'Cerrar'
      },
      updateModal: {
        updateLanguageLabel: 'Modifier La langue',
        languageNameLabel: 'Etiqueta de idioma',
        writingLabel: 'Nivel de escritura',
        readingLabel: 'Nivel de lectura',
        understandingLabel: 'Nivel de comprensión',
        chooseLabel: 'Elegir...',
        updateLabel: 'Actualización',
        closeLabel: 'Cerrar'
      }
    }


  };


  private defaultLang;


  constructor(
    private toastr: ToastrService,
    private sData: SharedDataService
    ) { }

  getcurrentLanguage(): string {
    return this.defaultLang;
  }

  setDictionnaryLanguage(value = 'eng'): void {
    this.defaultLang = value;
    this.lg.next(this.translator[this.defaultLang]);
    this.toastr.success(`Language was successfully setting to ${value}!`, 'Language Setting');
  }

  getDictionnaryObject(): {} {
    return this.translator[this.defaultLang];
  }

  start(): void {
    if (this.defaultLang === undefined ){
      this.defaultLang = 'eng';
      this.lg.next(this.translator[this.defaultLang]);
      this.toastr.info(`Language is obviously setting to ${this.defaultLang}!`, 'Language Setting');
      return;
    }
  }

  /**
   * @comment load parameters from https://restcountries.eu/rest/v2/all
   */
  getcountriesParameters(): any[]{
    const Countries = [];

    this.sData.getParameters().forEach(element => {
      const item = element as any;
      item.languages.forEach(
        language => {
          Countries.push(language);
        }
      );
    });
    return Countries;
  }


}
