import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PokeAPI, PokemonData } from 'src/interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PokeDataService {
  pokeApi: any;

  constructor(private http: HttpClient) {
    this.pokeApi = environment.defaultUrl;
  }

  fetchService(url: string) {
    return this.http.get<PokeAPI>(url);
  }

  fetchPokemonsService(offset: number, limit: number) {
    return this.http.get<PokeAPI>(
      `${this.pokeApi}?offset=${offset}&limit=${limit}`
    );
  }

  fetchPokemonByNameService(name: string) {
    return this.http.get<PokemonData>(`${this.pokeApi}/${name}`);
  }
}
