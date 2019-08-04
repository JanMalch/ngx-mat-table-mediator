import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { JsonPlaceholderTypingComponent } from './json-placeholder-typing.component';

describe('JsonPlaceholderTypingComponent', () => {
  let component: JsonPlaceholderTypingComponent;
  let fixture: ComponentFixture<JsonPlaceholderTypingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonPlaceholderTypingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
