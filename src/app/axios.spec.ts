import { TestBed } from '@angular/core/testing';

import { Axios } from './axios';

describe('Axios', () => {
  let service: Axios;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Axios);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
