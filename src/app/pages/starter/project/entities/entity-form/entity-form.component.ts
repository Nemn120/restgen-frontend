import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EntityService } from 'src/app/services/entity.service';

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
    MatCheckboxModule
  ],
  templateUrl: './entity-form.component.html',
  styleUrl: './entity-form.component.scss'
})
export class EntityFormComponent implements OnInit {

  entityForm: FormGroup;
  projectId: string | null = null;
  entityName: string | null = null;
  editMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private entityService: EntityService

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
              type: [''],
              length: [null]
            }),
            options: this.fb.group({
              force: [false],
              insert: [false]
            })
          }),
          sequence: this.fb.group({
            create: [false],
            name: [''],
            increment: [null]
          }),
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
        visibility: ['PUBLIC']
      }),
      column: this.fb.group({
        name: [''],
        length: [null],
        precision: [null],
        scale: [null],
        unique: [null],
        foreignkey: [null],
        nullable: [null]
      }),
      relation: this.fb.group({
        type: [''],
        fetch: [''],
        joinColumnReferenced: [''],
        notAudited: [null]
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
          options: { force: false, insert: false }
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
          visibility: [col.property.visibility, 'PRIVATE']
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
          type: [col.relation?.type],
          fetch: [col.relation?.fetch],
          joinColumnReferenced: [col.relation?.joinColumnReferenced],
          notAudited: [col.relation?.notAudited]
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
    // Lógica para guardar la entidad (crear o actualizar)
    // this.entityService.saveEntity(this.projectId, this.entityForm.value)
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
