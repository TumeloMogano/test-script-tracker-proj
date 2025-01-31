import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Country } from '../../models/client/country.model';
import { RegionDto } from '../../models/client/region.model';
import { CityDto } from '../../models/client/city.model';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private apiUrl = `${environment.baseUrl}/Lookup`;

  constructor(private http: HttpClient) { }

  getAllCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/countries`);
  }

  addCountry(country: Country): Observable<Country> {
    return this.http.post<Country>(`${this.apiUrl}/countries`, country);
  }

  updateCountry(country: Country): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/countries/${country.countryId}`, country);
  }

  deleteCountry(countryId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/countries/${countryId}`);
  }

  getAllRegions(): Observable<RegionDto[]> {
    return this.http.get<RegionDto[]>(`${this.apiUrl}/regions`);
  }

  addRegion(region: RegionDto): Observable<RegionDto> {
    return this.http.post<RegionDto>(`${this.apiUrl}/regions`, region);
  }

  updateRegion(region: RegionDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/regions/${region.regionId}`, region);
  }

  deleteRegion(regionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/regions/${regionId}`);
  }

  getRegionsByCountry(countryId: number): Observable<RegionDto[]> {
    return this.http.get<RegionDto[]>(`${this.apiUrl}/countries/${countryId}/regions`);
  }

  getAllCities(): Observable<CityDto[]> {
    return this.http.get<CityDto[]>(`${this.apiUrl}/cities`);
  }

  addCity(city: CityDto): Observable<CityDto> {
    return this.http.post<CityDto>(`${this.apiUrl}/cities`, city);
  }

  updateCity(city: CityDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/cities/${city.cityId}`, city);
  }

  deleteCity(cityId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cities/${cityId}`);
  }

}
