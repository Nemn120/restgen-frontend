import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityDiagramDialogComponent } from './entity-diagram-dialog.component';

describe('EntityDiagramDialogComponent', () => {
  let component: EntityDiagramDialogComponent;
  let fixture: ComponentFixture<EntityDiagramDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityDiagramDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityDiagramDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
