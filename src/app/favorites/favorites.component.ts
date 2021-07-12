import { PokeDataService } from 'src/services/poke-data.service';
import { PokeAPI, PokemonData, Results } from 'src/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-favorites',
  template: `
    <div class="container" style="padding: 8px">
      <div class="row" *ngIf="favoritedPokeList.length">
        <div class="col" *ngFor="let poke of favoritedPokeList">
          <div class="card" style="width: 18rem" *ngIf="poke.data">
            <img
              alt="Pokemon sprite"
              class="card-img-top"
              src="{{ poke.data.sprites.front_default }}"
            />
            <div class="card-body">
              <div class="d-flex justify-content-center">
                <h3 class="card-title">{{ poke.name }} #{{ poke.data.id }}</h3>
              </div>
              <div class="d-flex" style="justify-content: space-evenly">
                <p
                  *ngFor="let type of poke.data.types"
                  class="badge badge-info"
                >
                  {{ type.type.name }}
                </p>
              </div>
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
          (fav: string) => fav === pokemon.name.toUpperCase()
        );

        if (favoritedPoke) {
          await this.getPokemonData(pokemon);
          this.favoritedPokeList.push(pokemon);
        }
      });
    }
  }

  async getPokemonData(pokemon: Results): Promise<void> {
    const { name } = pokemon;

    await this.pokeService
      .fetchPokemonByNameService(name)
      .subscribe((data: PokemonData) => {
        pokemon.name = name.toUpperCase();
        pokemon.data = data;
      });
  }
}
