import { PokeDataService } from 'src/services/poke-data.service';
import { PokeAPI, PokemonData, Results } from 'src/interfaces/interfaces';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-wrapper">
      <div class="container" style="padding: 8px">
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
                <a
                  *ngIf="isPokemonAlreadySaved(poke.name)"
                  class="btn btn-primary"
                  (click)="onClickFav(poke.name)"
                >
                  Add to favorites
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="home-wrapper__footer">
        <nav style="margin-top: 16px">
          <ul class="pagination">
            <div class="teste">{{ totalElements }} total pokemons</div>
            <div style="display: flex;">
              <li class="page-item">
                <a class="page-link">
                  <i
                    class="bi bi-chevron-double-left"
                    (click)="onClickChevron('previous')"
                  ></i>
                </a>
              </li>
              <li class="page-item" *ngFor="let page of getTotalPages()">
                <a class="page-link" (click)="onClickPaginate(page)">{{
                  page
                }}</a>
              </li>
              <li class="page-item">
                <a class="page-link">
                  <i
                    class="bi bi-chevron-double-right"
                    (click)="onClickChevron('next')"
                  ></i>
                </a>
              </li>
            </div>
          </ul>
        </nav>
      </div>
    </div>
  `,
  styles: [
    `
      .home-wrapper__footer {
        width: 100%;
        padding: 16px 20px;
        background-color: #f8f9fa !important;
      }

      .pagination {
        justify-content: space-between;
      }

      li {
        cursor: pointer;
      }
    `,
  ],
  providers: [PokeDataService],
})
export class HomeComponent implements OnInit {
  pokeList: PokeAPI;
  loading: boolean = false;
  currentPage: number = 0;
  totalElements: number = 0;
  itemsPerPage: number = 9;
  favorites: Array<string> = [];

  constructor(private pokeService: PokeDataService) {
    this.pokeList = {
      count: 0,
      next: '',
      previous: '',
      results: [],
    };
  }

  async ngOnInit() {
    this.loading = true;

    await this.getPokemons();
    this.totalElements = this.pokeList.count;
    this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    this.loading = false;
  }

  isPokemonAlreadySaved(pokeName: string) {
    return !this.favorites.find((fav) => fav === pokeName);
  }

  onClickPaginate(page: number) {
    this.currentPage = page - 1;

    this.getPokemons();
  }

  async onClickChevron(type: string): Promise<void> {
    const url = type === 'next' ? this.pokeList.next : this.pokeList.previous;

    this.currentPage =
      type === 'next' ? this.currentPage + 1 : this.currentPage - 1;

    const response = await this.pokeService.fetchService(url).toPromise();
    response.results.map((pokemon) => this.getPokemonData(pokemon));

    this.pokeList = response;
  }

  onClickFav(pokeName: string) {
    this.favorites.push(pokeName);
    localStorage.setItem('favorites', JSON.stringify(this.favorites));
  }

  async getPokemons(): Promise<void> {
    this.loading = true;

    const offset = this.currentPage * this.itemsPerPage;
    const response = await this.pokeService
      .fetchPokemonsService(offset, this.itemsPerPage)
      .toPromise();

    response.results.map((pokemon) => this.getPokemonData(pokemon));

    this.pokeList = response;
    this.loading = false;
  }

  getPokemonData(pokemon: Results): void {
    this.pokeService
      .fetchPokemonByNameService(pokemon.name)
      .subscribe((data: PokemonData) => (pokemon.data = data));
  }

  getTotalPages() {
    const pages = Math.ceil(this.totalElements / this.itemsPerPage);

    if (this.currentPage <= 3) {
      return Array.from({ length: pages }, (_, i) => i + 1).slice(0, 5);
    } else {
      return Array.from({ length: pages }, (_, i) => i + 1).slice(
        this.currentPage - 3,
        this.currentPage + 2
      );
    }
  }
}
