import { Component, Inject } from '@angular/core';
import { DiagramViewComponent } from "../../../diagram-view/diagram-view.component";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-entity-diagram-dialog',
  imports: [
    DiagramViewComponent,
    MatCardModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './entity-diagram-dialog.component.html',
  styleUrl: './entity-diagram-dialog.component.scss'
})
export class EntityDiagramDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EntityDiagramDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.data = data || {};
    console.log('EntityDiagramDialogComponent data:', this.data);
  }

}
