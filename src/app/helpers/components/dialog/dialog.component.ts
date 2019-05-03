import {Component, Inject} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";

@Component({
    selector: "skrambler-dialog",
    templateUrl: "./dialog.component.html",
    styleUrls: ["./dialog.component.scss"]
})
export class DialogComponent {
    constructor(public dialogRef: MatDialogRef<DialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    onNoClick(): void {
        this.dialogRef.close(false);
    }

    onYesClick(): void {
        this.dialogRef.close(true);
    }
}
