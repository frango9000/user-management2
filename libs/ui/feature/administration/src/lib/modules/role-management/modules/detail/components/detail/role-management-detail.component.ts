import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role, RoleChangedMessage, RoleChangedMessageAction, RoleChangedMessageDestination } from '@app/domain';
import { CardViewHeaderService, MessageService, ToasterService } from '@app/ui/shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { RoleManagementService } from '../../../../services/role-management.service';

@UntilDestroy()
@Component({
  selector: 'app-role-management-detail',
  templateUrl: './role-management-detail.component.html',
  styleUrls: ['./role-management-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleManagementDetailComponent implements OnDestroy {
  private _role = new BehaviorSubject<Role>(this.route.snapshot.data.role);

  constructor(
    private readonly headerService: CardViewHeaderService,
    private readonly route: ActivatedRoute,
    private readonly messageService: MessageService,
    private readonly roleManagementService: RoleManagementService,
    private readonly toasterService: ToasterService,
    private readonly router: Router,
  ) {
    this.headerService.setHeader({
      title: 'Edit Role',
      navigationLink: ['administration', 'role-management'],
    });
    this._subscribeToRoleChanges(this.route.snapshot.data.role?.id);
  }

  get role(): Observable<Role> {
    return this._role.asObservable();
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  private _subscribeToRoleChanges(roleId: string) {
    this.messageService
      .subscribeToMessages<RoleChangedMessage>(new RoleChangedMessageDestination(roleId))
      .pipe(
        untilDestroyed(this),
        switchMap((roleChangedEvent) => {
          if (roleChangedEvent.action === RoleChangedMessageAction.UPDATED) {
            return this.roleManagementService.fetchOneRole(roleChangedEvent.roleId).pipe(
              tap((role) => {
                this._role.next(role);
                this.toasterService.showToast({ title: `This Role has received an update.` });
              }),
            );
          } else {
            this.toasterService.showToast({ title: `Role ${roleChangedEvent.roleId} was removed.` });
            this.router.navigate(['administration', 'role-management']);
            return EMPTY;
          }
        }),
      )
      .subscribe();
  }
}