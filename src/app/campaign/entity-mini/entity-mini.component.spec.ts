import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityMiniComponent } from './entity-mini.component';

describe('EntityMiniComponent', () => {
  let component: EntityMiniComponent;
  let fixture: ComponentFixture<EntityMiniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityMiniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
