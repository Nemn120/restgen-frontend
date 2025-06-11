import { Component, OnInit, Inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialogContent, MatDialogTitle, MatDialogClose, MatDialogActions } from '@angular/material/dialog';
import { Message } from 'src/app/models/messageDTO';

@Component({
  selector: 'app-dialogo-confirmacion',
  templateUrl: './dialogo-confirmacion.component.html',
  styleUrls: ['./dialogo-confirmacion.component.scss'],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
  ]
})
export class DialogoConfirmacionComponent implements OnInit {

  constructor(
    public dialogo: MatDialogRef<DialogoConfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) public mensaje: Message,
  ) { }

  cerrarDialogo(): void {
    this.dialogo.close(false);
  }
  confirmado(): void {

    this.dialogo.close(true);
  }

  ngOnInit() {

  }

}
