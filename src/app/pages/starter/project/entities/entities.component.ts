import { EntityService } from './../../../../services/entity.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassModel } from 'src/app/models/proyect.model';

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
    private entityService: EntityService

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = params.get('id');
      this.entityService.findByProjectId(this.projectId)
      .subscribe((data: ClassModel[]) => {
        this.entities = data;
      });
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
}
