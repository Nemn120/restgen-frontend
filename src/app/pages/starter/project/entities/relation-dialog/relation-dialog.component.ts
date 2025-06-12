import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-relation-dialog',
  templateUrl: './relation-dialog.component.html',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule
  ],
})
export class RelationDialogComponent implements OnInit {
  mode: 'column' | 'relation' = 'column';
  columnForm: FormGroup;
  relationForm: FormGroup;
  modeControl = this.fb.control('column');

  constructor(
    public dialogRef: MatDialogRef<RelationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
     const initialMode: 'column' | 'relation' = data?.mode || 'column';
  this.mode = initialMode;
  this.modeControl = this.fb.control(initialMode);
    this.columnForm = this.fb.group({
      property: this.fb.group({
        name: ['', Validators.required],
        type: ['', Validators.required],
        visibility: ['PRIVATE']
      }),
      column: this.fb.group({
        name: [''],
        length: [null],
        precision: [null],
        scale: [null],
        unique: [false],
        foreignkey: [false],
        nullable: [true]
      }),
      relation: this.fb.group({
        type: [''],
        fetch: ['']
      })
    });

    this.relationForm = this.fb.group({
      property: this.fb.group({
        name: ['', Validators.required],
        type: [''],
        visibility: ['PRIVATE']
      }),
      column: this.fb.group({
        name: [''],
        length: [null],
        precision: [null],
        scale: [null],
        unique: [false],
        foreignkey: [true],
        nullable: [true]
      }),
      relation: this.fb.group({
        type: ['', Validators.required],
        targetEntity: ['', Validators.required],
        fetch: ['LAZY', Validators.required]
      })
    });
  }

  ngOnInit() {
  this.modeControl.valueChanges.subscribe(val => this.mode = val as 'column' | 'relation');
}

  save() {
    if (this.mode === 'column') {
      this.dialogRef.close(this.columnForm.value);
    } else {
      this.dialogRef.close(this.relationForm.value);
    }
  }
}
