import {Injectable, Injector} from "@angular/core";
import {Observable} from "rxjs";
import {reject} from "q";
import {map} from "rxjs/operators";
import {BaseNetworkService} from "./base-network.service";

@Injectable()
export class HelperService  extends BaseNetworkService  {
  isFormSubmittedSharedVariable: boolean = false;

  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * The following method is used to convert the respective base64encoded data into a blob
   * @param dataURI
   * @returns {Blob}
   */
  static dataURItoBlob(dataURI): Blob {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const dataView = new DataView(ab);
    return new Blob([dataView], { type: mimeString });
  }

  /**
   * the following method is used to generate random color
   */
  static getRandomColor() {
    return '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
  }

  /**
   * the following makes sure the given string is not null or empty
   * @param {string} value
   * @returns {boolean}
   */
  static isNotEmptyOrUndefined(value: string) {
    return (value !== undefined || value !== "" || value.length > 0);
  }

  /**
   * The following method is used to convert the image file into Data URI
   * @param imageFile
   * @param callback
   */
  static imageFileToDataURI(imageFile: any, callback: any) {
    const file: File = imageFile,
      myReader: FileReader = new FileReader();

    myReader.onloadend = e => {
      callback(myReader.result);
    };

    myReader.readAsDataURL(file);
  }

  /**
   * The following method is used to check the dimensions of image
   * @param imageFile
   * @param callback
   */
  static imageFileDimensions(imageFile: any, callback: any) {
    const fReader = new FileReader;
    fReader.onload = function () {
      const img = new Image;
      img.onload = function () {
        callback(img.width, img.height);
      };

      img.src = fReader.result;
    };

    fReader.readAsDataURL(imageFile);
  }

  /**
   * The following checks if the given is a valid base64 string or not
   * @param {string} string
   * @returns {boolean}
   */
  static isValidBase64(string: string) {
    try {
      atob(string);
      return true;
    } catch (e) {
      return false;
    }
  }


  exportFileDownload(api: any, body: any , fileName: string) {
    const url: string = api;
    const formData: FormData = new FormData();
    if (body) {
      // the following is to prepare the facilities accepted by the backend in the respective API input param format
      Observable.range(0, body.length).subscribe((x) => {
        formData.append(body[x].key ,  body[x].selectedValue);
      }, error => {
        reject(error);
      }, () => {
      });
    }

    return this.http
      .post( url, formData,
        {
          responseType: "blob",
        } )
      .pipe( map( res => {
        return {
          filename: fileName + ".xls",
          data: res,
        };
      } ) );

  }
}
