import { OnInit, Directive } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'lodash';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Utils } from '../../shared/Utils';
import { AppService } from '../../service/app.service';
import { MyDeqErrorHandler } from '../errorHandler';
import { BaseComponent } from './basecomponent.component';
import { PageTextGetter } from '../content/pagetext-getter.component';
import { PageConentService } from '../content/content-service.component';

/**
 * AdditionalGetCallDetails is an interface for input fields required while making additional GET call from controller.
 */
interface AdditionalGetCallDetails {
    /**
     * Full service URL.&nbsp;
     *
     * @example 
     *https://mydevtc.azdeq.gov/mydeq-opcert/service/newoperator/whatsneeded
     */
    serviceURL?: string,

    /**
     * Service URL without context path.
     *
     * @example 
     *service/newoperator/whatsneeded
     */
    serviceURLWithoutcontextPath?: string,
    /**
     * Parameters to be appended at end of URL.
     *
     * @example 
     *[12453,73533] => https://mydevtc.azdeq.gov/mydeq-opcert/service/newoperator/whatsneeded/12453/73533
     */
    urlParams?: string[],

    /**
     * Parameters to be appended at as query param in URL.
     * 
     * @example
     * `` `
     * Map{'globalReqId':'342','appId':'887'} =&gt; https://mydevtc.azdeq.gov/mydeq-opcert/service/newoperator/whatsneeded?globalReqId=342&appId=887
     * `` `
     */
    urlQueryParams?: Map<string, string>,

    /**
     * It holds the refence for call back function to be executed after GET call is succeeded.
     */
    successcallBack?: Function,

    /**
     * It holds the refence for call back function to be executed after GET call result in error.
     */
    errorcallBack?: Function
}

/**
 * AdditionalGetCallDetails is an interface for input fields required while making additional PUt call from controller.
 */
interface AdditionalPutCallDetails {
    /**
     * Full service URL.
     * 
     * @example
     * https://mydevtc.azdeq.gov/mydeq-opcert/service/newoperator/whatsneeded
     */
    serviceURL?: string,
    /**
     * Service URL without context path.
     * 
     * @example
     * service/newoperator/whatsneeded
     */
    serviceURLWithoutcontextPath?: string,
    /**
     * Parameters to be appended at end of URL.
     * 
     * @example
     * [12453,73533] => https://mydevtc.azdeq.gov/mydeq-opcert/service/newoperator/whatsneeded/12453/73533
     */
    urlParams?: string[],
    
    /**
     * It holds the refence for an Object to be sent over PUT call.
     */
    putObject?: any,

     /**
     * Parameters to be appended at as query param in URL.
     * 
     * @example
     * Map{'globalReqId':'342','appId':'887'} => https://mydevtc.azdeq.gov/mydeq-opcert/service/newoperator/whatsneeded?globalReqId=342&appId=887
     */
    urlQueryParams?: Map<string, string>,
    /**
     * It holds the refence for call back function to be executed after GET call is succeeded.
     */
    successcallBack?: Function,
    
    /**
     * It holds the refence for call back function to be executed after GET call result in error.
     */
    errorcallBack?: Function
}
/**
 * The BaseController is an abstract class which needs to be extended for creating new page.
 * 
 * It has default implementation to make GET service call on page load and PUT/POST service call on page continue.
 * 
 * 
 * @example
 * export class MyNewPageController extends BaseController
 * {
 * 
 * }
 */
@Directive()
export abstract class BaseController  extends BaseComponent implements OnInit {

    /**
     * Holds the refence for page text object.
     */
    pageText: any = {};
    /**
     * Holds the refence for the GET service response.
     */
    model: any = {};
    /**
     * It consist of error fields list (if any) after POST/PUT service call.
     */
    errorFields: any = [];

    /**
     * It consist of error list after service call.
     */
    errorsList: any = [];

    /**
     * A referance of FORM used for creating a page.
     */
    pageForm: FormGroup;

    /**
     * GET service call name.Same service name is used during PUT/POST service call.
     */
    private pageLoadServiceName: string = null;

    /**
     * Flag indicate if GET serive call to be made on page load.
     */
    protected noGetCallOnLoad: boolean = false;
    /**
     * Flag indicate if SAVE & CONTINUE button to be enanled or disabled
     */
    enableContinue: boolean = true;

    /**
     * Flag to represent if approvedit operation is performed.
     */
    approveEditIndicator: string = 'N';

    /**
     * Holds the value for page review flags.
     */
    pageStatusDetail:any={
        isPageRejected:false,
        isPageApproved:false,
        isPageApproveEdit:false
    }
    

    /**
     * Creates an instance of contorller, associate pagetext & create a form instance.
     */
    constructor(protected activatedRoute: ActivatedRoute,
        protected formBuilder: FormBuilder,
        protected utils: Utils,
        protected appService: AppService,
        protected errorHandler: MyDeqErrorHandler,
        protected _pageTextComp?: PageTextGetter) {
        super();
        if(_pageTextComp){
            PageConentService.getInstance().registerBasePageContent(this, _pageTextComp);
           }
        this.pageForm = this.createForm();       
    }

    /**
     * Sets the service name to be used for GET and PUT/POST service call.
     *
     * @example 
     *setPageLoadServiceName('whats_needed')
     * 
     * @param serviceName
     *
     */
    setPageLoadServiceName(serviceName: string) {
        this.pageLoadServiceName = serviceName;
    }

    /**
     * Returns service name to be used for GET and PUT/POST service call.
     * @returns pageLoadServiceName
     */
    getPageLoadServiceName() {
        return this.pageLoadServiceName;
    }

    /**
     * This method is called within ngOnInit() before making GET service call.
     * 
     * It makes 'urlParams' available to perform any operation intended to be perfom before making GET call.
     * 
     * @example
     * ngOnInitPrerequisit(urlParams: Params =null):void{
     *    console.log('Input URL Params',urlParams)
     * }
     * 
     * @param urlParams 
     */
    ngOnInitPrerequisit(urlParams: Params =null):void{

    }

    /**
     * It perform following task on page load.
     * 
     * 1.Featch URL params.
     * 
     * 2.Call ngOnInitPrerequisit().
     * 
     * 3.Check for noGetCallOnLoad.
     * 
     * 4.Featch QUERY params.
     * 
     * 5.Call populateGetURLParams()
     * 
     * 6.Call populatePageLoadURLQueryParams()
     * 
     * 7.MAKE GET service call.
     * 
     * 8.If success assign service response to model,calculatePageStatus & call onGetResponse().
     * 
     * 9.If error call handleError() & onGettError()
     */
    ngOnInit() {
        
        this.activatedRoute.params.subscribe((urlParams: Params) => {

            this.ngOnInitPrerequisit(urlParams);

            if(this.noGetCallOnLoad){
                return ;
            }

            this.activatedRoute.queryParams.subscribe((queryParams: Params) => {

                this.appService.getServiceCall(this.populateGetURLParams(urlParams,queryParams), this.populatePageLoadURLQueryParams(),
                this.getPageLoadServiceName()).subscribe(
                    response => {
                        this.model = response;
                        this.pageStatusDetail=this.calculatePageStatus(response);
                        this.onGetResponse(this.model);                        
                    },
                    error => {
                        this.handleError(error);
                        this.onGettError(error);
                    });
            });
           
        });
    }

    /**
     * The calculatePageStatus calculates page level review status and return pageStatusDetail Object.
     * 
     * @example
     * calculatePageStatus(response) => {isPageRejected:false, isPageApproved:true, isPageApproveEdit:false}
     * 
     * @param response 
     * @returns pageStatusDetail
     */
    private calculatePageStatus(response:any){

        let pageStatusDetail={
            isPageRejected:false,
            isPageApproved:false,
            isPageApproveEdit:false
        }
        
        if (response.reviewList && response.reviewList.length > 0 ){
            let revisionList = _.filter(response.reviewList, function (n) {
                return n.currentInd === 'C';
              });          

              if(revisionList && revisionList.length > 0 ){

                switch(revisionList[0].status){
                    case 'A':
                    pageStatusDetail.isPageApproved=true;
                        break;
                    case 'AE':
                    pageStatusDetail.isPageApproveEdit=true;
                        break;
                    case 'R':
                    pageStatusDetail.isPageRejected=true;
                        break;
                }
              }
        }      
        
        return pageStatusDetail
     }

    /**
     * This method to be used for making additional GET serive call apart from page load GET call.
     * 
     * @example     * 
     * additionalGetCall({
     *  serviceURL: 'getOutfallList',
     *  urlParams:[198,522],
     *  successcallBack:(response)=> {
     *  this.calculateImpairedOutfallList(formData,navigateToNextPage)
     *  },
     * errorcallBack:(error)=> {
     * this.handleError(error);
     * this.onPutError(error);
     * }
     * })
     *      
     * 
     * @param getCallDetails
     */
    additionalGetCall(getCallDetails: AdditionalGetCallDetails) {
        if (getCallDetails) {
            this.appService.getServiceCall(getCallDetails.urlParams, getCallDetails.urlQueryParams, getCallDetails.serviceURL,
                getCallDetails.serviceURLWithoutcontextPath).subscribe(
                    response => {
                        if (getCallDetails.successcallBack) {
                            getCallDetails.successcallBack(response);
                        }
                    },
                    error => {
                        if (getCallDetails.errorcallBack) {
                            getCallDetails.errorcallBack(error);
                        }
                    });
        }
    }

    /**
     * This method submit page object(make PUT service call).
     * 
     * Following actions are performed while making PUT call
     * 
     * 1.Call createPutObject()
     * 
     * 2.Call populatePutURLParams().
     * 
     * 3.Call populatePutURLQueryParams().
     * 
     * 4.On success it checks if next page is 'ALERT' and calls onAlertPutResponse().
     * 
     * 5.On success it checks if next page is 'ALERT' and if NOT onSuccessPutResponse() is called and navigate to next page depending on navigateToNextPage value (true/false).
     * 
     * 6.In case of error handleError() and onPutError() is called.
     * 
     * @param formData
     * @param navigateToNextPage
     */
    pageContinue(formData: any,navigateToNextPage:boolean=true) {
        this.appService.putServiceCall(this.createPutObject(formData), this.populatePutURLParams(null), this.populatePutURLQueryParams(), this.pageLoadServiceName).subscribe(
            response => {
                if (response.next_page !== 'ALERT') {
                    this.onSuccessPutResponse(response);
                    if(navigateToNextPage){
                        this.utils.navigateTo([this.correctPageName(response.next_page)], true,true);
                    }

                } else {
                    this.onAlertPutResponse(response);
                }
            },
            error => {
                this.handleError(error);
                this.onPutError(error);
                window.scrollTo(0,0);
            });
    }

    /**
     * This method submit page object(make POST service call).
     * 
     * Following actions are performed while making PUT call
     * 
     * 1.Call createPostObject()
     * 
     * 2.Call populatePostURLParams().
     * 
     * 3.Call populatePostURLQueryParams().
     * 
     * 4.On success it checks if next page is 'ALERT' and calls onAlertPostResponse().
     * 
     * 5.On success it checks if next page is 'ALERT' and if NOT onSuccessPostResponse() is called and navigate to next page depending on navigateToNextPage value (true/false).
     * 
     * 6.In case of error handleError() and onPostError() is called.
     * 
     * @param formData
     * @param navigateToNextPage
     */
    postPageContinue(formData: any,navigateToNextPage:boolean=true) {
        this.appService.postServiceCall(this.createPostObject(formData), this.populatePostURLParams(null), this.populatePostURLQueryParams(), this.pageLoadServiceName).subscribe(
            response => {
                if (response.next_page !== 'ALERT') {
                    this.onSuccessPostResponse(response);
                    if(navigateToNextPage){
                        this.utils.navigateTo([this.correctPageName(response.next_page)], true,true);
                    }                    

                } else {
                    this.onAlertPostResponse(response);
                }
            },
            error => {
                this.handleError(error);
                this.onPostError(error);
                window.scrollTo(0,0);
            });
    }

    /**
     * This method to be used for making additional PUT serive call apart from page PUT call.
     * 
     * @example
     * additionalPutCall({
    *  serviceURL: 'validateoperatorinfo',
    *  putObject: formData,
    *  successcallBack:(response)=>{
    *  this.finalPageContinue(formData,navigateToNextPage)
    *  },
    * errorcallBack:(error)=> {
    * this.handleError(error);
    * this.onPutError(error);
    * }
    * })
    * 
    * @param getCallDetails
    */
    additionalPutCall(additionalPutCallDetails: AdditionalPutCallDetails) {
        if (additionalPutCallDetails) {

            this.appService.putServiceCall(additionalPutCallDetails.putObject,
                additionalPutCallDetails.urlParams, additionalPutCallDetails.urlQueryParams,
                additionalPutCallDetails.serviceURL, additionalPutCallDetails.serviceURLWithoutcontextPath)
                .subscribe(
                    response => {
                        additionalPutCallDetails.successcallBack(response);
                    },
                    error => {
                        additionalPutCallDetails.errorcallBack(error);
                    });
        }
    }

    /**
     * This method submit individual section on page (make PUT service call).
     * 
     * Following actions are performed while making PUT call
     * 
     * 1.Call createSectionPutObject().
     * 
     * 2.On success it checks if next page is 'ALERT' and calls onSectionAlertPutResponse().
     * 
     * 3.On success it checks if next page is 'ALERT' and if NOT onSectionSuccessPutResponse() is called.
     * 
     * 4.In case of error handleError() and onSectionError() is called.
     * 
     * @param sectionData
     * @param index
     */
    sectionPut(sectionData: any, index: number) {

        this.appService.saveIndividualServiceCall(this.createSectionPutObject(sectionData[index]), this.pageLoadServiceName).subscribe(
            response => {
                if (response.next_page !== 'ALERT') {
                    this.onSectionSuccessPutResponse(response, index);
                } else {
                    this.onSectionAlertPutResponse(response, index);
                }
            },
            error => {
                this.handleError(error);
                this.onSectionError(error, index);
            });
    }

     /**
     * This method UPDATES individual section on page (make PUT service call).
     * 
     * Following actions are performed while making PUT call
     * 
     * 1.Call createSectionPutObject().
     * 
     * 2.On success it checks if next page is 'ALERT' and calls onSectionAlertUpdateResponse().
     * 
     * 3.On success it checks if next page is 'ALERT' and if NOT onSectionSuccessUpdateResponse() is called.
     * 
     * 4.In case of error handleError() and onSectionError() is called.
     * 
     * @param sectionData
     * @param index
     */
    sectionUpdate(sectionData: any, index: number) {

        this.appService.updateIndividualServiceCall(this.createSectionPutObject(sectionData[index]), this.pageLoadServiceName).subscribe(
            response => {
                if (response.next_page !== 'ALERT') {
                    this.onSectionSuccessUpdateResponse(response, index);
                } else {
                    this.onSectionAlertUpdateResponse(response, index);
                }
            },
            error => {
                this.errorFields = this.errorHandler.getErrorFields(error);
                this.errorsList = this.errorHandler.getErrors(error);
                this.onSectionError(error, index);
            });
    }

     /**
     * This method DELETES individual section on page (make DELETE service call).
     * 
     * Following actions are performed while making PUT call
     * 
     * 1.sectionId is used for service call.
     * 
     * 2.On success it checks if next page is 'ALERT' and calls onSectionAlertDeleteResponse().
     * 
     * 3.On success it checks if next page is 'ALERT' and if NOT onSectionSuccessDeleteResponse() is called.
     * 
     * 4.In case of error handleError() and onSectionError() is called.
     * 
     * @param sectionId
     * @param index
     */
    sectionDelete(sectionId: any, index: number) {
        this.appService.deleteIndividualServiceCall(sectionId, this.pageLoadServiceName).subscribe(
            response => {
                if (response.next_page !== 'ALERT') {
                    this.onSectionSuccessDeleteResponse(response, index);
                } else {
                    this.onSectionAlertDeleteResponse(response, index);
                }
            },
            error => {
                this.handleError(error);
                this.onSectionError(error, index);
            });
    }

    /**
     * This method is called after get service call is succesfull.
     * 
     * @param getResponse
     */
    abstract onGetResponse(getResponse: any): void;

    /**
     *  This method creates a Page level form.
     */
    abstract createForm(): FormGroup;

    /**
    * This method is invoked before PUT service call. It returns an object generated using input formDate.
    * 
    * Default: It return formData.
    * 
    * @param formDate
    * @returns putObject
    */
    createPutObject(formDate: any): any {
        return formDate;
    }

    /**
    * This method is invoked before POST service call. It returns an object generated using input formDate.
    * 
    * Default: It return formData.
    * 
    * @param formDate
    * @returns postObject
    */
   createPostObject(formDate: any): FormData {
        return formDate;
    }

    /**
     * This method creates a section level object to be posted to service.
     * 
     * Default: It return null.
     * 
     * @param formDate
     * @returns postObject
     */
    protected createSectionPutObject(formDate: any): any {
        return null;
    }

    /**
     * This method pupulate get url param array.
     * 
     * Default: It return null.
     * 
     * @param urlParams
     * @param queryParams
     * @returns []
     */
    populateGetURLParams(urlParams: Params,queryParams: Params): any[] {
        return null;
    }

    /**
    * This method returns Query param Map for page load GET call.
    * 
    * Default: It return null.
    * 
    * @returns queryParamMAP
    */
    populatePageLoadURLQueryParams(): Map<string, string> {
        return null;
    }

    /**
     * This method returns an array of parameters for PUT.
     * 
     * Default: It return null.
     * 
     * @param inputObj
     * @returns queryparam[]
     */
    populatePutURLParams(inputObj: any): any[] {
        return null;
    }

    /**
     * This method returns an array of parameters for POST.
     * 
     * Default: It return null.
     * 
     * @param inputObj
     * @returns queryparam[]
     */
    populatePostURLParams(inputObj: any): any[] {
        return null;
    }

    /**
    * This method returns Query param Map for PUT.
    * 
    * Default: It return null.
    * 
    * @returns queryParamMAP
    */
    populatePutURLQueryParams(inputObj: any = null): Map<string, string> {
        return null;
    }

    /**
    * This method returns Query param Map for POST.
    * 
    * Default: It return null.
    * 
    * @returns queryParamMAP
    */
    populatePostURLQueryParams(inputObj: any = null): Map<string, string> {
        return null;
    }

    /**
     *  This method is called on page level put success.
     *  Default: return.
     * 
     * @param response - service response
     * 
     */
    onSuccessPutResponse(response: any): any {
        return;
    }

    /**
     * This method is called on page level PUT success.
     * 
     * Default: return.
     * 
     * @param response - service response
     */
    onSuccessPostResponse(response: any): any {
        return;
    }

    /**
    * This method is called on section level PUT success.
    * 
    * Default: return.
    * 
    * @param response - service response.
    * @param index - section index.
    */
    onSectionSuccessPutResponse(response: any, index: number): any {
        return;
    }

    /**
    *  This method is called on section level update success.
    * Default: return.
    * 
    * @param response - service response.
    * @param index - section index.
    */
    onSectionSuccessUpdateResponse(response: any, index: number): any {
        return;
    }

    /**
    * This method is called on section level delete success.
    * 
    * Default: return.
    * 
    * @param response - service response.
    * @param index - section index.
    */
    onSectionSuccessDeleteResponse(response: any, index: number): any {
        return;
    }

    /**
    * This method is called on page level PUT and next page is ALERT.
    * 
    * Default: return.
    * 
    * @param response - service response.    
    */
    onAlertPutResponse(response: any): any {
        return;
    }

    /**
    *  This method is called on page level POST and next page is ALERT.
    * 
    * Default: return.
    * 
    * @param response - service response.    
    */
    onAlertPostResponse(response: any): any {
        return;
    }

    /**
     * This method is called on section level PUT and next page is ALERT.
     * 
     * Default: return.
     * 
     * @param response - service response.
     * @param index - section index.
     */
    onSectionAlertPutResponse(response: any, index: number): any {
        return;
    }

    /**
     *  This method is called on section level UPDATE and next page is ALERT.
     * 
     * Default: return.
     * 
     * @param response - service response.
     * @param index - section index.
     */
    onSectionAlertUpdateResponse(response: any, index: number): any {
        return;
    }

    /**
     * This method is called on section level DELETE and next page is ALERT.
     * 
     * Default: return.
     * 
     * @param response - service response.
     * @param index - section index.
     */
    onSectionAlertDeleteResponse(response: any, index: number): any {
        return;
    }

    /**
    * This method is called on page level GET service have error.
    * 
    * Default: return.
    * 
    * @param errorObj - error object from GET service.
    */
    onGettError(errorObj: any): void {
        return;
    }

    /**
    * This method is called on page level PUT service have error.
    * 
    * Default: return.
    * 
    * @param errorObj - error object from PUT service.
    */
    onPutError(errorObj: any): void {
        return;
    }

    /**
    * This method is called on page level POST service have error.
    * 
    * Default: return.
    * 
    * @param errorObj - error object from POST service.
    */
    onPostError(errorObj: any): void {
        return;
    }

    /**
    * This method is called on section level PUT service have error.
    * 
    * Default: return.
    * 
    * @param errorObj - error object from section level PUT service.
    * @index index - section index.
    */
    onSectionError(errorObj: any, index: number): void {
        return;
    }

    /**
     * This method to be implemented under each page controller having Page Review.
     * 
     * @example
     * public performActionOnEdit() {
     *   pageForm.enable(true);
     *  }
     * 
     */
    public performActionOnEdit() {
        throw new Error('Method not implemented.');
    }

    /**
     * This method to be implemented under each page controller having Page Review.
     * 
     * @params errObj -approveEdit service error object.
     * 
     * @example
     * public performActionOnEditError(errObj: any) {
     *   this.logger.error('Error while performing Page Edit');
     * }
     * 
     */
    public performActionOnEditError(errObj: any) {
        throw new Error('Method not implemented.');
    }


    /**
     * This method naviagte to previous page depending on 'previous_page' value.
     */
    public goBack() {
        this.utils.navigateTo([this.correctPageName(this.model.previous_page)], true,true);
    }


    /**
     * This method is called from AppComponent when user clicks on EDIT link during revision path.
     * 
     * It performs floowing task.
     * 
     * 1.Calls createUpdateSectionPutObject().
     * 
     * 2.Make PUT service call with service name as 'updatePageStatus'.
     * 
     * 3.On success it calls updateEditIndicator().
     * 
     * 4.In case of error it calls performActionOnEditError().
     */
    public approveEdit() {
        //const tmpArr = this.utils.pageURL.split('/');
        this.appService.putServiceCall(this.createUpdateSectionPutObject(), [this.pageLoadServiceName], null, 'updatePageStatus').subscribe(
            response => {
                this.updateEditIndicator();
            },
            error => {
                this.performActionOnEditError(error);
            });
    }

    /**
     * It updates approveEditIndicator to 'Y' and calls performActionOnEdit().
     */
    private updateEditIndicator() {
        this.approveEditIndicator = 'Y';
        this.performActionOnEdit();
    }

    /**
     * This method checks for Approve Edit indicator: AE OR AREQ and calls updateEditIndicator().
     * 
     * @param response -service response
     */
    /* public isApprovedEdit(response: any) {

        if (response.reviewList && response.reviewList.length > 0) {
            if (response.reviewList[0].status === 'AE' || response.reviewList[0].status === 'AREQ') {
                this.updateEditIndicator();
            }
        }
    } */
    public isApprovedEdit(response: any) {

        if (response.reviewList && response.reviewList.length > 0) {
            if (this.utils.getStatusDetails(response.reviewList[0].status).desc === 'REJECT') {
                this.updateEditIndicator();
            }
        }
    }

    /**
     * It assignes page review from utils to current page instance.
     * 
     * @param obj - current page instance
     */
    public setPageReview(obj: any) {
        obj.reviewComments = this.utils.reviewComments;
    }

    /**
     * This method parse input error object and populate 'errorFields' & 'errorsList' array.
     * 
     * @param error -service error object
     */
    handleError(error: any) {
        this.errorFields = this.errorHandler.getErrorFields(error);
        this.errorsList = this.errorHandler.getErrors(error);
    }

    /**
     * This method clears 'errorFields' & 'errorsList' array.
     */
    public clearError(){
        this.errorFields = [];
        this.errorsList = [];
    }

    /**
     * This method corrects the input page name by converting it to lower case and replacing '_' with '-'
     * 
     * @example
     * correctPageName('WHATS_NEEDED') => whats-needed
     * 
     * @param servicePageName - page name returned by service
     * @returns corrected pageName
     */
    protected correctPageName(servicePageName:string){
        return servicePageName.toLowerCase().replace(/_/g, '-');
    }
    
    /**
     * This method creates returns empty Object.
     * 
     * @returns empty object {}
     */
    createUpdateSectionPutObject (): any {
        return {};
    }
}
