import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Utils } from '../shared/Utils';
import { throwError as observableThrowError, of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {filter} from 'lodash-es';

const endpoint_url: string = environment.contextPath + '/service/';

/**
 * This service class have core http service implementation of GET,PUT,POST & DELETE
 */
@Injectable()
export class AppService {

    http: HttpClient;
    testMode: boolean;
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(http: HttpClient, public utils: Utils) {
        this.http = http;
        this.testMode = environment.testMode;
    }

    /**
     * Performs GET HTTP call.
     * 
     * NOTE: Either of the inputServiceName OR serviceURL needs to be specified.
     * 
     * @param inputParamArr : URL param array.
     * @param inputQueryParamMap : URL query param array.
     * @param inputServiceName : Service Name
     * @param serviceURL : Service URL.
     * 
     * @example  1. getServiceCall(['secure','822'],{'appId':'430','reqId':'73535'},'getDetails')
     *          
     *           2.getServiceCall(['secure','822'],{'appId':'430','reqId':'73535'},null,'mydeq-aircc/new/getDetails')
     */
    getServiceCall(inputParamArr: any[] = null,inputQueryParamMap: Map<string,string> = null,
         inputServiceName: string = null, serviceURL: string = null): Observable<any> {
        if (this.testMode) {
            let URL: string = this.getServiceURL({ endPointURL: endpoint_url, serviceName: inputServiceName }, serviceURL);
            URL = this.appendParameters(inputParamArr, URL);
            URL = this.appendGlbReqId(URL);
            URL = this.appendQueryParameters(inputQueryParamMap, URL);
            if (serviceURL) {
                const tmpArr = serviceURL.split('/');
                return of(this.getMockData('GET_' + tmpArr[tmpArr.length - 1]));
           } else {

                if(inputServiceName){
                    return of(this.getMockData('GET_' +inputServiceName.split("/").join('')));
                }
                return of(this.getMockData('GET_' +inputServiceName));
            }
           
        }
        this.utils.showLoading(inputServiceName);
        let url: string = this.getServiceURL({ endPointURL: endpoint_url, serviceName: inputServiceName },serviceURL);
        url = this.appendParameters(inputParamArr, url);
        url = this.appendGlbReqId(url);
        url = this.appendQueryParameters(inputQueryParamMap, url);
        return this.http
            .get(url, { observe: 'response' })
            .pipe(
                map((response) => this.extractData(response, true, inputServiceName)),
                catchError((error) => this.handleError(error, true, inputServiceName))
            );
    }


   /**
     * Performs PUT HTTP call.
     * 
     * NOTE: Either of the inputServiceName OR serviceURL needs to be specified.
     * 
     * @param putObj : Object to be put.
     * @param inputParamArr : URL param array.
     * @param inputQueryParamMap : URL query param array.
     * @param inputServiceName : Service Name
     * @param serviceURL : Service URL.
     * 
     * @example  1. putServiceCall({fName:'Rick',lName:'WoodLand'},['secure','822'],{'appId':'430','reqId':'73535'},'getDetails')
     *          
     *           2.putServiceCall({fName:'Rick',lName:'WoodLand'},['secure','822'],{'appId':'430','reqId':'73535'},null,'mydeq-aircc/new/getDetails')
     */
    putServiceCall = (putObj: any, inputParamArr: any[] = null,inputQueryParamMap: Map<string,string> = null, inputServiceName: string = null, serviceURL: string = null)
        : Observable<any> => {

        if (this.testMode) {
            let URL: string = this.getServiceURL({ endPointURL: endpoint_url, serviceName: inputServiceName }, serviceURL);
            URL = this.appendParameters(inputParamArr, URL);
            URL = this.appendGlbReqId(URL);
            console.log('Put' + inputServiceName, URL, putObj);
            return of(this.getMockData('PUT_' + inputServiceName));
        }
        this.utils.showLoading(inputServiceName);
        let url: string = this.getServiceURL({ endPointURL: endpoint_url, serviceName: inputServiceName });
        url = this.appendParameters(inputParamArr, url);
        url = this.appendQueryParameters(inputQueryParamMap, url);
        return this.http
            .put(url, putObj, this.httpOptions)
            .pipe(
                map((response) => this.extractData(response, true, inputServiceName)),
                catchError((error) => this.handleError(error, true, inputServiceName))
            );
    }

    /**
     * Performs POST HTTP call.
     * 
     * NOTE: Either of the inputServiceName OR serviceURL needs to be specified.
     * 
     * @param postObj : Object to be posted.
     * @param inputParamArr : URL param array.
     * @param inputQueryParamMap : URL query param array.
     * @param inputServiceName : Service Name
     * @param serviceURL : Service URL.
     * 
     * @example  1. postServiceCall({fName:'Rick',lName:'WoodLand'},['secure','822'],{'appId':'430','reqId':'73535'},'getDetails')
     *          
     *           2.postServiceCall({fName:'Rick',lName:'WoodLand'},['secure','822'],{'appId':'430','reqId':'73535'},null,'mydeq-aircc/new/getDetails')
     */
    postServiceCall = (postObj: FormData, inputParamArr: any[] = null,inputQueryParamMap: Map<string,string> = null, inputServiceName: string = null, serviceURL: string = null)
        : Observable<any> => {

        if (this.testMode) {
            let URL: string = this.getServiceURL({ endPointURL: endpoint_url, serviceName: inputServiceName }, serviceURL);
            URL = this.appendParameters(inputParamArr, URL);
            URL = this.appendGlbReqId(URL);
            console.log('POST' + inputServiceName, URL, postObj);
            return of(this.getMockData('POST_' + inputServiceName));
        }
        this.utils.showLoading(inputServiceName);
        let url: string = this.getServiceURL({ endPointURL: endpoint_url, serviceName: inputServiceName });
        url = this.appendParameters(inputParamArr, url);
        url = this.appendQueryParameters(inputQueryParamMap, url);
        return this.http
            .post(url, postObj)
            .pipe(
                map((response) => this.extractData(response, true, inputServiceName)),
                catchError((error) => this.handleError(error, true, inputServiceName))
            );
    }

    /**
     * Performs PUT HTTP call.
     * 
     * It creates following URL pattern <context>/<path>/save/<serviceName>;
     * 
     * NOTE: Either of the inputServiceName OR serviceURL needs to be specified.
     * 
     * @param putObj : Object to be put.    
     * @param inputServiceName : Service Name    
     * 
     * @example  saveIndividualServiceCall({fName:'Rick',lName:'WoodLand'},'saveDetails') 
     
     */
    saveIndividualServiceCall = (putObj: any, inputServiceName: string = null): Observable<any> => {
        if (this.testMode) {
            let URL: string = this.getServiceURL({ endPointURL: endpoint_url, addSave: true, serviceName: inputServiceName });
            console.log('saveIndividualServiceCall', URL);
            return of(this.getMockData('indSave'));
        }
        this.utils.showLoading(inputServiceName);
        const url: string = this.getServiceURL({ endPointURL: endpoint_url, addSave: true, serviceName: inputServiceName });

        return this.http
            .put(url, putObj, this.httpOptions)
            .pipe(
                map((response) => this.extractData(response, true, inputServiceName)),
                catchError((error) => this.handleError(error, true, inputServiceName))
            );
    }

     /**
     * Performs PUT HTTP call.
     * 
     * It creates following URL pattern <context>/<path>/update/<serviceName>;
     * 
     * NOTE: Either of the inputServiceName OR serviceURL needs to be specified.
     * 
     * @param putObj : Object to be put.    
     * @param inputServiceName : Service Name    
     * 
     * @example  updateIndividualServiceCall({fName:'Rick',lName:'WoodLand'},'saveDetails') 
     
     */
    updateIndividualServiceCall = (putObj: any, inputServiceName: string = null): Observable<any> => {
        if (this.testMode) {
            const URL: string = this.getServiceURL({ endPointURL: endpoint_url, addupdate: true, serviceName: inputServiceName });
            console.log('updateIndividualServiceCall', URL);
            return of(this.getMockData('indSave'));
        }
        this.utils.showLoading(inputServiceName);
        const url: string = this.getServiceURL({ endPointURL: endpoint_url, addupdate: true, serviceName: inputServiceName });

        return this.http
            .put(url, putObj, this.httpOptions)
            .pipe(
                map((response) => this.extractData(response, true, inputServiceName)),
                catchError((error) => this.handleError(error, true, inputServiceName))
            );
    }

    /**
     * Performs DELETE HTTP call.
     * 
     * It creates following URL pattern <context>/<path>/delete/<serviceName>;
     * 
     * NOTE: Either of the inputServiceName OR serviceURL needs to be specified.
     * 
     * @param sectionId : Id of the section to be deleted.
     * @param inputServiceName : Service Name    
     * 
     * @example  deleteIndividualServiceCall(4,'deleteDetails') 
     
     */
    deleteIndividualServiceCall = (sectionId: string, inputServiceName: string = null): Observable<any> => {
        if (this.testMode) {
            const URL: string = this.getServiceURL({ endPointURL: endpoint_url, adddelete: true, serviceName: inputServiceName })
                + '/' + sectionId;
            console.log('deleteIndividualServiceCall', URL);
            return of(this.getMockData('deleteSection'));
        }
        this.utils.showLoading(inputServiceName);
        const url: string = this.getServiceURL({ endPointURL: endpoint_url, adddelete: true, serviceName: inputServiceName })
            + '/' + sectionId;
        return this.http
            .delete(url, this.httpOptions)
            .pipe(
                map((response) => this.extractData(response, true, inputServiceName)),
                catchError((error) => this.handleError(error, true, inputServiceName)));
    }

     /**
     * Performs DELETE HTTP call.
     * 
     * It creates following URL pattern <context>/<path>/delete/<serviceName>;
     * 
     * NOTE: Either of the inputServiceName OR serviceURL needs to be specified.
     * 
     * @param deleteFieldId : Id of a field to be deleted.
     * @param inputServiceName : Service Name    
     * 
     * @example  deleteServiceCall(4,'deleteFile') 
     
     */
    deleteServiceCall = (deleteFieldId: string, inputServiceName: string = null): Observable<any> => {
        if (this.testMode) {
            const URL: string = this.getServiceURL({ endPointURL: endpoint_url,  serviceName: inputServiceName })
                + '/' + deleteFieldId;
            console.log('deleteServiceCall', URL);
            return of(this.getMockData('DELETE_' + inputServiceName));
        }
        this.utils.showLoading(inputServiceName);
        const url: string = this.getServiceURL({ endPointURL: endpoint_url, serviceName: inputServiceName })
            + '/' + deleteFieldId;
        return this.http
            .delete(url, this.httpOptions)
            .pipe(
                map((response) => this.extractData(response, true, inputServiceName)),
                catchError((error) => this.handleError(error, true, inputServiceName)));
    }


    /**
     * Append parameters from array to URL.
     * 
     * @param inputParamArr 
     * @param url 
     * 
     */
    private appendParameters(inputParamArr: any[] = null, url: string) {
        if (inputParamArr) {
            inputParamArr.forEach(urlParam => {
                if (urlParam) {
                    url = url + '/' + urlParam;
                }
            });
        }
        return url;
    }

    /**
     * Appends query parameters to URL.
     * 
     * @param inputQueryParamMap 
     * @param url 
     */
    private appendQueryParameters(inputQueryParamMap: Map<string,string>, url: string) {
        if (inputQueryParamMap) {
            url=url+'?';
            inputQueryParamMap.forEach(function(value, key, map){
                url=url+key+'='+value+'&';
            });
        }

        return url;
    }

    /**
     * Retrives place details by staging Id.
     * 
     * @param stagingPlaceID 
     * @param companyCustID 
     */
    getPlaceDetailsByStagingID(stagingPlaceID, companyCustID): Observable<any> {
        if (this.testMode) {
            return of(this.getMockData('stagingResponse'));
        }
        const url = 'newPlace/details/' + companyCustID + '/' + (stagingPlaceID ? stagingPlaceID : 0);
        return this.http
            .get(url, { observe: 'response' })
            .pipe(
                map((response) => this.extractData(response, false)),
                catchError((error) => this.handleError_PlaceDetails(error)));
    }

    /**
     * Retrives place details by place id.
     * 
     * @param placeID 
     */
    getPlaceDetailsByPlaceID(placeID: string): Observable<any> {
        if (this.testMode) {
            return of(this.getMockData('stagingResponse'));
        }
        const url = 'place/detail?placeId=' + (placeID ? placeID : 0);
        return this.http
            .get(url, { observe: 'response' })
            .pipe(
                map((response) => this.extractData(response, false)),
                catchError((error) => this.handleError_PlaceDetails(error)));
    }

    /**
     * Retrives place details by global request id.
     * 
     */
    getPlaceDetailsByGlbReqId(): Observable<any> {
        if (this.testMode) {
            return of(this.getMockData('stagingResponse'));
        }
        const url = 'placebar/detail?path=' + this.utils.path;
        return this.http
            .get(url, { observe: 'response' })
            .pipe(
                map((response) => this.extractData(response, false)),
                catchError((error) => this.handleError_PlaceDetails(error)));
    }

    //GIS SERVICE
  async getGisURLS() {
    if (this.testMode) {
      return  of(environment.gisURLS).toPromise();
      //return observableThrowError(environment.gisURLSERR).toPromise();

    }
    this.utils.showLoading('getGisURLS');
    const url = 'service/gisUrls';
    return this.http
      .get(url, { observe: 'response' })
      .pipe(
        map((response) => this.extractData(response, true, 'getGisURLS')),
        catchError((error) => this.handleError(error, true, 'getGisURLS'))
      ).toPromise();
  }

    //COMMON SERVICE
    public handleError_PlaceDetails(error) {
        return observableThrowError(error.error);
    }

    public handleError(error: HttpErrorResponse, displayloading = true, callingMethodName: string = null) {
        if (displayloading) {
            this.utils.closeLoading(callingMethodName);
        }
        return observableThrowError(error.error);
    }

    /**
     * Extracts data from service response.
     * 
     * @param res : HTTP Reponse
     * @param displayloading : Display loading flag.
     * @param callingMethodName : Calling method name.
     */
    public extractData(res: HttpResponse<any> | any, displayloading = true, callingMethodName: string = null) {
        if (displayloading) {
            this.utils.closeLoading(callingMethodName);
        }
        if (res && res.body) {
            if (res.body.reviewList && res.body.reviewList.length > 0) {
                let arrayObj: any[] = []
                arrayObj = res.body.reviewList;
                res.body.reviewList = filter(arrayObj, function (n) {
                    return n.currentInd === 'C';
                });
                this.utils.setPageComments(res.body.reviewList);
            }
            /* if(res.body.displayType) { */
                this.utils.setPageTitle ();
           /*  } */
            //this.utils.setPageComments(res.body.reviewList);
            return res.body;
        }
        return res;
    }

    /**
     * Checks 200 ok response.
     */
    public checkOKResponse(res: HttpResponse<any> | any, displayloading = true, callingMethodName: string = null) {
        if (displayloading) {
            this.utils.closeLoading(callingMethodName);
        }
        return (200 === res.status);
    }

    /* public appendParms(placeID: string, ltfID: string, url: string): string {
        let returnURL = url;
        if (ltfID) {
            returnURL += '?permitId=' + ltfID + '&placeId=' + placeID;
        }
        return returnURL;
    } */

    /**
     * Append global request ID to URL.
     * 
     * @param url 
     */
    public appendGlbReqId(url: string) {
        let returnURL = url;
        if (this.utils.glbReqId) {
            returnURL += '/' + this.utils.glbReqId;
            this.utils.glbReqId = null;
        }
        return returnURL;
    }

    /**
     * Returns URL as per type.
     * 
     * @param serviceURLObj 
     * @param serviceURL 
     */
    private getServiceURL(serviceURLObj: any = null, serviceURL: string = null) {

        if (serviceURLObj.addSave) {
            return serviceURLObj.endPointURL + this.utils.path + '/save/' + serviceURLObj.serviceName;
        } else if (serviceURLObj.addupdate) {
            return serviceURLObj.endPointURL + this.utils.path + '/update/' + serviceURLObj.serviceName;
        } else if (serviceURLObj.adddelete) {
            return serviceURLObj.endPointURL + this.utils.path + '/delete/' + serviceURLObj.serviceName;
        } else if (serviceURLObj.serviceName) {
            return serviceURLObj.endPointURL + this.utils.path + '/' + serviceURLObj.serviceName;
        } else {
            return serviceURL;
        }
    }

    /**
     * Returns mock data object as per mockdatakey.
     * 
     * @param mockDataKey 
     */
    private getMockData(mockDataKey: string) {
        //console
        let returnObj = {};

        console.log(`this.utils.path====>: ${this.utils.path}`);
        console.log(`mockDataKey====>: ${mockDataKey}`);
        
        if (this.utils.path && this.utils.path.length > 0 && environment[this.utils.path.length-1] && environment[this.utils.path.length-1][mockDataKey]) {
            returnObj = environment[this.utils.path][mockDataKey];
        } else if (environment[mockDataKey]) {
            returnObj = environment[mockDataKey];
        }
        if(returnObj['reviewList']) {
            this.utils.setPageComments(filter(returnObj['reviewList'], function (n) {
                return n.currentInd === 'C';
            }));
        }
        
        this.utils.setPageTitle ();
        
        console.log(returnObj)
        return returnObj;
    }
}
