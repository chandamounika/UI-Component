import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// import { NgbdModalContent } from '../../../../../../../ust-common/src/static/external/app/core/component/ng-content-modal/ng-content-modal';
// import { MyDeqErrorHandler } from '../../../../../../../ust-common/src/static/external/app/core/errorHandler';
// import { BasePathController } from '../../../../../../../ust-common/src/static/external/app/pages/components/base-path-component.component';
// import { AppService } from '../../../../../../../ust-common/src/static/external/app/service/app.service';
// import { Utils } from '../../../../../../../ust-common/src/static/external/app/shared/Utils';

import { Utils } from '../../../shared/Utils';
import { AppService } from '../../../service/app.service';
import { PagecontentNotificationTesting } from './notification-testing.resourcebundle';
import { BasePathController } from '../../components/base-path-component.component';
import { MyDeqErrorHandler } from '../../../core/errorHandler';
import { NgbdModalContent } from '../../../shared/ng-content-modal/ng-content-modal'


@Component({
  selector: 'notification-testing',
  templateUrl: './notification-testing.component.html'
})
export class NotificationTestingComponent extends BasePathController {

  readonly cont_completedstatus = 'complete';
  allSectionscompleted_apartfromcontact: boolean = false;
  revisionRequiredFlag = false;

  getResponse: any;

  constructor(
    public utils: Utils,
    protected route: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected errorHandler: MyDeqErrorHandler,
    protected service: AppService,
    protected modalService: NgbModal) {
    super(route, formBuilder, utils, service, errorHandler, new PagecontentNotificationTesting());
    // this.setPageLoadServiceName('notification_index');

    console.log("pageText", this.pageText)
  }

  // public setDefaultPageFooterDTL() {
  //   super.setDefaultPageFooterDTL();
  //   this.pageFooterDTL.leftButtonTxt = this.pageText.back,
  //     this.pageFooterDTL.disableRightButton = true;
  // }

  createForm(): FormGroup {
    return this.formBuilder.group({})
  }

  onGetResponse(getResponse: any): void {
    console.log("its on load property==>", getResponse);
    this.getResponse = getResponse;
  }


}
