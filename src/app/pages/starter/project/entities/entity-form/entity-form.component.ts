import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityService } from 'src/app/services/entity.service';
import { RelationDialogComponent } from '../relation-dialog/relation-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-entity-form',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  templateUrl: './entity-form.component.html',
  styleUrl: './entity-form.component.scss'
})
export class EntityFormComponent implements OnInit {

  entityForm: FormGroup;
  projectId: string | null = null;
  entityName: string | null = null;
  editMode = false;
  entities: any[] = []; // Aquí puedes definir el tipo adecuado según tu modelo
  isSuperClass = false; // Para indicar si es una super clase
  disableDiscriminatorValue = false;

  columnDisplayedColumns = ['name', 'type', 'actions'];
  relationDisplayedColumns = ['name', 'type', 'target', 'actions'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private entityService: EntityService,
    private dialog: MatDialog // <--- agrega esto

  ) {
    this.entityForm = this.fb.group({
      name: ['', Validators.required],
      entity: this.fb.group({
        tableName: ['', Validators.required],
        extendsClass: [''],
        options: this.fb.group({
          inheritanceStrategy: [''],
          uniqueConstraints: this.fb.array([]),
          discriminator: this.fb.group({
            column: this.fb.group({
              name: [''],
              length: [null]

            }),
            options: this.fb.group({
              force: [false],
              insert: [false]
            }),
            value: ['']
          }),
          sequence: this.fb.group({
            create: [false],
            name: [''],
            increment: [null]
          })
        }),
        columns: this.fb.array([])
      })
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
      this.entityName = params.get('entityName');
      if (this.entityName) {
        this.editMode = true;
        // Aquí deberías cargar la entidad desde el servicio y hacer patchValue
        // this.entityService.getEntity(this.projectId, this.entityName).subscribe(entity => {
        //   this.setEntityForm(entity);
        // });
        this.entityService.findById(this.projectId, this.entityName).subscribe(entity => {
          this.setEntityForm(entity);
        });
      }
      this.findEntities();

      this.entityForm.get('entity.extendsClass')?.valueChanges.subscribe(val => {
        this.disableDiscriminatorValue = !val; // true si null, undefined o ''
        if (this.disableDiscriminatorValue) {
          this.entityForm.get('entity.options.discriminator.value')?.setValue('');
        }
      });

    });
  }

  findEntities() {
    this.entityService.findByProjectId(this.projectId)
      .subscribe((data: any[]) => {
        this.entities = data;
      });
  }


  // Métodos para uniqueConstraints
  get uniqueConstraints(): FormArray {
    return this.entityForm.get('entity.options.uniqueConstraints') as FormArray;
  }
  addUniqueConstraint() {
    this.uniqueConstraints.push(this.fb.control(''));
  }
  removeUniqueConstraint(index: number) {
    this.uniqueConstraints.removeAt(index);
  }

  // Métodos para columns
  get columns(): FormArray {
    return this.entityForm.get('entity.columns') as FormArray;
  }

  addColumn() {
    this.columns.push(this.fb.group({
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
        foreignkey: [null],
        nullable: [true]
      }),
      relation: this.fb.group({
        type: [''],
        fetch: [''],
      })
    }));
  }
  removeColumn(index: number) {
    this.columns.removeAt(index);
  }

  // Método para setear el formulario en modo edición
  setEntityForm(classModel: any) {
    this.entityForm.patchValue({
      name: classModel.name,
      entity: {
        tableName: classModel.entity.tableName,
        extendsClass: classModel.entity.extendsClass,
        options: {
          inheritanceStrategy: classModel.entity.options?.inheritanceStrategy,
          discriminator: classModel.entity.options?.discriminator || {
            column: { name: '', type: '', length: null },
            options: { force: false, insert: false },
            value: classModel.entity.options?.discriminator?.value || ''
          },
          sequence: classModel.entity.options?.sequence || {
            create: false, name: '', increment: null
          }
        }
      }
    });

    // Unique constraints
    this.uniqueConstraints.clear();
    (classModel.entity.options?.uniqueConstraints || []).forEach((uc: string) => {
      this.uniqueConstraints.push(this.fb.control(uc));
    });

    // Columns
    this.columns.clear();
    (classModel.entity.columns || []).forEach((col: any) => {
      this.columns.push(this.fb.group({
        property: this.fb.group({
          name: [col.property.name, Validators.required],
          type: [col.property.type, Validators.required],
          visibility: [col.property.visibility || 'PRIVATE']
        }),
        column: this.fb.group({
          name: [col.column.name],
          length: [col.column.length],
          precision: [col.column.precision],
          scale: [col.column.scale],
          unique: [col.column.unique],
          foreignkey: [col.column.foreignkey],
          nullable: [col.column.nullable]
        }),
        relation: this.fb.group({
          type: [col.relation?.type || ''],
          fetch: [col.relation?.fetch || ''],
          joinColumnReferenced: [col.relation?.joinColumnReferenced || ''],
          notAudited: [col.relation?.notAudited || false]
        })
      }));
    });

    // Discriminator y sequence (si existen)
    if (classModel.entity.options?.discriminator) {
      this.entityForm.get('entity.options.discriminator')?.patchValue(classModel.entity.options.discriminator);
    }
    if (classModel.entity.options?.sequence) {
      this.entityForm.get('entity.options.sequence')?.patchValue(classModel.entity.options.sequence);
    }
  }

  saveEntity() {
    if (this.entityForm.invalid) {
      this.entityForm.markAllAsTouched();
      return;
    }

    // Clona el valor del formulario para no modificar el original
    const formValue = JSON.parse(JSON.stringify(this.entityForm.value));

    // Limpia el campo relation si no es relación
    formValue.entity.columns = formValue.entity.columns.map((col: any) => {
      if (!col.relation?.type) {
        delete col.relation;
      }
      return col;
    });

    this.entityService.create(this.projectId, formValue).subscribe({
      next: () => {
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err) => {
        console.error('Error al guardar la entidad:', err);
      }
    });
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  get isSequenceEnabled(): boolean {
    return this.entityForm.get('entity.options.sequence.create')?.value;
  }

  get columnNames(): string[] {
    return this.columns.controls.map(col => col.get('property.name')?.value).filter(Boolean);
  }

  openRelationDialog(mode: 'column' | 'relation') {
    const entityNames = this.entities.map(e => e.name);

    const dialogRef = this.dialog.open(RelationDialogComponent, {
      width: '900px',
      data: { entityNames, mode }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Estructura compatible con tu FormArray
        this.columns.push(this.fb.group({
          property: this.fb.group({
            name: [result.property?.name || '', Validators.required],
            type: [result.property?.type || '', Validators.required],
            visibility: [result.property?.visibility || 'PRIVATE']
          }),
          column: this.fb.group({
            name: [result.column?.name || ''],
            length: [result.column?.length ?? null],
            precision: [result.column?.precision ?? null],
            scale: [result.column?.scale ?? null],
            unique: [result.column?.unique ?? false],
            foreignkey: [result.column?.foreignkey ?? null],
            nullable: [result.column?.nullable ?? true]
          }),
          relation: this.fb.group({
            type: [result.relation?.type || ''],
            fetch: [result.relation?.fetch || ''],
            joinColumnReferenced: [result.relation?.joinColumnReferenced || ''],
            notAudited: [result.relation?.notAudited || false]
          })
        }));
      }
    });
  }

  get columnItems() {
    // Solo columnas simples (sin tipo de relación o relación vacía)
    return this.columns.controls
      .map(ctrl => ctrl.value)
      .filter(col => !col.relation?.type || col.relation?.type === '');
  }

  get relationItems() {
    // Solo relaciones (tipo de relación definido)
    return this.columns.controls
      .map(ctrl => ctrl.value)
      .filter(col => col.relation?.type && col.relation?.type !== '');
  }

  removeColumnByType(index: number, type: 'column' | 'relation') {
    // Busca el índice real en el FormArray
    let items = type === 'column' ? this.columnItems : this.relationItems;
    let item = items[index];
    let realIndex = this.columns.controls.findIndex(ctrl => ctrl.value === item);
    if (realIndex !== -1) {
      this.columns.removeAt(realIndex);
    }
  }


}
