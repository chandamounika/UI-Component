import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonPageModule } from './common/common.module';
import { environment } from '../../environments/environment';
@NgModule({

    imports: [
        CommonModule,
        RouterModule,
        CommonPageModule
    ],
	providers: [
	   // { provide: NgbDateParserFormatter, useFactory: () => new NgbDateFRParserFormatter('shortDate') }
	   {provide: 'environment', useValue: environment}, 
	  
	  ]

})
export class PageModule {}



