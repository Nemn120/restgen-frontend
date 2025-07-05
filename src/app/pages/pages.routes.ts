import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import { ProjectComponent } from './starter/project/project.component';
import { EntitiesComponent } from './starter/project/entities/entities.component';
import { EntityFormComponent } from './starter/project/entities/entity-form/entity-form.component';
import { ProjectPrivateComponent } from './starter/project/project-private/project-private.component';

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
    path: 'my', component: ProjectPrivateComponent,
    data: {
      title: 'Mis proyectos'
    },
  },
  {
    path: 'new', component: ProjectComponent,
  },
  {
    path: 'edit/:id', component: ProjectComponent
  },
  {
    path: 'view/:id', component: ProjectComponent
  },
  { path: ':id/entities', component: EntitiesComponent },
  { path: ':id/entities/new', component: EntityFormComponent },
  { path: ':id/entities/:entityName', component: EntityFormComponent },
];
