import { Injectable } from '@angular/core';
import { Website } from '../shared/website';
import { WEBSITES } from '../shared/websites';

@Injectable({
  providedIn: 'root'
})
export class WebsitesService {

  constructor() { }

  getWebsites(): Website[] {
    return WEBSITES;
  }

  getWebsite(name: String): Website {
    return WEBSITES.filter((site)=> (site.displayName === name))[0];
  }
}
