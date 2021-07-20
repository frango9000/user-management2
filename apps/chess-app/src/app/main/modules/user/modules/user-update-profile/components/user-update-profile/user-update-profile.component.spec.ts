import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Resource } from '@chess-lite/hal-form-client';
import { of } from 'rxjs';
import { StubFormErrorComponent } from '../../../../../../../shared/components/form-error/form-error.component.stub';
import { stubUserServiceProvider } from '../../../../services/user.service.stub';

import { UserUpdateProfileComponent } from './user-update-profile.component';

const mockRouteData = { data: of({ user: new Resource({}) }) };

describe('UserUpdateProfileComponent', () => {
  let component: UserUpdateProfileComponent;
  let fixture: ComponentFixture<UserUpdateProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      declarations: [UserUpdateProfileComponent, StubFormErrorComponent],
      providers: [MatDatepickerModule, stubUserServiceProvider, { provide: ActivatedRoute, useValue: mockRouteData }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUpdateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});