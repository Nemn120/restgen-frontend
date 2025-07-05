import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
import { MessageService } from 'src/app/services/message.service';
import { DialogoConfirmacionComponent } from 'src/app/_shared/dialogo-confirmacion/dialogo-confirmacion.component';
import { FindAllEntities } from 'src/app/models/proyect.model';
import { MatChipsModule } from '@angular/material/chips';

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
    MatExpansionModule,
    MatChipsModule
  ],
  templateUrl: './entity-form.component.html',
  styleUrl: './entity-form.component.scss'
})
export class EntityFormComponent implements OnInit {

  entityForm: FormGroup;
  projectId: string | null = null;
  entityName: string | null = null;
  editMode = false;
  entities: any[] = [];
  isSuperClass = false;

  originalName: string | null = null;
  originalTableName: string | null = null;
  originalApiName: string | null = null;

  columnDisplayedColumns = ['name', 'type', 'actions'];
  relationDisplayedColumns = ['name', 'type', 'target', 'actions'];

  viewMode = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private entityService: EntityService,
    private dialog: MatDialog,
    private messageService: MessageService

  ) {
    this.entityForm = this.fb.group({
      name: ['', Validators.required],
      apiName: [null, [Validators.required]],
      entity: this.fb.group({
        tableName: [null],
        extendsClass: [null],
        options: this.fb.group({
          inheritanceStrategy: [null],
          uniqueConstraints: this.fb.control([]),
          discriminator: this.fb.group({
            column: this.fb.group({
              name: [null],
              length: [null]

            }),
            value: new FormControl({ value: null, disabled: true }),
          }),
          sequence: this.fb.group({
            create: [false],
            name: new FormControl({ value: null, disabled: true }),
            increment: new FormControl({ value: null, disabled: true })
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

      this.route.queryParamMap.subscribe(query => {
        this.viewMode = query.get('mode') === 'view';
      });

      if (this.entityName) {
        this.editMode = true;
        this.findEntityByName();
      }
      this.findEntities();

      this.entityForm.get('entity.extendsClass')?.valueChanges.subscribe(val => {
        this.entityForm.get('entity.options.discriminator.value')?.setValue(null);
        if (val) {
          this.entityForm.get('entity.options.discriminator.value')?.enable();
        } else {
          this.entityForm.get('entity.options.discriminator.value')?.disable();
        }
      });

      this.entityForm.get('entity.options.sequence.create')?.valueChanges.subscribe(val => {
        this.entityForm.get('entity.options.sequence.name')?.setValue(null);
        this.entityForm.get('entity.options.sequence.name')?.setValue(null);
        if (val) {
          this.entityForm.get('entity.options.sequence.name')?.enable();
          this.entityForm.get('entity.options.sequence.increment')?.enable();
        } else {
          this.entityForm.get('entity.options.sequence.name')?.disable();
          this.entityForm.get('entity.options.sequence.increment')?.disable();
        }
      });

      this.entityForm.get('name')!.valueChanges.subscribe((value: string) => {
        const snake = this.convertCamelToGionCaseLower(value);
        this.entityForm.get('apiName')!.setValue(snake, { emitEvent: false });
      });

      this.entityForm.get('name')!.valueChanges.subscribe((value: string) => {
        const snake = this.convertCamelToSnakeCaseUpper(value);
        this.entityForm.get('entity.tableName')!.setValue(snake, { emitEvent: false });
      });
    });
  }

  findEntityByName() {
    if (!this.projectId || !this.entityName) return;

    this.entityService.findById(this.projectId, this.entityName)
      .subscribe({
        next: (classModel) => {
          this.setEntityForm(classModel);
          setTimeout(() => {
            this.isSuperClass = !classModel.entity.extendsClass;
          });
        },
        error: (err) => {
          console.error('Error al cargar la entidad:', err);
        }
      });
  }

  uniqueEntityNameValidator(existingNames: (string | null | undefined)[], originalName?: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim().toLowerCase();
      if (!value) return null;

      const filteredNames = (originalName
        ? existingNames.filter(n => n && n.toLowerCase() !== originalName.trim().toLowerCase())
        : existingNames.filter(n => n)
      ) as string[];

      return filteredNames.map(n => n.toLowerCase()).includes(value)
        ? { notUnique: true }
        : null;
    };
  }

  convertCamelToSnakeCaseUpper(input: string): string {
    if (!input) return input;
    let result = input[0].toUpperCase();
    for (let i = 1; i < input.length; i++) {
      const currentChar = input[i];
      if (currentChar === currentChar.toUpperCase() && /[A-Z]/.test(currentChar)) {
        result += '_' + currentChar.toUpperCase();
      } else {
        result += currentChar.toUpperCase();
      }
    }
    return result;
  }

  convertCamelToGionCaseLower(input: string): string {
    if (!input) return input;
    let result = input[0].toLowerCase();
    for (let i = 1; i < input.length; i++) {
      const currentChar = input[i];
      if (/[A-Z]/.test(currentChar)) {
        result += '-' + currentChar.toLowerCase();
      } else {
        result += currentChar;
      }
    }
    return result;
  }

  findEntities() {
    this.entityService.findByProjectId(this.projectId)
      .subscribe((data: FindAllEntities[]) => {
        this.entities = data;

        const existingNames = this.entities.map(e => e.name);

        this.entityForm.get('name')?.setValidators([
          Validators.required,
          this.uniqueEntityNameValidator(existingNames, this.originalName)
        ]);

        this.entityForm.get('entity.tableName')?.setValidators([
          this.uniqueEntityNameValidator(this.entities.map(e => e.tableName), this.originalTableName)
        ]);

        this.entityForm.get('apiName')?.setValidators([
          Validators.required,
          this.uniqueEntityNameValidator(this.entities.map(e => e.apiName), this.originalApiName)
        ]);
      });
  }

  get columns(): FormArray {
    return this.entityForm.get('entity.columns') as FormArray;
  }

  addColumn() {
    const columnGroup = this.fb.group({
      property: this.fb.group({
        name: ['', Validators.required],
        type: ['', Validators.required],
        visibility: ['PRIVATE']
      }),
      column: this.fb.group({
        name: [null],
        length: [null, Validators.maxLength(255)],
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
    });
    columnGroup.get('property.name')!.valueChanges.subscribe((value: string) => {
      columnGroup.get('column.name')!.setValue(this.convertCamelToSnakeCaseUpper(value), { emitEvent: false });
    });
    this.columns.push(columnGroup);
  }
  removeColumn(index: number) {
    const params = {
      title: 'Eliminar columna',
      description: '¿Está seguro de eliminar la columna?',
      inputData: true
    };
    this.dialog.open(DialogoConfirmacionComponent, {
      data: params, hasBackdrop: false
    })
      .afterClosed()
      .subscribe(confirmado => {
        if (confirmado) {
          this.columns.removeAt(index);
        }
      }
      );
  }

  setEntityForm(classModel: any) {
    this.originalName = classModel.name;
    this.originalTableName = classModel.entity.tableName;
    this.originalApiName = classModel.apiName;


    this.entityForm.patchValue({
      name: classModel.name,
      apiName: classModel.apiName,
      entity: {
        tableName: classModel.entity.tableName,
        extendsClass: classModel.entity.extendsClass,
        options: {
          inheritanceStrategy: classModel.entity.options?.inheritanceStrategy,
          discriminator: classModel.entity.options?.discriminator || {
            column: { name: '', type: '', length: null },
            value: classModel.entity.options?.discriminator?.value || ''
          },
          sequence: classModel.entity.options?.sequence || {
            create: false, name: '', increment: null
          }
        }
      }
    });

    if (classModel.entity.options?.uniqueConstraints) {
      this.entityForm.get('entity.options.uniqueConstraints')?.setValue(classModel.entity.options.uniqueConstraints);
    }

    if (classModel.entity.extendsClass) {
      this.entityForm.get('entity.options.discriminator.value')?.setValue(classModel.entity.options.discriminator.value);
      this.entityForm.get('entity.extendsClass')?.setValue(classModel.entity.extendsClass);
      console.log(this.entityForm.value)
    }

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
          type: [col.relation?.type || null],
          fetch: [col.relation?.fetch || null],
          joinColumnReferenced: [col.relation?.joinColumnReferenced || null],
          notAudited: [col.relation?.notAudited || false]
        })
      }));
    });

    if (classModel.entity.options?.discriminator) {
      this.entityForm.get('entity.options.discriminator')?.patchValue(classModel.entity.options.discriminator);
    }
    if (classModel.entity.options?.sequence) {
      this.entityForm.get('entity.options.sequence')?.patchValue(classModel.entity.options.sequence);
    }
  }

  saveEntity() {
    console.log('Guardando entidad:', this.entityForm.value);
    console.log(this.entityForm.invalid, this.entityForm.errors);
    if (this.entityForm.invalid) {
      this.entityForm.markAllAsTouched();
      return;
    }

    const formValue = JSON.parse(JSON.stringify(this.entityForm.value));
    formValue.entity.columns = formValue.entity.columns.map((col: any) => {
      if (!col.relation?.type) {
        delete col.relation;
      }
      return col;
    });

    this.entityService.create(this.projectId, formValue).subscribe({
      next: () => {
        this.findEntities();
        this.messageService.message('Entidad guardada correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al guardar la entidad:', err);
      }
    });
  }

  cancel() {
    const mode = this.route.snapshot.queryParamMap.get('mode') || 'edit';

    this.router.navigate(['../'], {
      relativeTo: this.route,
      queryParams: { mode }
    });
  }


  get columnNames(): string[] {
    return this.columns.controls.map(col => col.get('property.name')?.value).filter(Boolean);
  }

  openRelationDialog(mode: 'column' | 'relation') {
    let entityNames: any[] = [];
    if (this.entities != null) {
      entityNames = this.entities.map(e => e.name);
    }

    const dialogRef = this.dialog.open(RelationDialogComponent, {
      width: '900px',
      data: { entityNames, mode }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.columns.push(this.fb.group({
          property: this.fb.group({
            name: [result.property?.name || '', Validators.required],
            type: [result.property?.type || '', Validators.required],
            visibility: [result.property?.visibility || 'PRIVATE']
          }),
          column: this.fb.group({
            name: [result.column?.name || null],
            length: [result.column?.length ?? null],
            precision: [result.column?.precision ?? null],
            scale: [result.column?.scale ?? null],
            unique: [result.column?.unique ?? false],
            foreignkey: [result.column?.foreignkey ?? null],
            nullable: [result.column?.nullable ?? true]
          }),
          relation: this.fb.group({
            type: [result.relation?.type || null],
            fetch: [result.relation?.fetch || null],
            joinColumnReferenced: [result.relation?.joinColumnReferenced || null]
          })
        }));
      }
    });
  }

  get columnItems() {
    return this.columns.controls
      .map(ctrl => ctrl.value)
      .filter(col => !col.relation?.type || col.relation?.type === null);
  }

  get relationItems() {
    return this.columns.controls
      .map(ctrl => ctrl.value)
      .filter(col => col.relation?.type && col.relation?.type !== null);
  }

  removeColumnByType(index: number, type: 'column' | 'relation') {
    const title = type === 'column' ? 'columna' : 'relación';
    const params = {
      title: 'Eliminar ' + title,
      description: '¿Está seguro de eliminar ' + title + '?',
      inputData: true
    };
    this.dialog.open(DialogoConfirmacionComponent, {
      data: params, hasBackdrop: false
    })
      .afterClosed()
      .subscribe(confirmado => {
        if (confirmado) {
          let items = type === 'column' ? this.columnItems : this.relationItems;
          let item = items[index];
          let realIndex = this.columns.controls.findIndex(ctrl => ctrl.value === item);
          if (realIndex !== -1) {
            this.columns.removeAt(realIndex);
          }
        }
      }
      );
  }


}
