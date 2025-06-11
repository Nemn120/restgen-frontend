import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ProjectService } from 'src/app/services/project.service';
import { ProyectForm } from 'src/app/models/proyect.model';
import { DialogoConfirmacionComponent } from 'src/app/_shared/dialogo-confirmacion/dialogo-confirmacion.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MessageService } from 'src/app/services/message.service';

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
  existsClass = false;
  status: string | null = null;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjectService,
    public dialog: MatDialog,
    private messageService: MessageService
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
      status: ['NEW'],
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
          groupId: ['', Validators.required],
          artifactId: ['', Validators.required],
          version: ['', Validators.required]
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
        this.existsClass = project.classes && project.classes.length > 0;
        this.status = project.status;
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
    this.dialog.open(DialogoConfirmacionComponent, {
      data: params, hasBackdrop: false
    })
      .afterClosed()
      .subscribe(confirmado => {
        if (confirmado) {
          if (this.editMode && this.projectId) {
            this.projectService.update(this.projectId, this.projectForm.value).subscribe({
              next: () => {
                this.messageService.message('Proyecto actualizado correctamente', 'success');
                this.router.navigate(['project']);
              },
              error: () => {
                this.messageService.message('Error al actualizar el proyecto', 'error');
              }
            });
          } else {
            this.projectService.create(this.projectForm.value).subscribe({
              next: () => {
                this.messageService.message('Proyecto creado correctamente', 'success');
                this.router.navigate(['project']);
              },
              error: () => {
                this.messageService.message('Error al crear el proyecto', 'error');
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
      this.messageService.message('No hay proyecto para descargar', 'warning');
    }
  }

  viewProject() {
    this.router.navigate(['project/view', this.projectId]);
  }

  generate() {
    this.projectService.generate(this.projectId).subscribe(
      () => {
        this.messageService.message('Proyecto generado correctamente', 'success');
      });
  }

  uploadGithub() {
    // Implementa la lógica de subida a GitHub aquí
    alert('Funcionalidad de subir a GitHub no implementada aún');
  }

  entities() {
    // Implementa la lógica para manejar entidades aquí
    if (this.projectId) {
      this.router.navigate(['project', this.projectId, 'entities']);
    }
  }

}
