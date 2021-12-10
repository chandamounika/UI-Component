import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import { DeqTable, DeqTableHeaders } from "./DeqTable";



@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DeqTable,
        DeqTableHeaders
        
    ],
    exports: [
        DeqTable,
        DeqTableHeaders
    ],
 
})
export class DeqTableModule {

}
