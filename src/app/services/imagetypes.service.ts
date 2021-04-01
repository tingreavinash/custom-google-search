import { Injectable } from '@angular/core';
import { ImageType } from '../shared/imageType';
import { IMAGETYPES } from '../shared/imageTypes';

@Injectable({
  providedIn: 'root'
})
export class ImagetypesService {

  constructor() { }

  getImageTypes(): ImageType[] {
    return IMAGETYPES;
  }

  getImageType(imageType: String): ImageType {
    return IMAGETYPES.filter((item)=> (item.displayName  === imageType))[0];
  }
}
