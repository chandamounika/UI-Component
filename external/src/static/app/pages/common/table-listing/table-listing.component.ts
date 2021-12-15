import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MyDeqErrorHandler } from '../../../core/errorHandler';
import { AppService } from '../../../service/app.service';
import { LoggerService } from '../../../shared/lib/logger/logger-service.component';
import { Utils } from '../../../shared/Utils';
import { BasePathController } from '../../components/base-path-component.component';
import { PagecontentTableListing } from './table-listing.resourcebundle';


@Component({
  selector: 'table-listing',
  templateUrl: './table-listing.component.html'
})
export class TableListingComponent extends BasePathController {

  constructor(protected activatedRoute: ActivatedRoute,
    protected formBuilder: FormBuilder,
    protected utils: Utils,
    protected appService: AppService,
    protected errorHandler: MyDeqErrorHandler,
    private logger: LoggerService
    ) {
    super(activatedRoute, formBuilder, utils, appService, errorHandler, new PagecontentTableListing());
    this.setPageLoadServiceName("permits");

}

onGetResponse(getResponse: any): void {
 
}
createForm(): FormGroup {
 return new FormGroup({})
}


 

}
