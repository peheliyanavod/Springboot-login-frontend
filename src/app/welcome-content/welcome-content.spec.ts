import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeContent } from './welcome-content';

describe('WelcomeContent', () => {
  let component: WelcomeContent;
  let fixture: ComponentFixture<WelcomeContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeContent],
    }).compileComponents();

    fixture = TestBed.createComponent(WelcomeContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
