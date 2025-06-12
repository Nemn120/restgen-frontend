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
import { ClassModel } from 'src/app/models/proyect.model';
import { MessageService } from 'src/app/services/message.service';
import { RelationDialogComponent } from './relation-dialog/relation-dialog.component';

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
  entities: ClassModel[] = [];

  constructor(private route: ActivatedRoute, private router: Router,
    private entityService: EntityService,
    private messageService: MessageService,
    private dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
      this.findEntities();
    });
  }

  private findEntities() {
    this.entityService.findByProjectId(this.projectId)
      .subscribe((data: ClassModel[]) => {
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
          this.entityService.delete(entity.name, this.projectId).subscribe({
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


  openRelationDialog(entity: ClassModel) {
    const entityNames = this.entities.map(e => e.name);

    const dialogRef = this.dialog.open(RelationDialogComponent, {
      width: '500px',
      data: { entityNames }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.type === 'HERENCIA') {
          entity.entity.options = entity.entity.options || {};
          entity.entity.options.inheritanceStrategy = result.inheritanceStrategy;
          entity.entity.options.discriminator = result.discriminator;
        } else if (
          result.type === 'MANY_TO_ONE' ||
          result.type === 'ONE_TO_ONE' ||
          result.type === 'ONE_TO_MANY'
        ) {
          entity.entity.columns = entity.entity.columns || [];
          entity.entity.columns.push({
            property: {
              name: result.propertyName || '',
              type: result.propertyType || '',
              visibility: 'PRIVATE'
            },
            column: {
              name: '',
              length: null,
              precision: null,
              scale: null,
              unique: null,
              foreignkey: null,
              nullable: null
            },
            relation: {
              type: result.relation.type,
              fetch: result.relation.fetch,
              joinColumnReferenced: result.relation.joinColumnReferenced
            }
          });
        }
      }
    });
  }
}
