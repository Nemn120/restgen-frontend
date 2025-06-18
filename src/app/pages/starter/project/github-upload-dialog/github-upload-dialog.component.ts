import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface GitHubUploadDto {
  projectName: string;
  description: string;
  isPrivate: boolean;
}

@Component({
  selector: 'app-github-upload-dialog',
  templateUrl: './github-upload-dialog.component.html',
  styleUrls: ['./github-upload-dialog.component.scss'],
  imports:[
    DialogModule,
    MatFormFieldModule,
    MatCheckboxModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule
  ]
})
export class GitHubUploadDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GitHubUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { projectId: number }
  ) {
    this.form = this.fb.group({
      projectName: ['', Validators.required],
      description: [''],
      isPrivate: [false]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const dto: GitHubUploadDto = this.form.value;
      this.dialogRef.close(dto);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
