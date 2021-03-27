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
  
  availableWebsites: Website[];
  availableImageTypes: ImageType[];

  selectedWebsiteOption: String;
  
  selectedWebsite: Website;
  selectedImageType: ImageType;

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

  addCondition(condition: string) {
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
    let formattedString: string =  this.searchQuery;
    if (this.matchFullPhrase) {
      formattedString = this.createFullPhrase(this.searchQuery);
    }
    if (this.siteOption ) {
      this.addCondition("?q=site:" + this.selectedWebsite.url);
      this.fullSearchURL += this.filterCondition;
      this.fullSearchURL += ' '+ formattedString;

    }else if (this.imageOption) {
      this.addCondition("?hl=en&tbm=isch&tbs=ift:" + this.selectedImageType.type);
      this.addCondition(",isz:"+this.selectedImageSize);
      this.addCondition(",qdr:"+this.selectedTimeDuration);
      this.fullSearchURL += this.filterCondition;
      this.fullSearchURL += '&q='+ formattedString;
    }else {
      this.fullSearchURL += '?q='+ formattedString;

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
  }
  enableOnlyImageOption(){
    this.siteOption = false;
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


}
