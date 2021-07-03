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

  getData() {
    return this.http.get<PokeAPI>(`${this.pokeApi}?limit=9`);
  }

  getPokemon(name: string) {
    return this.http.get<PokemonData>(`${this.pokeApi}/${name}`);
  }
}
