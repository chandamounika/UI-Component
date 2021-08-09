import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class SortingService {

  constructor() {   }

  setSortHeaderType(key, sortKey, sortOrder) {
    let headers = {};
    headers[sortKey] = sortOrder
    localStorage.setItem(key, JSON.stringify(headers));
  }

  getSortHeaderType(key , theaders){
    let headers = {};
    if (localStorage.getItem(key)) {
      headers = JSON.parse(localStorage.getItem(key));
    }

    theaders.forEach(field => {
      for(let [key , val] of Object.entries(headers)){
        if(field.sortKey == key){
            field.sortOrder = true;
        }else{
          field.sortOrder = false;
        }
      }
    });
    return theaders;
  }

  getSortType(key, sortKey){
    let headers = {};
    if (localStorage.getItem(key)) {
      headers = JSON.parse(localStorage.getItem(key));
    }
   return headers[sortKey];
  }

  resetSortFilters(key){
    localStorage.removeItem(key);
  }

  resetSearchCache(key){
    localStorage.removeItem(key);
  }

}
