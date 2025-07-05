import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPrivateComponent } from './project-private.component';

describe('ProjectPrivateComponent', () => {
  let component: ProjectPrivateComponent;
  let fixture: ComponentFixture<ProjectPrivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectPrivateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectPrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
