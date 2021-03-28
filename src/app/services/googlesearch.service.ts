import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GooglesearchService {

  queryReplacement: string ='';
  searchResult: Observable<any>;



  constructor(private http: HttpClient) { }

  myCustomFunction(data){
    console.log("callback: ",data);
  }
  getResults(query: string){
    let _url = `http://suggestqueries.google.com/complete/search?client=firefox&q=${query}`;
    
    //let _url = `https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&format=json&callback=myCustomFunction&search=${query}`;
    //let _url = `https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&format=json&search=${query}`;
    //let _url = `https://api.github.com/users/${query}/repos`;
    
    this.http.get(_url).subscribe(res =>{
      console.log(res);
    });
    
    this.searchResult = this.http.get(_url);


    console.log("URL: "+_url);
    console.log("Service called with param: "+query);
    
    //let stringResult = JSON.stringify(this.searchResult); //String(rawResult);
    let stringResult: string;

    this.searchResult.subscribe(data => {
      console.log("Data:\n",data);
    });
    console.log('Result:\n',stringResult);
    
  }
}
