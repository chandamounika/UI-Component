import { Component, Input, OnInit } from '@angular/core';
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
import { PagecontentAppIndex } from './app-index.resourcebundle';
import { BasePathController } from '../../components/base-path-component.component';
import { MyDeqErrorHandler } from '../../../core/errorHandler';
import { NgbdModalContent } from '../../../shared/ng-content-modal/ng-content-modal'


@Component({
  selector: 'app-index',
  templateUrl: './app-index.component.html'
})
export class AppIndexComponent extends BasePathController {

  // @Input() pageText: any;
  // @Input() getResponse: any;



  readonly cont_completedstatus = 'complete';
  allSectionscompleted_apartfromcontact: boolean = false;
  revisionRequiredFlag = false;

  constructor(
    public utils: Utils,
    protected route: ActivatedRoute,
    protected router: Router,
    protected formBuilder: FormBuilder,
    protected errorHandler: MyDeqErrorHandler,
    protected service: AppService,
    protected modalService: NgbModal) {
    super(route, formBuilder, utils, service, errorHandler, new PagecontentAppIndex());
    this.setPageLoadServiceName('app_index');

  }


  public setDefaultPageFooterDTL() {
    super.setDefaultPageFooterDTL();
    this.pageFooterDTL.leftButtonTxt = this.pageText.back,
      this.pageFooterDTL.disableRightButton = true;
  }

  createForm(): FormGroup {
    return this.formBuilder.group({})
  }

  onGetResponse(getResponse: any): void {

    console.log("res", getResponse)

    let statusSet = new Set();
    let continueFlag: boolean = true;
    getResponse.pageBlocks.forEach(eachSection => {
      if (!continueFlag) {
        return
      }
      eachSection.pageSections.forEach(eachPage => {
        statusSet.add(eachPage.sectionStatus.toLowerCase());
        if (eachPage.sectionStatus.toLowerCase() != this.cont_completedstatus) {
          continueFlag = false;
          return;
        }
      });
    });

    if (statusSet.size == 1 && statusSet.has(this.cont_completedstatus)) {
      this.pageFooterDTL.disableRightButton = false;
    }
    //check for RevisionRequired
    this.revisionRequiredFlag = this.isRevisionRequired(getResponse.pageBlocks);
  }

  isRevisionRequired = (pageBlockList: any[]): boolean => {
    let returnVal = false;

    for (let eachBlock of pageBlockList) {

      if (returnVal) {
        break;
      }

      let left = 0;
      let right = eachBlock.pageSections.length - 1;
      if (left == right) {
        returnVal = this.isRevisionIndicatorPresent(eachBlock.pageSections[left].revisionInd);
      }
      else {
        while (left < right) {
          if (this.isRevisionIndicatorPresent(eachBlock.pageSections[left].revisionInd) || this.isRevisionIndicatorPresent(eachBlock.pageSections[right].revisionInd)) {
            return true
          } else {
            left = left + 1;
            right = right - 1;
          }
        }
      }

    }
    //console.log('Revision Ind ',returnVal)
    return returnVal
  }

  private isRevisionIndicatorPresent = (indicatorVal: string) => indicatorVal && indicatorVal == 'Y'

  //this edit method needs to be implemented by the developer
  editPage = (blockName: string, sectionName: string, sectionStatus: string, isEditable: string, pageName: string) => {
    console.log("this edit m/d needs to be implemented by the developer")

    if (isEditable == 'Y') {

      if (blockName == 'UST Information' && sectionName == 'Installation' && sectionStatus.toLowerCase() == this.cont_completedstatus) {
        const modalRef = this.modalService.open(NgbdModalContent, { size: 'lg', centered: true });

        modalRef.componentInstance.modalObj = {
          header: this.pageText.alert_header,
          message: this.pageText.alert_message,
          rightbtntext: this.pageText.continue,
          leftbtntext: this.pageText.back,
        };

        modalRef.result.then(
          result => {

            if (result && result == 'PROCEED click') {
              this.utils.navigateTo([this.correctPageName(pageName)], true, true);
            }
          },
          error => { }
        );
      } else {

        this.allSectionscompleted_apartfromcontact = this.calculateAllSectionsCompleted(this.model.pageBlocks)

        if (this.allSectionscompleted_apartfromcontact && blockName != 'Contact Information') {

          let _dontShowModalPaths = new Set(["aoth", "aoth_revision", "aown", "aown_revision"])

          if (!_dontShowModalPaths.has(this.utils.path[this.utils.path.length - 1])) {
            const modalRef = this.modalService.open(NgbdModalContent, { size: 'lg', centered: true });
            modalRef.componentInstance.modalObj = {
              header: this.pageText.sp_alert_header,
              message: this.pageText.sp_alert_message,
              rightbtntext: this.pageText.continue,
              leftbtntext: this.pageText.back,
            };

            modalRef.result.then(
              result => {

                if (result && result == 'PROCEED click') {
                  this.utils.navigateTo([this.correctPageName(pageName)], true, true);
                }
              },
              error => { }
            );
          } else {
            this.utils.navigateTo([this.correctPageName(pageName)], true, true);
          }

        } else {
          this.utils.navigateTo([this.correctPageName(pageName)], true, true);
        }
      }

    }
  }

  /* onAlertPutResponse(response: any): any {
    
  } */

  //this pageContinue method needs to be implemented by the developer
  pageContinue(formDate: any) {
    console.log("this pageContinue method needs to be implemented by the developer")

    if (this.model.govInd && this.model.govInd === 'N') {
      const modalRef = this.modalService.open(NgbdModalContent, { size: 'lg', centered: true });

      modalRef.componentInstance.modalObj = {
        header: this.pageText.fr_alert_header,
        message: this.pageText.fr_alert_message,
        rightbtntext: `OK`,
        leftbtntext: this.pageText.cancel,
      };

      modalRef.result.then(
        result => {

          if (result && result == 'PROCEED click') {
            super.pageContinue(formDate);
          }
        },
        error => { }
      );
    } else {
      super.pageContinue(formDate);
    }
  }

  calculateAllSectionsCompleted(pageBlocks: any[]) {
    let returnvalue = true;

    for (let eachBlock of pageBlocks) {
      if (!returnvalue) {
        break
      }

      if (eachBlock.blockName != 'Contact Information') {
        for (let eachSection of eachBlock.pageSections) {
          returnvalue = returnvalue && eachSection.sectionStatus.toLowerCase() == this.cont_completedstatus
          if (!returnvalue) {
            break;
          }
        }
      }
    }

    return returnvalue;
  }

}
