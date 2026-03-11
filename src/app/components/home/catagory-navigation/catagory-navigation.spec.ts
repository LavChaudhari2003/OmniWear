import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatagoryNavigation } from './catagory-navigation';

describe('CatagoryNavigation', () => {
  let component: CatagoryNavigation;
  let fixture: ComponentFixture<CatagoryNavigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatagoryNavigation],
    }).compileComponents();

    fixture = TestBed.createComponent(CatagoryNavigation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
