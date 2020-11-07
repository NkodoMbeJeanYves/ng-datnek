import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Model } from '../models/model';
import { countries } from 'src/app/core/countries';
import { LanguageService } from '../components/language/language.service';


@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  backbuttonLinkSubject = new BehaviorSubject('');
  currentBackButtonLink = this.backbuttonLinkSubject.asObservable();

  msgSource = new Subject<any>();
  msgInstance = new BehaviorSubject({});
  msgList = new BehaviorSubject({});
  CurrentModel = this.msgSource.asObservable();
  SharedInstance = this.msgInstance.asObservable();
  private CurrentModelValue: string;
  private SharedInstanceValue: Model;
  private keysearch: string;

  private messageKeySearch = new BehaviorSubject({});
  currentKeySearchAsObservable = this.messageKeySearch.asObservable();

  // parameters from https://restcountries.eu/rest/v2/all 
  private parameters = [];

  // it's also possible to fatch criteria from a database
  // but though it is only a test
  creteria = [
    'Intermediate',
    'High',
    'Novice',
    'Beginner'
  ];


  getParameters(): any[]{
    return countries;
  }


  setBackButtonLink($value): void {
    this.backbuttonLinkSubject.next($value);
  }

  /**
   * @return definition des données à partager dans toute l'application
   * @return exemple le nom de l'utilisateur connecte
   */
  constructor() {
  }



  getSharedInstanceValue(): Model {
      return this.SharedInstanceValue;
  }

  /**
   * 
   * @param key keyword in the search bar
   * @Comment we are going to subscribe for retrieving keySearch Valu
   */
  setKeySearch(key?: string): void {
    this.messageKeySearch.next(key);
  }


  /**
   * @param SharedInstanceValue Model| instance that would be shared
   * Vu que la page de modification des elements n'est pas un composant
   * nous avons besoin de savoir quel est l'element qui devra etre modifie
   * ceci en le conservant dans cette variable
   */
  setSharedInstanceValue(SharedInstanceValue: Model): void {
    this.SharedInstanceValue = SharedInstanceValue;
    this.msgInstance.next(SharedInstanceValue);
  }

  getCurrentModelValue(): string {
    return this.CurrentModelValue;
  }

  /**
   * @param CurrentModelValue string
   * @comment pour customiser la liste ponctuelle, nous avons besoin
   *  de savoir quel est le model concerne
   * cette valeur permet de customiser en mappant le model renseigne
   * dans la fonction customise du builderService.
   */
  setCurrentModelValue(CurrentModelValue: string): void {
    this.CurrentModelValue = CurrentModelValue;
  }







}