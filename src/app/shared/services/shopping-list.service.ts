import { Subject } from 'rxjs';

import { Ingredient } from '../ingredient.model';

export class ShoppingListService {
  listUpdated = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient('ingredient 1', 0),
    new Ingredient('ingredient 2', 2),
    new Ingredient('ingredient 3', 6),
  ];

  public getShoppingList() {
    return this.ingredients.slice();
  }

  public getIngredient(index: number) {
    return this.ingredients[index];
  }

  public addToList(ingredient: Ingredient) {
    const ing = this.ingredients.find((i) => i.name === ingredient.name);
    if (ing) {
      ing.amount += ingredient.amount;
    } else {
      this.ingredients.push(ingredient);
    }
    this.listUpdated.next(this.getShoppingList());
  }

  public updateIngredient(index: number, ingredient: Ingredient) {
    this.ingredients[index] = ingredient;
    this.listUpdated.next(this.getShoppingList());
  }

  public deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
    this.listUpdated.next(this.getShoppingList());
  }
}
