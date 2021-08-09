import { PageTextGetter } from '../../core/content/pagetext-getter.component';

export abstract class BasePageContent implements PageTextGetter{
    public PAGE_TEXT={
        select:`Select One`,
        cancel:`CANCEL`,
        save:`SAVE`,
        delete:`DELETE`,
        edit:`EDIT`,
        continue:`CONTINUE`,
        proceed:`PROCEED`,
        back:`BACK`
    }

    constructor(){
        this.getPageSpecificText();
    }
    public abstract getPageSpecificText();

    public getPageContent(){
        return this.PAGE_TEXT;
    }
}
