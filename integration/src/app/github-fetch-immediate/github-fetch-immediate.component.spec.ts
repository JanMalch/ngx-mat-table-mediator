import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { GithubFetchImmediateComponent } from './github-fetch-immediate.component';

describe('GithubFetchImmediateComponent', () => {
  let component: GithubFetchImmediateComponent;
  let fixture: ComponentFixture<GithubFetchImmediateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GithubFetchImmediateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
