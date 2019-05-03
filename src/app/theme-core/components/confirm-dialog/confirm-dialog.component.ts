import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
    selector   : "skrambler-confirm-dialog",
    templateUrl: "./confirm-dialog.component.html",
    styleUrls  : ["./confirm-dialog.component.scss"]
})
export class SkramblerConfirmDialogComponent implements OnInit
{
    public confirmMessage: string;

    constructor(public dialogRef: MatDialogRef<SkramblerConfirmDialogComponent>)
    {
    }

    ngOnInit()
    {
    }

}
