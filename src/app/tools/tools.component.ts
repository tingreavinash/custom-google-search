import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FiletypesService } from '../services/filetypes.service';
import { GooglesearchService } from '../services/googlesearch.service';
import { ImagetypesService } from '../services/imagetypes.service';
import { WebsitesService } from '../services/websites.service';
import { FileType } from '../shared/filetype';
import { ImageType } from '../shared/imageType';
import { Website } from '../shared/website';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  @ViewChild('searchResultTag', {static: true}) searchResultTag: ElementRef;
  @ViewChild('inputBox') inputBox: ElementRef;
  @ViewChild('resultlistDiv') resultlistDiv: ElementRef;

  searchAutocompleteResult: string[];
  searchResultOriginal: string[];
  isListOpen: boolean ;

  siteOption: boolean;
  imageOption: boolean;
  newsOption: boolean;
  filesOption: boolean;

  
  availableWebsites: Website[];
  availableImageTypes: ImageType[];
  availableFiletypes: FileType[];

  selectedWebsiteOption: String;
  
  selectedWebsite: Website;
  selectedImageType: ImageType;
  selectedFiletypes: string[] = [];
  userGivenFiletype: string;

  selectedImageSize: string;
  selectedTimeDuration: string ="";

  isDisabled: boolean = true;
  searchQuery: string;
  googleSearchURL: string = 'http://www.google.com/search';
  fullSearchURL: string;
  filterCondition: string = '';
  matchFullPhrase: boolean = false;

  loadAPI: Promise<any>;


  constructor(private websiteService: WebsitesService,
    private imageService: ImagetypesService,
    private fileService: FiletypesService,
    private googleService: GooglesearchService,
    private renderer: Renderer2) {

    this.availableWebsites = websiteService.getWebsites();
    this.selectedWebsite = new Website();
    this.selectedImageType = new ImageType();
    this.availableFiletypes = fileService.getFileTypes();

    this.availableImageTypes = imageService.getImageTypes();

    this.renderer.listen('window', 'click', (event: Event) =>{
      if (event.target !== this.inputBox.nativeElement ){
        //console.log("making false");
          this.isListOpen =false;
        }
    });
    
  }

  ngOnInit(): void {
   
  }

  clearFileTypeSelection(){
    this.selectedFiletypes = [];
  }

  isOtherOptionSelected() {

    if (this.selectedWebsite.name === 'Other') {
      
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  appendString(condition: string) {
    this.filterCondition += condition;

  }

  createFullPhrase(inputString: string): string {
    let formattedString = '\"';
    formattedString += inputString;
    formattedString += '\"';
    return formattedString;
  }

  createSearchQuery() {
    this.fullSearchURL = this.googleSearchURL;
    let formattedSearchString: string =  this.searchQuery;
    if (this.matchFullPhrase) {
      formattedSearchString = this.createFullPhrase(this.searchQuery);
    }
    if (this.siteOption ) {
      this.appendString("?q=site:" + this.selectedWebsite.url);
      this.appendString(' '+ formattedSearchString);
      if(this.filesOption){
        if(this.userGivenFiletype !=null && this.userGivenFiletype !=""){
          this.selectedFiletypes = [];
          this.selectedFiletypes.push(this.userGivenFiletype);
        }
  
        if (this.selectedFiletypes.length > 0 ){
          this.selectedFiletypes.forEach(element => {
            this.appendString(" filetype:"+element);
            this.appendString(" OR ");
            
          });
        }  
      }

      this.appendString("&tbs=qdr:"+this.selectedTimeDuration);
      this.fullSearchURL += this.filterCondition;

    }else if (this.imageOption ) {
      
      this.appendString("?hl=en&tbm=isch&tbs=");
      if(this.selectedImageType != null){
        this.appendString("ift:" + this.selectedImageType.type+',');
      }
      this.appendString("isz:"+this.selectedImageSize+',');
      this.appendString("qdr:"+this.selectedTimeDuration);
      this.fullSearchURL += this.filterCondition;
      this.fullSearchURL += '&q='+ formattedSearchString;
    }else if(this.newsOption){
      this.appendString("?q=" + formattedSearchString);
      this.appendString("&tbs=qdr:"+this.selectedTimeDuration);
      this.appendString("&tbm=nws");
      this.fullSearchURL += this.filterCondition;
    }else if (this.filesOption){

      this.appendString("?q=" + formattedSearchString);

      if(this.userGivenFiletype !=null && this.userGivenFiletype !=""){
        this.selectedFiletypes = [];
        this.selectedFiletypes.push(this.userGivenFiletype);
      }

      if (this.selectedFiletypes.length >1 ){
        this.selectedFiletypes.forEach(element => {
          this.appendString(" filetype:"+element);
          this.appendString(" OR ");
          
        });
      }else if (this.selectedFiletypes.length === 1){
        this.appendString(" filetype:"+this.selectedFiletypes[0]);
      }

      this.appendString("&tbs=qdr:"+this.selectedTimeDuration);
      this.fullSearchURL += this.filterCondition;

    }else {
      this.fullSearchURL += '?q='+ formattedSearchString;

      this.appendString("&tbs=qdr:"+this.selectedTimeDuration);
      this.fullSearchURL += this.filterCondition;


    }

  }

  specificWebsiteService(selectedValue: string){
    let selectedOption = selectedValue;
    this.selectedWebsite = this.websiteService.getWebsite(selectedOption);
    this.isOtherOptionSelected();
  }

  searchImagesService(selectedValue: string){
    let selectedOption = selectedValue;
    this.selectedImageType = this.imageService.getImageType(selectedOption);
  }
  enableOnlySiteOption(){
    this.imageOption = false; 
    this.newsOption = false;
  }
  enableOnlyImageOption(){
    this.siteOption = false;
    this.newsOption = false;
    this.filesOption = false;
  }
  enableOnlyNewsOption(){
    this.imageOption = false;
    this.siteOption = false;
    this.filesOption = false;
  }
  enableFilesOption(){
    this.imageOption = false;
    this.newsOption = false;
  }

  onSelect(event: Event) {
    let selectedOption = (event.target as HTMLSelectElement).value;
    if (this.siteOption){
      this.specificWebsiteService(selectedOption);
    }else if (this.imageOption){
      this.searchImagesService(selectedOption);
    }
    


  }

  executeSearchQuery() {
    if (this.searchQuery != "" && this.searchQuery != null) {
      this.createSearchQuery();

      window.open(this.fullSearchURL, "_blank");
      this.fullSearchURL = '';
      this.filterCondition = '';

    } else {
      alert("Enter something");
    }
  }


  fetchResults(event: Event){
    this.isListOpen = true;
    let value = (event.target as HTMLSelectElement).value;
    let _url = `https://suggestqueries.google.com/complete/search?client=firefox&callback=myCustomFunction&q=${value}`;
    //let _url = `https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&format=json&callback=myCustomFunction&search=${value}`;

    if (value != null && value !=''){

    this.loadAPI = new Promise((resolve) => {
      this.loadScript(_url);
    });


    }else{
      this.searchResultTag.nativeElement.value ='';
      this.searchAutocompleteResult =[];
    } 

  }

  public loadScript(url: string) {
    let node = document.createElement('script');
    node.src = url;
    node.type = 'text/javascript';
    node.async = true;
    node.charset = 'utf-8';
    document.getElementsByTagName('app-tools')[0].appendChild(node);
  }

  setSearchInput(value: string){
    this.searchQuery = value;
    this.searchAutocompleteResult = [];
  }
  
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  buttonClicked(){
    let scriptOutputString = this.searchResultTag.nativeElement.value;
    this.searchAutocompleteResult = scriptOutputString.split(",");
    
    this.beautifySearchResults(this.searchQuery, this.searchAutocompleteResult);
  }
  setCharAt(str: string,index: number,chr: string) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
  }

  boldQuery(str, query): string {
    //str = '<b>'+str+'</b>';
    
    const n = str.toUpperCase();
    const q = query.toUpperCase();
    const x = n.indexOf(q);
    if (!q || x === -1) {
        return str;
    }
    const l = q.length;
    return str.substr(0, x) + '<b>' + str.substr(x, l) + '</b>' + str.substr(x + l);
  }
  
  beautifySearchResults(matchString: string, resultArray: string[]){
    let lenMatchString = matchString.length;
    
    let matchStringArr = matchString.split(" ");
    let index = 0;

    this.searchResultOriginal = [...this.searchAutocompleteResult] ;
    resultArray.forEach(result => {
      matchStringArr.forEach(query => {
        result = this.boldQuery(result, query);
      });

      this.searchAutocompleteResult[index] = result;

      index++;
    });

  }


}
