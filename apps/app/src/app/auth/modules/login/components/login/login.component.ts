import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { bounceOutAnimation, wobbleAnimation } from 'angular-animations';
import { first } from 'rxjs/operators';
import { CardViewHeaderService } from '../../../../../core/modules/card-view/services/card-view-header.service';
import { setTemplateValidatorsPipe } from '../../../../../shared/utils/forms/rxjs/set-template-validators.rxjs.pipe';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [wobbleAnimation(), bounceOutAnimation()],
})
export class LoginComponent implements OnDestroy {
  public loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  public loginSuccess = false;
  public loginError = false;

  constructor(
    public readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly headerService: CardViewHeaderService,
  ) {
    this.headerService.setHeader({ title: 'Login' });
    this.authService.getLoginTemplate().pipe(first(), setTemplateValidatorsPipe(this.loginForm)).subscribe();
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }

  public onSubmit(): void {
    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => this.setStatus(!!user),
      error: () => this.setStatus(false),
    });
  }

  private setStatus(status: boolean) {
    this.loginSuccess = status;
    this.loginError = !status;
    this.cdr.markForCheck();
  }

  public onLoginSuccess(): void {
    if (this.loginSuccess) {
      this.router.navigate(['']);
    }
  }
}