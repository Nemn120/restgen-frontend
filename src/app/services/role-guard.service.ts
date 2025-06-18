import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from '../models/role.model';


@Injectable({providedIn: 'root'})
export class RoleGuardService implements CanActivate {
    constructor(public auth: AuthService, public router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        // Permitir acceso si la ruta es /browser/project y viene con code en query params
        const url = route.url[0];
        const hasCode = route.queryParams && route.queryParams['code'];
        console.log(url)
        console.log(route.queryParams['code'])
        if (url.path === 'project' && hasCode) {
            return true;
        }
        const roles: Role[] = route.data['roles'];
        if (this.auth.hasRoles(roles)) {
            return true;
        } else {
            this.router.navigate(['/authentication/login']).then();
            return false;
        }
    }

}
