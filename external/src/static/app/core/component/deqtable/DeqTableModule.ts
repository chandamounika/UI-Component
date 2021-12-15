import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import { DeqTable, DeqTableHeaders, GeneralColumnHeaders } from "./DeqTable";
//import { TablefooterComponent } from "./tablefooter/tablefooter.component";




@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        DeqTable,
        DeqTableHeaders,
        GeneralColumnHeaders,
        //TablefooterComponent
    ],
    exports: [
        DeqTable,
        DeqTableHeaders,
        GeneralColumnHeaders
        //TablefooterComponent
    ],
 
})
export class DeqTableModule {

}
