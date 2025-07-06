import { MatCardModule } from '@angular/material/card';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Proyect } from 'src/app/models/proyect.model';
import { ProjectService } from './../../services/project.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MessageService } from 'src/app/services/message.service';
import { DialogoConfirmacionComponent } from 'src/app/_shared/dialogo-confirmacion/dialogo-confirmacion.component';
import { AuthService } from 'src/app/services/auth.service';

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
    private route: ActivatedRoute,
    private authService: AuthService

  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const state = params['state'];
      if (code) {
        console.log(code);
        console.log(state);
        this.authService.getGitHubUserInfo(code,state).subscribe(()=>{
          this.listProject();
        })
      }else{
        this.listProject();
      }
    });
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

  viewProject(project: Proyect) {
    this.router.navigate(['project/view', project.id]);
  }
}
