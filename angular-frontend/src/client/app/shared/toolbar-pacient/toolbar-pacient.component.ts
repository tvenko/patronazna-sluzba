import { Component, OnInit } from '@angular/core';

/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-toolbar-pacient',
  templateUrl: 'toolbar-pacient.component.html',
  styleUrls: ['toolbar-pacient.component.css']
})
export class ToolbarPacientComponent implements OnInit {
  public pacient: any;

  ngOnInit() {
    this.pacient = JSON.parse(localStorage.getItem('podatkiPacienta'));
    if (!this.pacient)
      this.pacient = {};
  }


}
