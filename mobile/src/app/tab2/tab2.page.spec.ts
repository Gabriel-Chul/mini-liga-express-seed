import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LeagueApiService } from '../services/league-api.service';
import { Tab2Page } from './tab2.page';

class LeagueApiServiceStub {
  getStandings = jasmine.createSpy('getStandings').and.returnValue(of([]));
}

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tab2Page],
      providers: [{ provide: LeagueApiService, useClass: LeagueApiServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
