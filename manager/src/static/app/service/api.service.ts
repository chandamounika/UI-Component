import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  getFilterSampleData(): Observable<any> {
    let url = 'assets/json/sample.json'
    return this.http.get(url).pipe();
  }

  getFilterResultData(): Observable<any> {
    let url = 'assets/json/result.json'
    return this.http.get(url).pipe();
  }



}
