import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LeagueApiService } from '../services/league-api.service';
import { Tab1Page } from './tab1.page';

class LeagueApiServiceStub {
  getMatches = jasmine.createSpy('getMatches').and.returnValue(of([]));
  reportResult = jasmine.createSpy('reportResult').and.returnValue(of(null as any));
}

describe('Tab1Page', () => {
  let component: Tab1Page;
  let fixture: ComponentFixture<Tab1Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tab1Page],
      providers: [{ provide: LeagueApiService, useClass: LeagueApiServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
