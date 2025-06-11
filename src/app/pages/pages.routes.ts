import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import { ProjectComponent } from './starter/project/project.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Starter',
      urls: [
        { title: 'Proyectos', url: '/project' },
        { title: 'Starter' },
      ],
    },
  },
  {
    path: 'new', component: ProjectComponent,
  },
  {
    path: 'edit/:id', component: ProjectComponent
  }
];
