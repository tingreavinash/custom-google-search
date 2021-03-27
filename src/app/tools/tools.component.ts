import { Component, OnInit } from '@angular/core';
import { ImagetypesService } from '../services/imagetypes.service';
import { WebsitesService } from '../services/websites.service';
import { ImageType } from '../shared/imageType';
import { Website } from '../shared/website';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  siteOption: boolean;
  imageOption: boolean;
  newsOption: boolean;
  filesOption: boolean;
  
  availableWebsites: Website[];
  availableImageTypes: ImageType[];

  selectedWebsiteOption: String;
  
  selectedWebsite: Website;
  selectedImageType: ImageType;
  selectedFiletype: string;

  selectedImageSize: string;
  selectedTimeDuration: string;

  isDisabled: boolean = true;
  searchQuery: string;
  googleSearchURL: string = 'http://www.google.com/search';
  fullSearchURL: string;
  filterCondition: string = '';
  matchFullPhrase: boolean = false;



  constructor(private websiteService: WebsitesService,
    private imageService: ImagetypesService) {
    this.availableWebsites = websiteService.getWebsites();
    this.selectedWebsite = new Website();
    this.selectedImageType = new ImageType();

    this.availableImageTypes = imageService.getImageTypes();
    
  }

  ngOnInit(): void {
   
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
      this.appendString("&tbs=qdr:"+this.selectedTimeDuration);
      this.fullSearchURL += this.filterCondition;

    }else if (this.imageOption) {
      this.appendString("?hl=en&tbm=isch&tbs=ift:" + this.selectedImageType.type);
      this.appendString(",isz:"+this.selectedImageSize);
      this.appendString(",qdr:"+this.selectedTimeDuration);
      this.fullSearchURL += this.filterCondition;
      this.fullSearchURL += '&q='+ formattedSearchString;
    }else if(this.newsOption){
      this.appendString("?q=filetye:" + this.selectedFiletype);
      this.appendString(' '+ formattedSearchString);
      this.appendString("&tbs=qdr:"+this.selectedTimeDuration);
      this.fullSearchURL += this.filterCondition;
    }else if (this.filesOption){

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
    this.filesOption = false;
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
  enableOnlyFilesOption(){
    this.siteOption = false;
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
      console.log("Search URL: "+this.fullSearchURL);

      window.open(this.fullSearchURL, "_blank");
      this.fullSearchURL = '';
      this.filterCondition = '';

    } else {
      alert("Enter something");
    }
  }


}
