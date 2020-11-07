import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { catchError, retry, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from './shared-data.service';
import * as ClassDef from '../models/group';  // access dynamically all defined classes into customise function
import { Router } from '@angular/router';
import { environment, _fetchRetryCount } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export  class BuilderService {
  // on definie cette variable pour effectuer les mises à jour sur les components
  instanceSubject = new Subject<ClassDef.Model[]>();

  // list des elements de la bdd
  // list of fetched items from db
  public items: any[];

  // endpoint
  public url: any;
  // endPoint api
  protected endPoint: string;

  // headers
  options: any;

  // instanceToUpload , we use it to retrieve id of model instance then uploading file with that id.
  instanceToUpload: ClassDef.Model;

  // subject element used for uploding process
  uploadSubject = new Subject<ClassDef.Model>();

  // after processing with data, we redirect user to another page if we want (Post - Update - Delete )
  redirectTo: string; // url to redirect after store or update item

  // fetch token value in case of using
  token = localStorage.getItem('datnek-token');


  constructor(  public http?: HttpClient,
                public toastr?: ToastrService,
                private sData?: SharedDataService,
                private router?: Router) {

  // initialize list of items
    this.items = [];
    this.options = new HttpHeaders(
      {
        'Content-Type':  'application/json',
        Accept:  'application/json',
        enctype: 'multipart/form-data',
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Headers': 'Origin',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Method': 'GET, POST, PUT, PATCH, DELETE'

      });
   }


   /**
   * 
   * @param part 
   * @return chunk array into parts if needed
   */
  chunkArray($array: ClassDef.Model[] = [], len = 5): (ClassDef.Model[])[] {
    if ($array.length === 0) {
      return [];
    }
    let i, j = len;
    let index = 0;
    let temparray: ClassDef.Model[] = [];
    const result = [];
    for (i = 0, j = $array.length; i < j; i += len) {
      temparray = $array.slice(i, i + len);
      // do whatever
      result[index++] = temparray;
    }
    return result.slice();
  }

   /**
    * @comment we need sometime after fetching object to be sure that it is empty
    */
   checkIfObjectIsEmpty(obj?: object): boolean {
      if (obj && Object.keys(obj).length === 0 && obj.constructor === Object) {
        return true;
      }
      return false;
   }


  /**
   * @param arg definit le point d'acces à l'api 
   * @comment define api endPoint before doing any task relate to a model
   * @comment cette methode est toujours appelée dans tous les services lors de l'initialisation
   */
  setEndPoint(arg?: string): void {
    this.endPoint = environment.API + arg;
  }


  /**
   * @Comment retrieve endPoint
   */
  getEndPoint(): string {
    return this.endPoint;
  }

   // Gestion des erreurs
   // error handling during http request
   handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      this.toastr.error(error.error.message, 'Error', {positionClass: 'toastr-top-left'});
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      this.toastr.error( 'Backend returned code :' + `${error.statusText}`, 'Backend Error', {positionClass: 'toastr-top-left'});
    }
    // return an observable with a user-facing error message
    this.toastr.error('Something bad happened; Make sure that you are connected to internet.', 'Error', {positionClass: 'toastr-top-left'});
    return throwError(
      'Something bad happened; Make sure that you are connected to internet.');

  }

  // Rechercher un element à partir de son id dans la liste
  /**
   * @param $value ClassDef.Model
   * @comment renvoit l'equivalent contenu dans items obtenu 
   * à partir du super objet
   */
  findItemById(value: any): ClassDef.Model {
    let primaryColumnName ;
    primaryColumnName = value.primaryColName;
    const item = this.items.find(
      (obj: ClassDef.Model) => {
        return `${obj[primaryColumnName]}` === `${value[primaryColumnName]}` ;
      }
    );
    return item;
  }






  /**
   * @comment vu que le component upload est accessible dans toute l'application
   * il faudrait toujours transmettre le Model concerné par l'upload ponctuel afin de
   * transmettre l'id de celui avec le fichier à uploader
   * Au vu de rendre le model accessible entre uploadComponent et le component requerant
   */
  /* emitUploadSubject() {
    this.uploadSubject.next(this.instanceToUpload);
  } */


  /**
   * @comment customize dataList by adding primaryKey fields and others
   */
  customizeDataList(): ClassDef.Model[]{
//    var InstanceClass: any = new ()[ this.sData.getClassDef.Model()]();
    let data: ClassDef.Model[];
    let calledModelString;
    calledModelString = this.sData.getCurrentModelValue();
    data = this.items.map(
      (element) => {
        return new ClassDef[calledModelString]().replicateMember(element);
      }
    );

    return data;
  }

  /**
   * 
   * @param path must be like /languages
   * @param sometimes we need to reload page for updating data
   * [languages] is a route within app.routing.ts
   */
  reloadPage(path ?: string): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([`${path}`]);
  }

  /**
   * @comment as its figured method name, this method is used to redirect use after some particular tasks 
   */
  redirectToPath(): void {

    // each component is related with each model
    // for a better purpose we store the model value in sharedDataService
    this.redirectTo = this.sData.getCurrentModelValue();

    // for instance modelName should be 'language' and we would redirect to /languages
    // that's why we have append 's' letter
    this.redirectTo = ('/' + this.redirectTo + 's').toLowerCase();
    if (this.redirectTo === undefined || this.redirectTo === '') {
      this.router.navigate(['/']);
    }
    this.router.navigate([`/${this.redirectTo}`]);
  }

  /**
   * @comment diffuser la liste mise à jour dans le service
   */
  emitItemSubject(): void {
    this.redirectTo = this.sData.getCurrentModelValue();
    this.redirectTo = (this.redirectTo + 's').toLowerCase();  //    /languages
    let data;
    data = this.customizeDataList();
    if (data.length) {
      this.instanceSubject.next(data.slice());
    }
  }

  /**
   * @param array tableau à rendre disponible dans le service
   */
  emitItemsSubjectwithParam(obj: ClassDef.Model[]): void {
    this.items = obj.slice();
    this.instanceSubject.next(this.items.slice());
  }


/**
 * @param item objet à ajouter de la liste courant d'objets
 * @comment methode permettant d'ajouter un objet de la liste
 * @comment this method is used to add an item to fetched items list
 */
  addItemToList(item: ClassDef.Model): void {
    this.items.unshift(item);
  }


  /**
   * @param item item that would be replace
   * @comment item provient d'un heritage ou non, et doit provenir de la liste customisée afin d'accéder au champs primaryKey
   */
  replaceItemToList(item: ClassDef.Model): void {
    // il suffit de retrouver l'index de l'element à modifier
    let custom;
    // on renvoit l'equivalent du super objet contenu dans items
    custom = this.findItemById(item);
    // on renvoit l'index de l'objet contenu dans items
    const index = this.items.indexOf(custom);
    // on substitue l'objet par la mise à jour
    this.items[index] = item;
    this.emitItemSubject();
  }


/**
 * @param item objet à retirer de la liste courant d'objets
 * @comment methode permettant de supprimer un objet de la liste
 */
removeItemsToList(item: ClassDef.Model): void {
  let custom;
  custom = this.findItemById(item);
  const index = this.items.indexOf(custom);
  this.items.splice(index, 1);
  // méthode permettant de supprimer un objet dans la liste,
  // par exemple lors de la requête de suppression
  this.emitItemSubject();
}

// // Methode d'upload de fichier sans tracabilite de la progression
uploadFileToServerWithoutProgress(formData: FormData, endpoint: string): Observable<any> {
  this.setEndPoint(endpoint);
  const uploadUrl = this.endPoint;
  this.toastr.info('Upload of File started', 'Upload File in Progress', {positionClass: 'toastr-top-right'});
  return this.http.post(uploadUrl, formData );
}


// Methode d'upload de fichier avec tracabilite de la progression
uploadFileToServerWithProgress(formData: FormData, endpoint: string): Observable<any> {
  this.setEndPoint(endpoint);
  const uploadUrl = this.endPoint;
  return this.http.post(uploadUrl, formData,
    { //  Observer la progression de l'upload, pour transmettre un visuel ponctuel de l'upload
      reportProgress: true,
      observe: 'events'
    }
  );
}


  /**
   * @Comment telecharger la liste de tous les elements
   */
  fetchAll() {
    return this.http.get<ClassDef.Model[]>(this.endPoint, { headers : this.options})
    .pipe(
      retry(_fetchRetryCount)
      // catchError(this.handleError)
    ).subscribe(
      (data) => {
                    this.items = data as any;
                    this.toastr.info('Downloading Items from server completed', 'Server Response', {positionClass: 'toastr-top-right'});
                    this.emitItemSubject();
                  },
      (error) => {console.log(error); this.items = [];
                  this.toastr.error('An error occured while downloading stuffs. Please check your database connection.', 'Backend Error',
                   {positionClass: 'toastr-top-left'});
                }
    );
  }


  /**
   * @Comment telecharger la liste des elements Version2
   * @Comment version de code à utiliser dans les divers composants
   */
  fetchAllWithoutSubscription(): Observable<any> {
      return this.http.get<any[]>(this.endPoint, { headers : this.options});
  }

  /**
   * @param param critere de recherche
   * @Comment effectuer une recherche suivant plusieurs champs (field1 = param || field2 = param)
   * @return array tableau des tous les objets remplissant le critere
   */
  fetchParam(param, separator: string = '/') {
    return this.http.get<ClassDef.Model[]>(this.endPoint + `${separator}${param}`, { headers : this.options})
   .pipe(
     retry(_fetchRetryCount),
     catchError(this.handleError)
   ).subscribe(
     (data) => {
                  this.items = data as any;
                  this.emitItemSubject();
                },
     (error) => console.log(error)
   );
  }


  /**
   * @param param critere de recherche
   * @Comment effectuer une recherche suivant plusieurs champs (field1 = param || field2 = param)
   * @return array tableau des tous les objets remplissant le critere
   */
  fetchParamWithOutSubscription(param, separator: string = '/'): Observable<any> {
    return this.http.get<ClassDef.Model[]>(this.endPoint + `${separator}${param}`, { headers : this.options});
  }

 


  /**
   *
   * @param item objet à ajouter dans la base de données
   * @Comment methode permettant d'ajouter un nouvel enrégistrement
   */
  store(item: ClassDef.Model) {
    return this.http.post<ClassDef.Model>(this.endPoint, item, { headers : this.options})
      .pipe(
        catchError(this.handleError)
      ).subscribe(
        (data)  =>  {
                  const fetchedBackendItem = (data as any).data;
                  const status = (data as any).status;
                  if (status === 200) {
                  this.addItemToList(fetchedBackendItem);
                  this.emitItemSubject(); // redirectTo is set when this event occurs!
                  this.router.navigate([`${this.redirectTo}`]);
                  this.toastr.success('new item stored successfully!', 'Success', {
                    positionClass: 'toastr-top-right',
                    timeOut: 0, closeButton: true,
                  });
                } else {
                  this.displayErrorMessageBag((data as any).errors);
                }
        }
      );
  }


  /**
   *
   * @param items tableau d'objets à ajouter dans la base de données
   * @Comment methode permettant d'ajouter un ensemble d'enrégistrements
   */
  storeInBulkWithoutSubscription(items: ClassDef.Model[]): Observable<any> {
    return this.http.post<ClassDef.Model[]>(this.endPoint, items, { headers : this.options})
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   *
   * @param items tableau d'objets à ajouter dans la base de données
   * @Comment methode permettant d'ajouter un ensemble d'enrégistrements
   */
  storeWithoutSubscription(item: ClassDef.Model): Observable<any> {
    return this.http.post<ClassDef.Model>(this.endPoint, item, { headers : this.options})
      .pipe(
        catchError(this.handleError)
      );
  }


  /**
   *
   * @param data MessageBag received from Backend Validator
   */
   displayErrorMessageBag(data): string{
        let messageToDisplay ;
        messageToDisplay = '\n';
        // tslint:disable-next-line: prefer-for-of
        for (let index = 0; index < data.length; index++) {
            messageToDisplay = data[index] + '.\n';
            this.toastr.warning(`${messageToDisplay}`, 'Validation', {positionClass: 'toastr-top-left', timeOut: 7000, progressBar: false});
        }
        return '0';
    }



  /**
   * @param item objet sujet à une mise à jour
   * @comment methode permettant d'effectuer une mise à jour
   */
  update(item: ClassDef.Model, separator: string = '/') {
    return this.http.put<ClassDef.Model>(this.endPoint + `${separator}${item.primaryKey}`, item, { headers : this.options})
      .pipe(
        catchError(this.handleError)
      ).subscribe(
        (data) => {
              const status = (data as any).status;
              if (status === 200) {
                this.replaceItemToList(item);
                this.router.navigate([this.redirectTo]);
                this.toastr.success('item updated successfully!', 'Success', {
                  positionClass: 'toastr-top-right',
                  timeOut: 0, closeButton: true,
                });
                // Make updated DataList accessible over application
                // this.emitItemSubject();
              } else {
                this.displayErrorMessageBag((data as any).errors);
              }
        }
      );
  }


  /**
   * @param item objet sujet à une mise à jour
   * @comment methode permettant d'effectuer une mise à jour
   */
  updateInBulkWithoutSubscription(items: ClassDef.Model[]): Observable<any> {
    return this.http.put<ClassDef.Model[]>(this.endPoint, null, { headers : this.options})
      .pipe(
        catchError(this.handleError)
      );
  }


  /**
   * @param item objet sujet à une mise à jour
   * @comment methode permettant d'effectuer une mise à jour
   */
  updateWithoutSubscription(item: ClassDef.Model, separator: string = '/'): Observable<any> {
    return this.http.put<ClassDef.Model>(this.endPoint + `${separator}${item.primaryKey}`, item, { headers : this.options})
      .pipe(
        catchError(this.handleError)
      );
  }


  /**
   * @param item objet à supprimer, super objet avec le champs primaryKey, primaryColName
   * @comment methode permettant de supprimer un objet dans la base de données
   */
  destroy(item: ClassDef.Model, separator: string = '/') {
    return this.http.delete(this.endPoint + `${separator}${item.primaryKey}`, { headers : this.options})
      .pipe(
        catchError(this.handleError)
      )
      .subscribe(
        (data: any) => {
                if (data.status === 200) {
                  this.toastr.warning('You deleted an item', 'Confirmation');
                  // update dataList by removing deleted item
                  this.removeItemsToList(item);
                } else {
                  this.toastr.error('Unable to delete item.', 'Error', {positionClass: 'toastr-top-left'});
                }
              },
        (error) => console.log(error)
      );
  }


  /**
   * @param item objet à supprimer, super objet avec le champs primaryKey, primaryColName
   * @comment methode permettant de supprimer un objet dans la base de données
   */
  destroyWithoutSubscription(item: ClassDef.Model, separator: string = '/'): Observable<any> {
    return this.http.delete(this.endPoint + `${separator}${item.primaryKey}`, { headers : this.options});
  }
  /**
   *
   * @param parentItem in which we are going to make relationship with pivotIds array
   * @Comment etablir une relation many-to-many entre un item et un tableau
   * @Comment establish a many-to-many relationShip between an item and an array of pivotIds
   */
  attach(item: ClassDef.Model, separator: string = '/') {
    return this.http.post<ClassDef.Model>(this.endPoint + `${separator}${item.primaryKey}`, item, { headers : this.options})
      .pipe(
        catchError(this.handleError)
      ).subscribe(
        (data)  =>  {
          const status = (data as any).status;
              if (status === 200) {
                this.replaceItemToList(item);
                this.toastr.success('item attached successfully!', 'Success', {
                  positionClass: 'toastr-top-right',
                  timeOut: 0, closeButton: true,
                });
              } else {
                this.displayErrorMessageBag((data as any).errors);
              }
        }
      );
  }


  /**
   *
   * @param parentItem in which we are going to make relationship with pivotIds array
   * @Comment etablir une relation many-to-many entre un item et un tableau
   * @Comment establish a many-to-many relationShip between an item and an array of pivotIds
   */
  attachWithoutSubscription(item: ClassDef.Model, separator: string = '/'): Observable<any> {
    return this.http.post<ClassDef.Model>(this.endPoint + `${separator}${item.primaryKey}`, item, { headers : this.options})
      .pipe(
        catchError(this.handleError)
      );
  }


  /**
   *
   * @param parentItem in which we are going to make relationship with pivotIds array
   * @Comment etablir une relation many-to-many entre un item et un tableau
   * @Comment remove a many-to-many relationShip between an item and an array of pivotIds
   */
  detach(item: ClassDef.Model, separator: string = '/') {
    return this.http.post<ClassDef.Model>(this.endPoint + `${separator}${item.primaryKey}`, item, { headers : this.options})
      .pipe(
        catchError(this.handleError)
      ).subscribe(
        (data)  =>  {
          const status = (data as any).status;
              if (status === 200) {
                this.replaceItemToList(item);
                // this.router.navigate([this.redirectTo]); we must replace this line with this
                // this.reloadPage(this.redirectTo);
                this.toastr.success('item detached successfully!', 'Success', {
                  positionClass: 'toastr-top-right',
                  timeOut: 0, closeButton: true,
                });
                // Make updated DataList accessible over application
                // this.emitItemSubject();
              } else {
                this.displayErrorMessageBag((data as any).errors);
              }
        }
      );
  }


  /**
   *
   * @param parentItem in which we are going to make relationship with pivotIds array
   * @Comment etablir une relation many-to-many entre un item et un tableau
   * @Comment remove a many-to-many relationShip between an item and an array of pivotIds
   */
  detachWithoutSubscription(item: ClassDef.Model, separator: string = '/'): Observable<any> {
    return this.http.post<ClassDef.Model>(this.endPoint + `${separator}${item.primaryKey}`, item, { headers : this.options})
      .pipe(
        catchError(this.handleError)
      );
  }

/**
 * 
 * @param element_id id of element
 * @Comment trigger click event on HTMLElement
 */
  triggerClickEventOnHTMLElement(elementId: string): void {
    const element: HTMLElement = document.getElementById(elementId) as HTMLElement;
    element.click();
  }

}
