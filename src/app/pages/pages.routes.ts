import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import { ProjectComponent } from './starter/project/project.component';
import { EntitiesComponent } from './starter/project/entities/entities.component';
import { EntityFormComponent } from './starter/project/entities/entity-form/entity-form.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Starter',
      urls: [
        { title: 'Proyectos', url: '/project' }
      ],
    },
  },
  {
    path: 'new', component: ProjectComponent,
  },
  {
    path: 'edit/:id', component: ProjectComponent
  },
  { path: ':id/entities', component: EntitiesComponent },
  { path: ':id/entities/new', component: EntityFormComponent },
  { path: ':id/entities/:entityName', component: EntityFormComponent },
];
