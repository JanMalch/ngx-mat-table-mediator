import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { JsonPlaceholderComponent } from './json-placeholder.component';

describe('JsonPlaceholderComponent', () => {
  let component: JsonPlaceholderComponent;
  let fixture: ComponentFixture<JsonPlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
