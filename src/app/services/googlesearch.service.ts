import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GooglesearchService {

  queryReplacement: string ='';
  searchResult: Observable<any>;

  httpOptions = {
    headers: new HttpHeaders({ 'Access-Control-Allow-Origin': '*' })  
  };


  constructor(private http: HttpClient) { }


  getResults(query: string){
    let _url = `https://www.google.com/complete/search?q=${query}&cp=4&xssi=t&client=gws-wiz&hl=en-IN`;
    
    
    this.http.get(_url).subscribe(res =>{
      console.log("Result: ",res);
    });

    this.searchResult = this.http.get(_url, this.httpOptions);


    //console.log("URL: "+_url);
    //console.log("Service called with param: "+query);
    
    //let stringResult = JSON.stringify(this.searchResult); //String(rawResult);
    let stringResult: string;

    this.searchResult.subscribe(data => stringResult = data);
    //console.log('Result:\n',stringResult);
    
  }
}
