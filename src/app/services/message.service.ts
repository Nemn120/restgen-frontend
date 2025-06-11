import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { MessageBean } from '../models/MessageBean';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messageChange = new Subject<MessageBean>();

  constructor(
    private _snackBar: MatSnackBar) {
  }

  message(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3200,
    });

  }
}
