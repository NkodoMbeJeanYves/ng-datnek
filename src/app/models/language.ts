import { LanguageService } from '../components/language/language.service';
import { Model } from "./model";

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
        this.primaryKey = 'languageid';
        this.tableName = 'languages';
        this.primaryColName = 'languageId';
        this.redirectAfterUploadFileLink = undefined;
    }



}