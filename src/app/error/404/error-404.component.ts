import {Component, OnInit} from "@angular/core";
import {SkramblerConfigService} from "../../theme-core/services/config.service";

@Component({
  selector: "skrambler-error-404",
  templateUrl: "./error-404.component.html",
  styleUrls: ["./error-404.component.scss"]
})
export class SkramblerError404Component implements OnInit {
  constructor(private fuseConfig: SkramblerConfigService) {
    this.fuseConfig.setSettings({
      layout: {
        navigation: "none",
        toolbar: "none",
        footer: "none"
      }
    });
  }

  ngOnInit() {
  }
}
