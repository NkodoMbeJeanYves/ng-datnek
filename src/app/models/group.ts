export class Model {
    // primarykey of each model extended
    public primaryKey?: string;


    // table name within back-end , we use it for uploading
    // if model has a file member, all uploaded files would be stored in storage/tablename folder for instance
    public tableName?: any;

    public primaryColName?: any;
    public modelInstance?: any; // instance ponctuelle du modele utilise
    // link on which ulpoad component will redirect user after uploaded file
    public redirectAfterUploadFileLink?: string;
    constructor() {
        this.primaryKey = '';
        this.tableName = '';
        this.primaryColName = '';
        this.redirectAfterUploadFileLink = undefined;
    }

   /**
    * @param emitter object on which members will be copied
    * @param receiver object that will receive members
    * @comment this method is used for restructuring of each model within a list
    * for a best model management
    * In case if each model within the list contains array, we do not change anything on it
    */
    replicateMember(emitter: Model) {
        for (const key in emitter) {
            if (!Array.isArray(key)){
                this[key] = emitter[key];
            }
        }
        // check and rewrite file field of each model
        if (emitter.hasOwnProperty('file')) {
            const key = 'file';
            if (emitter[key] !== null && emitter[key] !== undefined) {
                // this[key]   = environment.API + emitter[key];
            }
        }
        this.primaryKey = emitter[this.primaryColName];
        return this;
    }


}

export class Language extends Model {
    // primarykey of each model extended
    primaryKey?: string;
    languageId?: string;
    languageName?: string;
    languageCode?: string;
    readingLevel?: string;
    writingLevel?: string;
    understandingLevel?: string;

    // table name within back-end , we use it for uploading
    // if model has a file member, all uploaded files would be stored in storage/tablename folder for instance
    public tableName?: any;

    // link on which ulpoad component will redirect user after uploaded file
    public redirectAfterUploadFileLink?: string;
    constructor() {
        super();
        this.primaryKey = 'languageId';
        this.tableName = 'languages';
        this.primaryColName = 'languageId';
        this.redirectAfterUploadFileLink = undefined;
    }




}