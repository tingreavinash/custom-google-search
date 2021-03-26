import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {

  siteOption: boolean = true;
  constructor() { 
    this.siteOption = false;
  }

  ngOnInit(): void {
  }

  toggleSiteOption(){

  }

}
