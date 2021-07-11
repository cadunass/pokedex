import { PokeDataService } from 'src/services/poke-data.service';
import { PokeAPI, PokemonData, Results } from 'src/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorites',
  template: `
    <div class="container">
      <div class="loading" *ngIf="loading"></div>
      <div class="row" *ngIf="favoritedPokeList.length">
        <div class="col" *ngFor="let poke of favoritedPokeList">
          <div class="card" style="width: 18rem" *ngIf="poke.data">
            <img
              alt="Pokemon sprite"
              class="card-img-top"
              src="{{ poke.data.sprites.front_default }}"
            />
            <div class="card-body">
              <h5 class="card-title">#{{ poke.data.id }}</h5>
              <h3 class="card-title">{{ poke.name }}</h3>
              <div class="row">
                <p *ngFor="let type of poke.data.types" class="card-text">
                  {{ type.type.name }}
                </p>
              </div>
              <a class="btn btn-primary" (click)="onClickRemove(poke.name)">
                Remove from favorites
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class FavoritesComponent implements OnInit {
  favoritedPokeList: Array<any> = [];
  loading: boolean = false;

  constructor(private pokeService: PokeDataService) {}

  async ngOnInit() {
    this.loading = true;

    await this.getPokemons();

    this.loading = false;
  }

  onClickRemove(pokeName: string) {
    console.log('todo', pokeName);
  }

  async getPokemons(): Promise<void> {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const response = await this.pokeService
      .fetchPokemonsService(0, 1118)
      .toPromise();

    if (favorites.length) {
      response.results.map(async (pokemon) => {
        const favoritedPoke = favorites.find(
          (fav: string) => fav === pokemon.name
        );

        if (favoritedPoke) {
          await this.getPokemonData(pokemon);
          this.favoritedPokeList.push(pokemon);
        }
      });
    }
  }

  getPokemonData(pokemon: Results): void {
    this.pokeService
      .fetchPokemonByNameService(pokemon.name)
      .subscribe((data: PokemonData) => (pokemon.data = data));
  }
}
