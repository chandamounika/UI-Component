import { throwError as observableThrowError, of, timer } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Utils } from '../shared/Utils';
import { BaseServices } from './manager-base-services.service';
import { SortingService } from './sorting.service';
const endpoint_url = environment.contextPath + '/service/manager/';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class InvetoryService extends BaseServices {
   private refreshCacheSubject = new BehaviorSubject({refresh: false});
   refreshCache = this.refreshCacheSubject.asObservable();
  private testMode: boolean;
  counterValue = 0;
  counterIntervals = [];
  utils: any;

  constructor(http: HttpClient, utils: Utils, private sortingService: SortingService) {
    super(http, utils);
    this.testMode = environment.testMode;

  }

  getInventory(serviceName: string) {
    let url = endpoint_url + this.utils.processName + serviceName;
    console.log("url ", url, this.testMode)
    if (this.testMode) {
      return of(environment.inventory);
    }
    return this.getServiceCall(url);
  }

  async setInvertoryCache(data: string) {
    localStorage.setItem('inventoryData', data);
  }

  async getInvertoryCache() {
    if (localStorage.getItem('inventoryData')) {
      return JSON.parse(localStorage.getItem('inventoryData'));
    } else {
      let serviceName = 'inventory';
      await this.getInventory(serviceName).subscribe(
        response => {
          const invendatasting = JSON.stringify(response);
          this.setInvertoryCache(invendatasting);
        },
      );
      return JSON.parse(localStorage.getItem('inventoryData'));
    }
  }

  resetInvertoryCache() {
    let reqType =  this.getreqType();
    this.counterValue = 0;
    localStorage.removeItem('inventoryData');
    localStorage.setItem('refreshCounter', this.counterValue.toString());
    this.getInvertoryCache();
    this.sortingService.resetSearchCache(reqType + '-SearchValue');
    this.sortingService.resetSortFilters(reqType + '-Sort');

    return true;
  }

  setRefreshCounter() {
    if (this.counterIntervals.length != 0) {
      this.counterIntervals.forEach(intrvl => {
        intrvl.unsubscribe();
      })
    }

    const newTimer = timer(1000, 1000).subscribe(sec => {
      this.counterValue = localStorage.getItem('refreshCounter') ? parseInt(localStorage.getItem('refreshCounter')) + 1 : 0
      // 86400
      if (this.counterValue > 86400) {
        this.refreshCacheSubject.next({refresh:true});
      }
      localStorage.setItem('refreshCounter', this.counterValue.toString());
    })

    this.counterIntervals.push(newTimer);

  }

  setreqType(reqType){
    localStorage.setItem('reqType', reqType);
  }
  getreqType(){
    return localStorage.getItem('reqType');
  }


}
