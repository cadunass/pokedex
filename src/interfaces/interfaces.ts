export interface PokeAPI {
  count: number;
  next: string;
  results: Results[];
}

export interface Results {
  name: string;
  url: string;
  id?: string;
  sprite?: string;
  types?: Array<string>;
  data?: PokemonData;
}

export interface PokemonData {
  name: string;
  id: number;
  sprites: Sprites;
  abilities?: Array<any>;
  types?: Array<any>;
}

export interface Sprites {
  back_default: string;
  back_female: string;
  back_shiny: string;
  back_shiny_female: string;
  front_default: string;
  front_female: string;
  front_shiny: string;
  front_shiny_female: string;
}
