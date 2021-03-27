import { Injectable } from '@angular/core';
import { FileType } from '../shared/filetype';
import { FILETYPES } from '../shared/filetypes';

@Injectable({
  providedIn: 'root'
})
export class FiletypesService {

  constructor() { }

  getFileTypes(): FileType[] {
    return FILETYPES;
  }

  getFileType(filetype: String): FileType {
    return FILETYPES.filter((item)=> (item.type === filetype))[0];
  }
}
