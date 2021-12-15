import { BasePageContent } from "../../../core/content/base-page-content.component";

export class PagecontentTableListing extends BasePageContent{
    getPageSpecificText(){

        this.PAGE_TEXT['*'] = {
            header: 'Listing',
            
        };
    }
}
