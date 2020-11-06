import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLanguageModalComponent } from './update-language-modal.component';

describe('UpdateLanguageModalComponent', () => {
  let component: UpdateLanguageModalComponent;
  let fixture: ComponentFixture<UpdateLanguageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateLanguageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLanguageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
