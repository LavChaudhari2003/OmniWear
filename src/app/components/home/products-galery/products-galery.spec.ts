import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsGalery } from './products-galery';

describe('ProductsGalery', () => {
  let component: ProductsGalery;
  let fixture: ComponentFixture<ProductsGalery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsGalery],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsGalery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
