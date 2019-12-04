import { Ingredient } from '../shared/ingredient.model';

export class Recipe {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public imgURL: string,
    public ingredients: Ingredient[]
  ) {}
}
