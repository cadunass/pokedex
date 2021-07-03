import { PokeDataService } from 'src/services/poke-data.service';
import { PokeAPI, PokemonData, Results } from 'src/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="container">
      <div class="loading" *ngIf="loading"></div>
      <div class="row" *ngIf="pokeList.results.length">
        <div class="col" *ngFor="let poke of pokeList.results">
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
              <a href="#" class="btn btn-primary">See full details</a>
            </div>
          </div>
        </div>
      </div>
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li class="page-item"><a class="page-link" href="#">1</a></li>
          <li class="page-item"><a class="page-link" href="#">2</a></li>
          <li class="page-item"><a class="page-link" href="#">3</a></li>
          <li class="page-item">
            <a class="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  `,
  styles: [],
  providers: [PokeDataService],
})
export class HomeComponent implements OnInit {
  pokeList: PokeAPI;
  loading: boolean = false;

  constructor(private pokeService: PokeDataService) {
    this.pokeList = {
      count: 0,
      next: '',
      results: [],
    };
  }

  async getPokemons(): Promise<PokeAPI> {
    let response = await this.pokeService.getData().toPromise();
    response.results.map((pokemon) => this.getPokemonData(pokemon));

    return response as PokeAPI;
  }

  getPokemonData(pokemon: Results): void {
    this.pokeService
      .getPokemon(pokemon.name)
      .subscribe((data: PokemonData) => (pokemon.data = data));
  }

  async ngOnInit() {
    this.loading = true;
    this.pokeList = await this.getPokemons();
    this.loading = false;
  }
}
