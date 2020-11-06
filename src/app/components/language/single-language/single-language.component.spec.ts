import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLanguageComponent } from './single-language.component';

describe('SingleLanguageComponent', () => {
  let component: SingleLanguageComponent;
  let fixture: ComponentFixture<SingleLanguageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleLanguageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
