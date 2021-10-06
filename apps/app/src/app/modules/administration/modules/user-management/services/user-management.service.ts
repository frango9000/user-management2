import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pageable, User, UserManagementRelations, UserPage } from '@app/domain';
import { HalFormService, Link, Resource } from '@hal-form-client';
import { Observable } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { AdministrationService } from '../../../services/administration.service';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService extends HalFormService {
  constructor(
    protected readonly httpClient: HttpClient,
    private readonly administrationService: AdministrationService,
  ) {
    super(httpClient, '');
  }

  initialize(): Observable<Resource> {
    return this.administrationService.getResource().pipe(
      map((administrationResource) =>
        administrationResource.getEmbeddedObject(UserManagementRelations.USER_MANAGEMENT_REL),
      ),

      tap((resource) => this.setRootResource(resource)),
    );
  }

  public fetchUsers(pageable?: Pageable): Observable<UserPage> {
    return this.getLinkOrThrow(UserManagementRelations.USERS_REL).pipe(
      first(),
      switchMap((link: Link) => link.get<UserPage>(pageable)),
    );
  }

  public fetchUser(userId: string): Observable<User> {
    userId = userId || '0';
    return this.getLinkOrThrow(UserManagementRelations.USER_REL).pipe(
      first(),
      switchMap((userLink) => userLink.get({ userId })),
    );
  }

  public createUser(user: User) {
    return this.submitToTemplateOrThrow(UserManagementRelations.USER_CREATE_REL, user);
  }
}
