import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Client } from '../../models/client/client.model';
import { ClientRepresentative } from '../../models/client/clientrep.model';
import { City } from '../../models/client/city.model';
import { Country } from '../../models/client/country.model';
import { environment } from '../../../environments/environment.development';
import { Region } from '../../models/client/region.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.baseUrl}/Clients`;

  constructor(private http: HttpClient) { }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/GetAllClients`);
  }

  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/GetAllCities`);
  }

  getCitiesByCountry(countryId: number): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/GetCitiesByCountry/${countryId}`);
  }

  getClientById(clientId: string): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/GetClientById/${clientId}`);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.apiUrl}/CreateClient`, client);
  }

  updateClient(clientId: string, client: Client): Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/UpdateClient/${clientId}`, client);
  }

  deleteClient(clientId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/RemoveClient/${clientId}`);
  }

  getClientRepById(clientRepId: string): Observable<ClientRepresentative> {
    return this.http.get<ClientRepresentative>(`${this.apiUrl}/GetClientRep/${clientRepId}`);
  }

  getClientReps(): Observable<ClientRepresentative[]> {
    return this.http.get<ClientRepresentative[]>(`${this.apiUrl}/GetAllClientReps`);
  }

  getClientRepsByClientId(clientId: string): Observable<ClientRepresentative[]> {
    return this.http.get<ClientRepresentative[]>(`${this.apiUrl}/GetRepsByClientId/${clientId}`)
  }

  getClientsByCountry(countryId: number): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/GetClientsByCountry/${countryId}`);
  }

  getClientsByRegion(regionId: number): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/GetClientsByRegion/${regionId}`);
  }

  getClientsByCity(cityId: number): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/GetClientsByCity/${cityId}`);
  }

  createClientRep(clientRep: ClientRepresentative): Observable<ClientRepresentative> {
    return this.http.post<ClientRepresentative>(`${this.apiUrl}/CreateClientRep`, clientRep);
  }

  updateClientRep(clientRepId: string, clientRep: ClientRepresentative): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/UpdateClientRep/${clientRepId}`, clientRep);
  }

  deleteClientRep(clientRepId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/RemoveClientRep/${clientRepId}`);
  }

  getAllCountries(): Observable<Country[]>{
    return this.http.get<Country[]>(`${this.apiUrl}/GetAllCountries`);
  }

  getLogoByClientId(clientId: string):Observable<{ logoImage: string }> {
    return this.http.get<{ logoImage: string }>(`${this.apiUrl}/GetLogoByClient/${clientId}`);
  }

  getRegionByCountry(countryId: number): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiUrl}/GetRegionsByCountry/${countryId}`);
  }

  getCitiesByRegion(regionId: number): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/GetCitiesByRegion/${regionId}`);
  }

  getClientsFilteredForUser(userId: string): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.apiUrl}/GetClientsFilteredForUserAccess/${userId}`);
  }
}
