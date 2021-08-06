import {Injectable} from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgbAccordionConfig, NgbDatepickerConfig, NgbModal, NgbActiveModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import * as _ from 'lodash';
// tslint:disable:max-line-length

/**
 * Utility Class
 */
@Injectable()
export class Utils {

  showLoadingSign = false;

  alertTitle: any;

  dateSetting: any;

  path: string;

  piwikSiteIds: any[];

  ANALYTICS: any;

  tooltipText: any;
  ALERT: any;

  navigationExtras: NavigationExtras;

  TITLE_ENUM: any;

  valueStreamList: any[] = [];

  unitList: any[] = [];

  user: any = { };

  titleRegEx = '^[a-zA-Z0-9 \.\_\-]+';

  numberRegEx = '^[0-9\.]+';

  requestId: string;

  appId: string;

  private methodCalls: string[] = [];

  processName:string;

  pageMetaData:any = {};

  constructor(
    private router: Router,
    public dpConfig: NgbDatepickerConfig,
    private accordionConfig: NgbAccordionConfig,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public config:NgbModalConfig
  ) {
    config.backdrop ='static';
   // const todayDate = new Date();
    accordionConfig.type = 'primary';
    const now = new Date();
    dpConfig.minDate = {year: 2010, month: 1, day: 1};
    dpConfig.maxDate = {year: Math.max(now.getFullYear(),2021), month: 12, day: 31};
/* 
    this.dateSetting = {
      minDate: '01/01/2000',
      maxDate: todayDate,
      disableDays: [],
      toContainPrevMonth: false,
      toContainNextMonth: false,
      value: todayDate
    }; */

    this.alertTitle = {
      SUBMITTED: 'ALERT: APPLICATION FORM ALREADY SUBMITTED',
    };

    this.alertTitle = {
      SUBMITTED: 'ALERT: APPLICATION FORM ALREADY SUBMITTED',
    };

    this.ALERT = {
      OUTCOME_NEEDED : {
        title: 'ALERT',
        msg: 'To submit a CI idea, your idea must either have a mission outcome or impact customer experience. If the idea doesn\'t accomplish either, please click EXIT. To continue, click CANCEL and select one or both options.',
        mainButtonText: 'EXIT',
        mainButtonCTA: '/ci-tracker/idea',
        leftButtonText: 'CANCEL'
      }
    };

    this.piwikSiteIds = [
      { hostName: 'localhost', siteId: 1 },
      { hostName: 'mydev.azdeq.gov', siteId: 1 },
      { hostName: 'myqa.azdeq.gov', siteId: 3 },
      { hostName: 'myuat.azdeq.gov', siteId: 5 },
      { hostName: 'mybeta.azdeq.gov', siteId: 4 },
      { hostName: 'my.azdeq.gov', siteId: 6 }
    ];

    this.ANALYTICS = {
      'CATEGORY': 'CITacker',
      'GET_BILL_INFO': 'GET BILL INFORMATION',
      'PAY_NOW': 'Pay Now'
    };

    this.tooltipText = {
      TRUE_NORTH: '<strong>ADEQ\'s True North</strong> <p>To be the No. 1 state in the nation, providing:</p><ul> <li> Balanced, leading-edge environmental protection</li><li>Technical and operational excellence</li> <li>Radical simplicity for customer and staff </li> </ul>',
      COUNTERMEASURE: '<strong>Countermeasure:</strong> Action taken to reduce or eliminate the root cause of a problem, preventing you or your team from reaching agency goals. Countermeasures should solve problems at their root-cause, following an analysis that identified the ultimate source of a problem and not merely fixes the symptoms.',
      NEW_IDEA : '<strong>New Idea:</strong> Idea developed as a result of problem-solving activities or individual/team brainstorming and improves processes.',
      IMPACT : '<strong>Impact:</strong> When an action positively changes an outcome. ADEQ strives to improve mission outcomes by positively affecting quality, cost, delivery and people development, as well as customer experience.'
    };

    // Set navigation extras object
    // that passes on global query params and fragment
    this.navigationExtras = {
      // preserveQueryParams: true,
      preserveFragment: false
    };

    this.TITLE_ENUM = {
        add: 'LOG A COMPLETED CONTINUOUS IMPROVEMENT (CI)',
        list: 'IMPROVEMENTS INVENTORY',
        modify: 'SUBMIT DMR',
        report: 'REPORTS',
    };

  }

   /**
   * Opens NGBootstrap modal.
   */
  openNGBootstrapModal = (content: any, modelSize?: 'sm' | 'lg') => {
    this.modalService.open(content, { size: modelSize ? modelSize : 'lg' });
  }
 
  /**
   * Method to navigate between pages.
   */
  navigateTo = (pageName: string [], includeRequestParam: boolean=false) => {
      let url: string [];
      if (pageName) {
        url = ['applications/'].concat(pageName);
      } else {
        url = ['applications'];
      }

      if (includeRequestParam) {
          this.router.navigate(url, this.navigationExtras);
      } else {
          this.router.navigate(url);
      }
  }

  /**
   * Method to navigate to pending inventory page.
   */
  navigateToDashboard() {
    this.navigateTo(['pendingpermits'], false);
  }

  public getPiwikSiteId = (hostname) => {
    for (let i = 0; i < this.piwikSiteIds.length; i++) {
      const piwikSite = this.piwikSiteIds[i];
      if (piwikSite.hostName === hostname) {
        return piwikSite.siteId;
      }
    }
    return 1;
  }

  /**
   * Performs null check.
   */
  orEmpty = (entity) => {
    // http://stackoverflow.com/questions/20572016/javascript-string-concatenation-behavior-with-null-or-undefined-values
    // entity || "" will cause true to return "true" but false to return ""
    // both null == null and undefined == null are true
    if (entity == null) {
      return '';
    } else {
      return entity;
    }
  }

  /**
   * Show loading symbol.
   * @param callingMethodname 
   */
  showLoading(callingMethodname: string = null) {
    if (callingMethodname) {
      this.methodCalls.push(callingMethodname);
    }
    setTimeout(() => this.showLoadingSign = true, 0);
  }

  /**
   * Removes loading symbol.
   * @param callingMethodname 
   */
  closeLoading(callingMethodname: string = null) {
    if (callingMethodname) {
      _.pull(this.methodCalls, callingMethodname);
    }
    if (this.methodCalls && this.methodCalls.length === 0) {
      setTimeout(() => this.showLoadingSign = false, 0)
    }
  }

  closeConfirm = (popOverId: string) => {
    document.getElementById(popOverId).click();
  }

  downloadReport(ciIdeaId: string, isMessaging: string) {
    if (isMessaging === 'Y') {
      window.open('/ci-tracker/service/document?ciIdeaId=' + ciIdeaId, '_blank');
    }
  }

  /* configureDatePicker(allowFutureDate: boolean) {
    const todayDate = new Date();
    const maxYear: number = allowFutureDate ? todayDate.getFullYear() + 100 : todayDate.getFullYear();
    const month: number = allowFutureDate ? 12 : todayDate.getMonth() + 1;
    const day: number = allowFutureDate ? 31 : todayDate.getUTCDate();
    this.dpConfig.minDate = { year: 1900, month: 1, day: 1 };
    this.dpConfig.maxDate = { year: maxYear, month: month, day: day};
  } */

  /**
   * Convert Date object to string.
   * 
   * @param dateObj 
   */
  convertDateToString(dateObj:any){
    if (dateObj instanceof Object) {
      return this.prepandZero(dateObj.month) + '/' + this.prepandZero(dateObj.day) + '/' + dateObj.year;
    }
    return dateObj;
  }

  /**
   * Convert String to Date Object.
   * 
   * @param dateStr 
   */
  convertStringToDate(dateStr:string){
    if (!dateStr) {
      return null;
    }
    const dated = new Date(dateStr);
    return { year: dated.getFullYear(), month: dated.getMonth() + 1, day: dated.getUTCDate() };
  }

  /**
   * Prepand Zero to input number.
   * 
   * @param inputNum 
   */
  private prepandZero(inputNum:number){
    return inputNum < 10 ? "0"+inputNum : inputNum+"";
  }

  trimWhiteSpaceAroundBoundary(inputJson:any):string {
    return JSON.parse(JSON.stringify(inputJson), function (key, val) { return typeof val === 'string'? val.trim() : val; }); 
  }


  // openNGBootstrapModal = (content: any, modelSize?: 'sm' | 'lg') => {
  //   this.modalService.open(content, { size: modelSize ? modelSize : 'lg' });
  // }

  /**
   * Appand 'tobeAppendend' string to 'parentString' if 'tobeAppendend' not null.
   * 
   * @param parentString 
   * @param tobeAppendend 
   */
  public checkNullAndAppand(parentString: string, tobeAppendend: string) {
    if (tobeAppendend) {
      return parentString + tobeAppendend;
    }
    return parentString;
  }
}
