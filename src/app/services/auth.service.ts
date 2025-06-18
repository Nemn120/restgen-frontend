import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../models/user.model';
import { HttpService } from './http.service';
import { Role } from '../models/role.model';
import { environment } from 'src/environments/environment';
import { UserRegister } from '../models/user.register.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {

  static readonly END_POINT = environment.URI + '/users/token';
  static readonly END_POINT_USERS = environment.URI + '/users';
  private user: User;


  constructor(
    private readonly httpService: HttpService,
    private readonly router: Router,
    private readonly http: HttpClient) {
  }

  login(email: string, password: string): Observable<User> {
    return this.httpService.authBasic(email, password)
      .post(AuthService.END_POINT)
      .pipe(
        map(response => {
          if (!response || !response.token) {
            throw new Error('Invalid token response');
          }

          const jwtHelper = new JwtHelperService();
          const decodedToken = jwtHelper.decodeToken(response.token);

          this.user = {
            token: response.token,
            email: decodedToken.user,
            name: decodedToken.name,
            role: decodedToken.role
          };
          localStorage.setItem('token', this.user.token);
          return this.user;
        }),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => new Error('Login failed. Please check your credentials.'));
        })
      );
  }

  logout(): void {
    this.user = undefined;
    this.router.navigate(['/authentication/login']).then();
  }

  register(user: UserRegister) {
    return this.httpService.post(AuthService.END_POINT_USERS, user);
  }

  isAuthenticated(): boolean {
    return this.user != null && !(new JwtHelperService().isTokenExpired(this.user.token));
  }

  hasRoles(roles: Role[]): boolean {
    return this.isAuthenticated() && roles.includes(this.user.role);
  }

  isAdmin(): boolean {
    return this.hasRoles([Role.ADMIN]);
  }


  isDeveloper(): boolean {
    return this.hasRoles([Role.DEVELOPER]);
  }

  getEmail(): string {
    return this.user ? this.user.email : undefined;
  }

  getName(): string {
    return this.user ? this.user.name : '???';
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  getTokenGithub(){
    const jwtHelper = new JwtHelperService();
     const decodedToken = jwtHelper.decodeToken(this.getToken());
     return decodedToken['token-github'];
  }

  getUser(): User {
    return this.user;
  }

  goToGithubAcces() {
    return this.http.get(AuthService.END_POINT + 'http://localhost:8080/restgen/user-info');
  }

  redirectToGitHubLogin() {
    window.location.href = 'http://localhost:8080/restgen/oauth2/authorization/github';
  }

  getGitHubUserInfo(code: string, state: string): Observable<User> {
    return this.httpService.get(AuthService.END_POINT + '/github/' + code + '/state/' + state)
      .pipe(
        map((data: any) => {
          this.user = {
            token: data.token,
            email: data.email,
            name: data.name,
            role: data.role
          };
          localStorage.setItem('token', data.token);
          return this.user;
        }),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => new Error('Login failed. Please check your credentials.'));
        })
      )
  }

}
