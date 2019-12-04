import { Recipe } from 'src/app/recipes/recipe.model';
import { Ingredient } from '../ingredient.model';
import { Subject } from 'rxjs';

export class RecipeService {
 recipeSelected = new Subject<Recipe>();
  recipesListUpdated = new Subject<Recipe[]>();

  private recipes: Recipe[] = [];

  public setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesListUpdated.next(recipes);
  }

  public getRecipes() {
    return this.recipes.slice();
  }

  public getRecipe(id: number) {
    return this.getRecipes().find((r: Recipe) => r.id === id );
  }

  public addRecipe(recipe: Recipe) {
    recipe.id = this.getMaxId() + 1;
    this.recipes.push(recipe);
    this.recipesListUpdated.next(this.getRecipes());
  }

  public updateRecipe(id: number, newRecipe: Recipe) {
    this.getRecipes().forEach(r => {
      if (r.id === id) {
        // (r = {...newRecipe});
        r.description = newRecipe.description;
        r.name = newRecipe.name;
        r.imgURL = newRecipe.imgURL;
        r.ingredients = newRecipe.ingredients;
      }
    });
    // let recipe = this.getRecipes().find(r => r.id === id);
    // (recipe = {...newRecipe});
    this.recipesListUpdated.next(this.getRecipes());
  }

  public getMaxId() {
    let max = 0;
    this.getRecipes().forEach(r => {
      if (r.id > max) {
        max = r.id;
      }
    });
    return max;
  }

  deleteRecipe(id: number) {
    const index = this.getRecipes().findIndex(r => r.id === id);
    this.recipes.splice(index, 1);
    this.recipesListUpdated.next(this.getRecipes());
  }
}
