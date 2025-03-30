import {Role} from './role.model';

export interface User {
    token: string;
    email?: string;
    name?: string;
    role?: Role;
}
