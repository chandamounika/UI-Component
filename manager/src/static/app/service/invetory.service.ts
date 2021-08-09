import { throwError as observableThrowError, of, timer } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Utils } from '../shared/Utils';
import { BaseServices } from './manager-base-services.service';
const endpoint_url = environment.contextPath + '/service/manager/';

@Injectable({
  providedIn: 'root'
})
export class InvetoryService extends BaseServices {

  private testMode: boolean;
  counterValue = 0;
  counterIntervals = [];
  utils: any;
  constructor(http: HttpClient, utils: Utils) {
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
    this.counterValue = 0;
    localStorage.removeItem('inventoryData');
    localStorage.setItem('refreshCounter', this.counterValue.toString());
    this.getInvertoryCache();
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
        this.resetInvertoryCache();
      }
      // console.log(this.counterValue)
      localStorage.setItem('refreshCounter', this.counterValue.toString());
    })

    this.counterIntervals.push(newTimer);

  }

}
