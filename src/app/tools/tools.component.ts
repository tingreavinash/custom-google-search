import { Component, OnInit } from '@angular/core';
import { WebsitesService } from '../services/websites.service';
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
  selectedWebsiteOption: String;
  selectedWebsite: Website;
  isDisabled: boolean = true;
  searchQuery: string;
  googleSearchURL: string = 'http://www.google.com/search?q=';
  fullSearchURL: string;
  filterCondition: string = '';
  matchFullPhrase: boolean = false;

  constructor(private websiteService: WebsitesService) {
    this.availableWebsites = websiteService.getWebsites();
    this.selectedWebsite = new Website();

  }

  ngOnInit(): void {
  }

  isOtherOptionSelected() {
    console.log("Option selected: " + this.selectedWebsite.name);

    if (this.selectedWebsite.name === 'Other') {
      
      this.isDisabled = false;
    } else {
      this.isDisabled = true;
    }
  }

  addCondition(condition: string) {
    console.log("adding condition: " + condition);
    this.filterCondition += condition;
    this.filterCondition += ' ';

  }

  createFullPhrase(inputString: string): string {
    let formattedString = '\"';
    formattedString += inputString;
    formattedString += '\"';
    return formattedString;
  }

  createSearchQuery() {
    this.fullSearchURL = this.googleSearchURL;
    let formattedString: string = this.searchQuery;
    if (this.siteOption && this.selectedWebsite.url != null && this.selectedWebsite.url != "") {
      this.addCondition("site:" + this.selectedWebsite.url);

    }
    this.fullSearchURL += this.filterCondition;

    if (this.matchFullPhrase) {
      formattedString = this.createFullPhrase(this.searchQuery);
      console.log('formatted string: '+formattedString);
    }

    this.fullSearchURL += formattedString;

  }

  onSelect(event: Event) {
    let selectedOption = (event.target as HTMLSelectElement).value;
    this.selectedWebsite = this.websiteService.getWebsite(selectedOption);
    console.log("Selected option string : " + selectedOption);
    console.log("Result website: " + this.selectedWebsite.url);
    this.selectedWebsiteOption = this.selectedWebsite.url;
    this.isOtherOptionSelected();


  }

  executeSearchQuery() {
    if (this.searchQuery != "" && this.searchQuery != null) {
      this.createSearchQuery();
      console.log("Full search url: " + this.fullSearchURL);

      window.open(this.fullSearchURL, "_blank");
      this.fullSearchURL = '';
      this.filterCondition = '';

    } else {
      alert("Enter something");
    }
  }


}
