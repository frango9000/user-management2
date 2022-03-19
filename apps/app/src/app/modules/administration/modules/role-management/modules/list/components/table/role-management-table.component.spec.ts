import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ConfirmationDialogService,
  getStubbedDialogService,
  stubCoreServiceProvider,
  stubToasterServiceProvider,
  TextInputDialogService,
} from '@app/ui/shared';

import { RoleManagementTableComponent } from './role-management-table.component';
import { stubRoleManagementTableDatasourceProvider } from './role-management-table.datasource.stub';

describe('RoleManagementListComponent', () => {
  let component: RoleManagementTableComponent;
  let fixture: ComponentFixture<RoleManagementTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatIconModule,
      ],
      declarations: [RoleManagementTableComponent],
      providers: [
        stubCoreServiceProvider,
        stubToasterServiceProvider,
        stubRoleManagementTableDatasourceProvider,
        getStubbedDialogService(ConfirmationDialogService),
        getStubbedDialogService(TextInputDialogService),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleManagementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
