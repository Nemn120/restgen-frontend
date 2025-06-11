import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/project.service';
import { Proyect, ProyectForm } from 'src/app/models/proyect.model';
import { DialogoConfirmacionComponent } from 'src/app/_shared/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatCardModule } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatButtonModule,
    CommonModule,
    MatInputModule
  ],
})
export class ProjectComponent implements OnInit {

  title = 'Crear nuevo proyecto';
  projectForm: FormGroup;
  editMode = false;
  projectId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      urlRepository: [''],
      plantUmlDiagram: [''],
      isPrivate: [false],
      creationUser: [''],
      creationDate: [''],
      updateUser: [''],
      updateDate: [''],
      status: [''],
      properties: this.fb.group({
        application: this.fb.group({
          basePath: ['', Validators.required],
          port: [null, [Validators.required, Validators.min(1)]]
        }),
        documentation: this.fb.group({
          title: [''],
          description: [''],
          version: [''],
          termsOfServiceUrl: [''],
          contactName: [''],
          contactUrl: [''],
          contactEmail: [''],
          licenseName: [''],
          licenseUrl: ['']
        }),
        maven: this.fb.group({
          groupId: [''],
          artifactId: [''],
          version: ['']
        }),
        security: this.fb.group({
          secretKey: ['']
        })
      }),

    });

    // Verifica si hay un id en la ruta para modo edición
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editMode = true;
        this.title = 'Editar proyecto';
        this.projectId = id;
        this.loadProject(id);
      }
    });
  }

  loadProject(id: string): void {
    this.projectService.findById(id).subscribe({
      next: (project: ProyectForm) => {
        this.projectForm.patchValue(project);
      },
      error: () => {
        alert('Error al cargar el proyecto');
        this.router.navigate(['project']);
      }
    });
  }

  createProject(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }
    const params = {
      title: this.title,
      description: this.editMode ? '¿Está seguro de actualizar el proyecto?' : '¿Está seguro de crear el proyecto?',
      inputData: true
    };
    this.dialog.open(DialogoConfirmacionComponent, { data: params, hasBackdrop: false
  })
      .afterClosed()
      .subscribe(confirmado => {
        if (confirmado) {
          if (this.editMode && this.projectId) {
            this.projectService.update(this.projectId, this.projectForm.value).subscribe({
              next: () => {
                alert('Proyecto actualizado correctamente');
                this.router.navigate(['my-project']);
              },
              error: () => {
                alert('Error al actualizar el proyecto');
              }
            });
          } else {
            this.projectService.create(this.projectForm.value).subscribe({
              next: () => {
                alert('Proyecto creado correctamente');
                this.router.navigate(['my-project']);
              },
              error: () => {
                alert('Error al crear el proyecto');
              }
            });
          }
        }
      });
  }

  cancelar(): void {
    this.router.navigate(['project']);
  }

  download() {
    if (this.projectId) {
      this.projectService.downloadProjectByUuid(this.projectId);
    } else {
      alert('No hay proyecto para descargar');
    }
  }

  viewProject() {
    this.router.navigate(['project/view', this.projectId]);
  }

  generate() {
    // Implementa la lógica de generación aquí
  }

  uploadGithub() {
    // Implementa la lógica de subida a GitHub aquí
    alert('Funcionalidad de subir a GitHub no implementada aún');
  }

  entities() {
    // Implementa la lógica para manejar entidades aquí
    alert('Funcionalidad de entidades no implementada aún');
  }

}
