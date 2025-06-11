import { MatCardModule } from '@angular/material/card';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
import { Proyect } from 'src/app/models/proyect.model';
import { ProjectService } from './../../services/project.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
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
  encapsulation: ViewEncapsulation.None,
})
export class StarterComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'description',
    'basePath',
    'port',
    'status',
    'isPrivate',
    'creationDate',
    'updateDate',
    'actions'
  ];
  dataSource: MatTableDataSource<Proyect>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.listProject();
  }

  listProject() {
    this.projectService.findAll().subscribe(
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
    // Aquí puedes abrir un diálogo de confirmación si lo deseas
    // Por simplicidad, solo mostramos el esqueleto
    if (confirm('¿Está seguro de eliminar este proyecto?')) {
      // Lógica para eliminar el proyecto
      // this.projectService.delete(project.id).subscribe(...)
    }
  }
}
