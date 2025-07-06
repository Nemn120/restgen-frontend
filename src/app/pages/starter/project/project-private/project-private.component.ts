import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { DialogoConfirmacionComponent } from 'src/app/_shared/dialogo-confirmacion/dialogo-confirmacion.component';
import { Proyect } from 'src/app/models/proyect.model';
import { MessageService } from 'src/app/services/message.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-private',
  imports: [
    MatCardModule,
    MatPaginator,
    MatDialogModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatButtonModule,
    CommonModule

  ],
  templateUrl: './project-private.component.html',
  styleUrl: './project-private.component.scss'
})
export class ProjectPrivateComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'basePath',
    'port',
    'status',
    'isPrivate',
    'updateDate',
    'actions'
  ];
  dataSource: MatTableDataSource<Proyect>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private projectService: ProjectService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
   this.listProject();
  }

  listProject() {
    this.projectService.findByUser().subscribe(
      (proyects: Proyect[]) => {
        this.dataSource = new MatTableDataSource(proyects);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.log('Error al listar proyectos!', error);
      }
    );
  }

   newProject() {
      this.router.navigate(['project/new']);
    }

    updateProject(project: Proyect) {
      this.router.navigate(['project/edit', project.id]);
    }

    deleteProject(project: Proyect) {
      const params = {
        title: 'Eliminar proyecto',
        description: '¿Está seguro de eliminar el proyecto?',
        inputData: true
      };
      this.dialog.open(DialogoConfirmacionComponent, {
        data: params, hasBackdrop: false
      })
        .afterClosed()
        .subscribe(confirmado => {
          if (confirmado) {
            this.projectService.delete(project.id).subscribe({
              next: () => {
                this.messageService.message('Proyecto eliminado correctamente', 'success');
                this.listProject();
              },
              error: () => {
                this.messageService.message('Error al eliminar el proyecto', 'error');
              }
            });
          }
        }

        );
    }


}
