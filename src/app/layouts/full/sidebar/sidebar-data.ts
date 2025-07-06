import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Proyectos',
    iconName: 'solar:atom-line-duotone',
    route: '/project',
  },
  {
    displayName: 'Mis proyectos',
    iconName: 'solar:folder-open-outline',
    route: '/project/my',
  },
];
