import { Component, Input, OnInit } from '@angular/core';
import { ToolsComponent } from '../tools/tools.component';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class IframeComponent implements OnInit {

  public iframe_url: string;

  constructor() { }

  ngOnInit(): void {
  }

}
