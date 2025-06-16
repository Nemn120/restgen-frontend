import { EntityService } from './../../../../services/entity.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogoConfirmacionComponent } from 'src/app/_shared/dialogo-confirmacion/dialogo-confirmacion.component';
import { ClassModel, FindAllEntities } from 'src/app/models/proyect.model';
import { MessageService } from 'src/app/services/message.service';
import { ProjectService } from 'src/app/services/project.service';
import { DiagramViewComponent } from '../../diagram-view/diagram-view.component';
import { EntityDiagramDialogComponent } from './entity-diagram-dialog/entity-diagram-dialog.component';

@Component({
  selector: 'app-entities',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule

  ],
  templateUrl: './entities.component.html',
  styleUrl: './entities.component.scss'
})
export class EntitiesComponent implements OnInit {

  projectId: string | null = null;
  entities: FindAllEntities[] = [];

  constructor(private route: ActivatedRoute, private router: Router,
    private entityService: EntityService,
    private messageService: MessageService,
    private dialog: MatDialog,
    private projectService: ProjectService,


  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
      this.findEntities();
    });
  }

  private findEntities() {
    this.entityService.findByProjectId(this.projectId)
      .subscribe((data: FindAllEntities[]) => {
        this.entities = data;
      });
  }

  goToCreateEntity() {
    this.router.navigate(['project', this.projectId, 'entities', 'new']);
  }

  editEntity(entity: any) {
    this.router.navigate(['project', this.projectId, 'entities', entity.name]);
  }

  goBack() {
    this.router.navigate(['project/edit', this.projectId]);
  }

  deleteEntity(entity: ClassModel) {
    const params = {
      title: 'Eliminar entidad',
      description: '¿Está seguro de eliminar la entidad?',
      inputData: true
    };
    this.dialog.open(DialogoConfirmacionComponent, {
      data: params, hasBackdrop: false
    })
      .afterClosed()
      .subscribe(confirmado => {
        if (confirmado) {
          this.entityService.delete(this.projectId, entity.name).subscribe({
            next: () => {
              this.entities = this.entities.filter(e => e.name !== entity.name);
              this.messageService.message('Entidad eliminado correctamente', 'success');
              this.findEntities();
            },
            error: () => {
              this.messageService.message('Error al eliminar entidad', 'error');
            }
          });
        }
      }
      );
  }

  viewDiagram() {
    if (this.projectId) {
      this.projectService.getDiagram(this.projectId).subscribe({
        next: (data) => {
          this.dialog.open(EntityDiagramDialogComponent, {
            data: data.plantUmlDiagram,
            width: '900px',
            maxWidth: '1100px',
            height: '500px'
          });
        },
        error: () => {
          this.messageService.message('Error visualizar diagrama', 'error');
        }
      });
    } else {
      this.messageService.message('No se ha seleccionado un proyecto', 'error');
    }
  }

}
