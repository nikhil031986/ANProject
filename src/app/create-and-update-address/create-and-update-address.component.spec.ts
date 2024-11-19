import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAndUpdateAddressComponent } from './create-and-update-address.component';

describe('CreateAndUpdateAddressComponent', () => {
  let component: CreateAndUpdateAddressComponent;
  let fixture: ComponentFixture<CreateAndUpdateAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAndUpdateAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAndUpdateAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
