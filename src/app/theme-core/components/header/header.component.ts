import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component( {
  selector: "skrambler-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
} )
export class SkramblerHeaderComponent implements OnInit {
  @Input() title      = "";
  @Input() linkText = "";
  @Input() link = "";
  @Input() allowAction: boolean | number = true;

  @Output() onButtonClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {

  }

  onClick() {
    this.onButtonClick.emit( "click" );
  }
}
