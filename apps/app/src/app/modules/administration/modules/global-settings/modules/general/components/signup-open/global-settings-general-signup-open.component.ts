import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ToasterService } from '../../../../../../../../core/services/toaster.service';
import { GlobalSettingsService } from '../../../../services/global-settings.service';

@UntilDestroy()
@Component({
  selector: 'app-global-settings-general-signup-open',
  templateUrl: './global-settings-general-signup-open.component.html',
  styleUrls: ['./global-settings-general-signup-open.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsGeneralSignupOpenComponent {
  public signupOpen?: boolean;

  constructor(
    public readonly globalSettingsService: GlobalSettingsService,
    private readonly toasterService: ToasterService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.globalSettingsService
      .getGlobalSettings()
      .pipe(untilDestroyed(this))
      .subscribe((globalSettings) => {
        this.signupOpen = globalSettings.signupOpen;
        this.cdr.markForCheck();
      });
  }

  onToggle($event: { checked: boolean }) {
    this.globalSettingsService.updateGlobalSettings({ signupOpen: $event.checked }).subscribe({
      next: () => this.toasterService.showToast({ message: 'Global Settings Saved Successfully' }),
      error: () => this.toasterService.showErrorToast({ message: 'An Error has Occurred' }),
    });
  }
}
