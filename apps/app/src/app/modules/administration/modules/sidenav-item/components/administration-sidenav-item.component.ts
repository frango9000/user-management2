import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuData } from '@app/domain';
import { AdministrationService } from '../../../services/administration.service';

@Component({
  selector: 'app-administration-sidenav-item',
  templateUrl: './administration-sidenav-item.component.html',
  styleUrls: ['./administration-sidenav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationSidenavItemComponent {
  @Output() toggleSidenav = new EventEmitter();

  items: MenuData[] = [
    {
      icon: 'space_dashboard',
      title: 'Dashboard',
      link: '/administration',
    },
    {
      icon: 'manage_accounts',
      title: 'User Management',
      link: '/administration/user-management',
      canShow: this.administrationService.hasUserManagementEmbedded(),
    },
    {
      icon: 'military_tech',
      title: 'Role Management',
      link: '/administration/role-management',
      canShow: this.administrationService.hasRoleManagementEmbedded(),
    },
    {
      icon: 'cabin',
      title: 'Service Logs',
      link: '/administration/service-logs',
      canShow: this.administrationService.hasServiceLogsLink(),
    },
    {
      icon: 'vpn_lock',
      title: 'Global Settings',
      link: '/administration/global-settings',
      canShow: this.administrationService.hasGlobalSettingsLink(),
    },
  ];

  constructor(public readonly router: Router, public readonly administrationService: AdministrationService) {}
}
