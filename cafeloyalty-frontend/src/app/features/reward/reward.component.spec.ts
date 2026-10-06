/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RewardComponent } from './reward.component';

describe('RewardComponent', () => {
  let component: RewardComponent;
  let fixture: ComponentFixture<RewardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
