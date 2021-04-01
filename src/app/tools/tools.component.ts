import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostBinding, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FiletypesService } from '../services/filetypes.service';
import { GooglesearchService } from '../services/googlesearch.service';
import { ImagetypesService } from '../services/imagetypes.service';
import { WebsitesService } from '../services/websites.service';
import { FileType } from '../shared/filetype';
import { ImageType } from '../shared/imageType';
import { Website } from '../shared/website';
import { IframeComponent } from '../iframe/iframe.component';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss'],

})
export class ToolsComponent implements OnInit {



  @ViewChild('searchResultTag', { static: true }) searchResultTag: ElementRef;
  @ViewChild('inputBox') inputBox: ElementRef;
  @ViewChild('resultlistDiv') resultlistDiv: ElementRef;
  @ViewChild('hiddenBtn', { static: false }) hiddenBtn: ElementRef;


  searchAutocompleteResult: string[] = [];
  searchResultOriginal: string[];
  isListOpen: boolean = false;
  isFilterEnabled: boolean = true;
  isSpinnerEnabled: boolean = false;
  inputTarget: any;
  isAlertEnabled: boolean = false;
  alertMessage: string;

  siteOption: boolean;
  imageOption: boolean;
  newsOption: boolean;
  filesOption: boolean;

  selectedWebsite: Website;
  selectedImageType: ImageType;
  selectedFiletypes: string[] = [];
  userGivenFiletype: string;

  selectedImageSize: string;
  selectedTimeDuration: string = "";


  availableWebsites: Website[];
  availableImageTypes: ImageType[];
  availableFiletypes: FileType[];

  selectedWebsiteOption: String;



  isDisabled: boolean = true;
  searchQuery: string;
  googleSearchURL: string = 'http://www.google.com/search';
  public fullSearchURL: string;
  filterCondition: string = '';
  matchFullPhrase: boolean = false;

  loadAPI: Promise<any>;


  constructor(private websiteService: WebsitesService,
    private imageService: ImagetypesService,
    private fileService: FiletypesService,
    private googleService: GooglesearchService,
    private renderer: Renderer2) {

    this.availableWebsites = websiteService.getWebsites();
    this.availableWebsites.sort(this.compare);
    this.selectedWebsite = new Website();
    this.selectedImageType = new ImageType();
    this.availableFiletypes = fileService.getFileTypes();
    this.availableFiletypes.sort(this.compare);

    this.availableImageTypes = imageService.getImageTypes();
    this.availableImageTypes.sort(this.compare);

    this.renderer.listen('window', 'click', (event: Event) => {
      if (event.target !== this.inputBox.nativeElement &&
        event.target !== this.hiddenBtn.nativeElement) {
        this.isFilterEnabled = true;
        this.isListOpen = false;
      }


    });

  }

  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const nameA = a.displayName.toUpperCase();
    const nameB = b.displayName.toUpperCase();
  
    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  }

  enableList() {
    //this.focusSearchBar();

    if (this.searchAutocompleteResult.length > 0) {
      this.isListOpen = true;
    } else {
      this.isListOpen = false;
    }


  }

  focusSearchBar() {
    var x = 0;
    var y = 300;
    window.scrollTo(x, y);
    this.inputBox.nativeElement.focus();

  }

  ngOnInit(): void {

  }

  clearFileTypeSelection() {
    this.selectedFiletypes = [];
  }

  isOtherOptionSelected() {

    if (this.selectedWebsite.displayName === 'Other') {

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
    let formattedSearchString: string = this.searchQuery;
    if (this.matchFullPhrase) {
      formattedSearchString = this.createFullPhrase(this.searchQuery);
    }
    if (this.siteOption && this.selectedWebsite.url != "" && this.selectedWebsite.url !=null) {
      this.appendString("?q=site:" + this.selectedWebsite.url);
      this.appendString(' ' + formattedSearchString);
      if (this.filesOption) {
        if (this.userGivenFiletype != null && this.userGivenFiletype != "") {
          this.selectedFiletypes = [];
          this.selectedFiletypes.push(this.userGivenFiletype);
        }

        if (this.selectedFiletypes.length > 0) {
          this.selectedFiletypes.forEach(element => {
            this.appendString(" filetype:" + element);
            this.appendString(" OR ");

          });
        }
      }

      this.appendString("&tbs=qdr:" + this.selectedTimeDuration);
      this.fullSearchURL += this.filterCondition;

    } else if (this.imageOption) {

      this.appendString("?hl=en&tbm=isch&tbs=");
      if (this.selectedImageType != null) {
        this.appendString("ift:" + this.selectedImageType.displayName + ',');
      }
      this.appendString("isz:" + this.selectedImageSize + ',');
      this.appendString("qdr:" + this.selectedTimeDuration);
      this.fullSearchURL += this.filterCondition;
      this.fullSearchURL += '&q=' + formattedSearchString;
    } else if (this.newsOption) {
      this.appendString("?q=" + formattedSearchString);
      this.appendString("&tbs=qdr:" + this.selectedTimeDuration);
      this.appendString("&tbm=nws");
      this.fullSearchURL += this.filterCondition;
    } else if (this.filesOption) {

      this.appendString("?q=" + formattedSearchString);

      if (this.userGivenFiletype != null && this.userGivenFiletype != "") {
        this.selectedFiletypes = [];
        this.selectedFiletypes.push(this.userGivenFiletype);
      }

      if (this.selectedFiletypes.length > 1) {
        this.selectedFiletypes.forEach(element => {
          this.appendString(" filetype:" + element);
          this.appendString(" OR ");

        });
      } else if (this.selectedFiletypes.length === 1) {
        this.appendString(" filetype:" + this.selectedFiletypes[0]);
      }

      this.appendString("&tbs=qdr:" + this.selectedTimeDuration);
      this.fullSearchURL += this.filterCondition;

    } else {
      this.fullSearchURL += '?q=' + formattedSearchString;

      this.appendString("&tbs=qdr:" + this.selectedTimeDuration);
      this.fullSearchURL += this.filterCondition;


    }

  }

  specificWebsiteService(selectedValue: string) {
    let selectedOption = selectedValue;
    if(selectedOption != 'Other'){
      this.selectedWebsite = this.websiteService.getWebsite(selectedOption);
    }else{
      this.selectedWebsite = {
        displayName : 'Other',
        url : '',
        image : '/assets/images/other.svg',
        category: 'Other'
      }
    }
    this.isOtherOptionSelected();
  }

  searchImagesService(selectedValue: string) {
    let selectedOption = selectedValue;
    this.selectedImageType = this.imageService.getImageType(selectedOption);
  }
  enableOnlySiteOption() {
    this.imageOption = false;
    this.newsOption = false;
  }
  enableOnlyImageOption() {
    this.siteOption = false;
    this.newsOption = false;
    this.filesOption = false;
  }
  enableOnlyNewsOption() {
    this.imageOption = false;
    this.siteOption = false;
    this.filesOption = false;
  }
  enableFilesOption() {
    this.imageOption = false;
    this.newsOption = false;
  }

  onSelect(event: Event) {
    let selectedOption = (event.target as HTMLSelectElement).value;
    if (this.siteOption) {
      this.specificWebsiteService(selectedOption);
    } else if (this.imageOption) {
      this.searchImagesService(selectedOption);
    }



  }

  clearAllFilters(){

    
  this.siteOption = false;
  this.imageOption = false;
  this.newsOption = false;
  this.filesOption = false;
  
  this.selectedWebsiteOption = "";
  this.matchFullPhrase = false;
  this.selectedFiletypes = [];
  
  this.selectedImageType = null;
  this.userGivenFiletype = "";

  this.selectedImageSize = "";
  this.selectedTimeDuration = "";

  }

  executeSearchQuery() {
    if (this.searchQuery != "" && this.searchQuery != null) {
      this.createSearchQuery();

      window.open(this.fullSearchURL, "_blank");
      this.fullSearchURL = '';
      this.filterCondition = '';

    } else {
      console.log("Empty..");
      this.isAlertEnabled = true;
      
      this.alertMessage = 'You didn\'t type anything';
      setTimeout(()=>{
        this.isAlertEnabled = false;
      }, 5000);
    }
  }
  testFun(){
    console.log("clicked");
  }

  arrowkeyLocation = -1;

  onKeyUpHandler(event: any) {
    this.inputTarget = event.target;
    if (event.key === "Backspace"){
      this.arrowkeyLocation = -1;
    }
    if (event.key === "Escape") {
      this.isListOpen = false;
      this.isFilterEnabled = true;
    } else if (event.key === "Enter") {
      if (this.isListOpen) {
        this.isListOpen = false;
        this.isFilterEnabled = true;

      } else {
        this.executeSearchQuery();
      }
    } else if (event.key != "ArrowDown" && event.key != "ArrowUp") {
      this.arrowkeyLocation = -1;
      this.isListOpen = true;
      let value = (event.target as HTMLSelectElement).value;
      let _url = `https://suggestqueries.google.com/complete/search?client=firefox&callback=myCustomFunction&q=${value}`;
      //let _url = `https://en.wikipedia.org/w/api.php?action=opensearch&limit=10&format=json&callback=myCustomFunction&search=${value}`;
      if (value != null && value != '') {

        this.loadAPI = new Promise((resolve) => {
          this.loadScript(_url);
        });
      } else {
        this.searchResultTag.nativeElement.value = '';
        this.searchAutocompleteResult = [];
        this.isFilterEnabled = true;

      }

    } else if (event.keyCode == 38 || event.keyCode == 40) {
      
      
      switch (event.keyCode) {
        case 38:
          this.isListOpen = true;
          
          this.arrowkeyLocation--;
          if (this.arrowkeyLocation > this.searchAutocompleteResult.length-1) this.arrowkeyLocation = 0;
          if (this.arrowkeyLocation < 0) this.arrowkeyLocation = this.searchAutocompleteResult.length-1;
          this.searchQuery = this.searchResultOriginal[this.arrowkeyLocation];
          break;
        case 40:
          this.isListOpen = true;

          this.arrowkeyLocation++;
          if (this.arrowkeyLocation > this.searchAutocompleteResult.length-1) this.arrowkeyLocation = 0;
          if (this.arrowkeyLocation < 0) this.arrowkeyLocation = this.searchAutocompleteResult.length-1;
          this.searchQuery = this.searchResultOriginal[this.arrowkeyLocation];
          break;

      }

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

  setSearchInput(value: string) {
    this.searchQuery = value;
    this.searchAutocompleteResult = [];
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  buttonClicked() {
    let scriptOutputString = this.searchResultTag.nativeElement.value;
    if (scriptOutputString.length > 0) {
      this.searchAutocompleteResult = scriptOutputString.split(",");
    } else {
      this.searchAutocompleteResult = [];
    }

    this.beautifySearchResults(this.searchQuery, this.searchAutocompleteResult);
    if (this.searchAutocompleteResult.length > 0) {
      this.isFilterEnabled = false;
    }
  }
  setCharAt(str: string, index: number, chr: string) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
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

  beautifySearchResults(matchString: string, resultArray: string[]) {
    let lenMatchString = matchString.length;

    let matchStringArr = matchString.split(" ");
    let index = 0;

    this.searchResultOriginal = [...this.searchAutocompleteResult];
    resultArray.forEach(result => {
      matchStringArr.forEach(query => {
        result = this.boldQuery(result, query);
      });

      this.searchAutocompleteResult[index] = result;

      index++;
    });

  }


}
