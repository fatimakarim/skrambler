import { Component, Inject, Injector, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from "@angular/material";
import { AngularCropperjsComponent } from "angular-cropperjs";
import { DomSanitizer } from "@angular/platform-browser";
import * as Cropper from "cropperjs/dist/cropper";
import { SkramblerBaseComponent } from "../base.component";
import { HelperService } from "../../services/helper.service";

@Component({
    templateUrl: "./image-crop-dialog.component.html",
})
export class ImageCropDialogComponent extends SkramblerBaseComponent {
    /**
   * the following element holds reference to the image cropper
   */
    @ViewChild("angularCropper") public angularCropper: AngularCropperjsComponent;

    img: any;

    title: string;
    subTitle: string;
    croppedImage: any = "";
    imageChangedEvent: any = null;
    cropperOptions: any = {
        checkCrossOrigin: false,
        zoomable: true,
        zoomOnWheel: true,
        zoomOnTouch: true,
        movable: true,
        wheelZoomRatio: 0.1,
    };
    aspectRatio: number = 21 / 9;

    constructor(public dialogRef: MatDialogRef<ImageCropDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, injector: Injector) {
        super(injector);
        this.aspectRatio = data.aspect_ratio;
        this.cropperOptions["aspectRatio"] = this.aspectRatio;
        this.title = data.title;
        this.subTitle = data.sub_title;
    }


    /**
     * The following detects the change in file event from the file uploader
     * @param event
     */
    fileChangeEvent(event: any): void {
         // check file dimensions
    HelperService.imageFileDimensions(event.target.files[0], (widthImg, heightImg) => {
        if (widthImg > this.constantList.DEFAULT_IMAGE_WIDTH || heightImg > this.constantList.DEFAULT_IMAGE_HEIGHT) {
            this.translate.get("TEXT.IMAGE_DIMENTION").subscribe((res: string) => {
                this.showSnackBarWithMessage(res);
            });
        } else if (event.target.files[0].size > this.data.file_size_limit) {
            this.translate.get(this.data.file_size_error).subscribe((res: string) => {
                this.showSnackBarWithMessage(res);
            });
        } else {
            if (this.imageChangedEvent) {
                this.angularCropper.cropper.replace(URL.createObjectURL(event.target.files[0]));
            }
            else this.imageChangedEvent = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(event.target.files[0]));
        }
      });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onCropClick(): void {
        // getting the blob and the data url
        this.angularCropper.cropper.getCroppedCanvas().toBlob(blob => {
            this.dialogRef.close(blob);
        });
    }


    imageLoaded() {
        // show cropper
    }

    loadImageFailed() {
        // show message
    }
}
